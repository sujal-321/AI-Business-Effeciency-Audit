import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";
import { seededAudits } from "@/lib/demo-data";
import type { AuditRecord, AuditStatus, AutomationOpportunity, BusinessProfile, Competitor, RoadmapItem, SeoReport } from "@/lib/types";

type ListOptions = { search?: string; status?: string; page?: number; limit?: number };

interface Repository {
  create(input: Pick<AuditRecord, "company_name" | "website_url" | "email">): Promise<AuditRecord>;
  get(id: string): Promise<AuditRecord | null>;
  list(options?: ListOptions): Promise<{ audits: AuditRecord[]; total: number }>;
  progress(id: string, status: AuditStatus, progress: number, currentStep: string): Promise<void>;
  complete(id: string, data: { profile: BusinessProfile; seo: SeoReport; competitors: Competitor[]; opportunities: AutomationOpportunity[]; executive_summary: string; roadmap: RoadmapItem[]; report_html: string }): Promise<AuditRecord>;
  fail(id: string, message: string): Promise<void>;
}

declare global { var __auditDemoStore: Map<string, AuditRecord> | undefined }
const demoStore = globalThis.__auditDemoStore ?? new Map(seededAudits.map((item) => [item.id, item]));
globalThis.__auditDemoStore = demoStore;

class DemoRepository implements Repository {
  async create(input: Pick<AuditRecord, "company_name" | "website_url" | "email">) {
    const item: AuditRecord = { id: crypto.randomUUID(), ...input, status: "queued", progress: 4, current_step: "Queued for analysis", created_at: new Date().toISOString(), completed_at: null, error: null };
    demoStore.set(item.id, item); return item;
  }
  async get(id: string) { return demoStore.get(id) ?? null; }
  async list(options: ListOptions = {}) {
    const { search = "", status = "all", page = 1, limit = 10 } = options;
    let items = [...demoStore.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (search) items = items.filter((item) => `${item.company_name} ${item.email} ${item.website_url}`.toLowerCase().includes(search.toLowerCase()));
    if (status !== "all") items = items.filter((item) => item.status === status);
    return { audits: items.slice((page - 1) * limit, page * limit), total: items.length };
  }
  async progress(id: string, status: AuditStatus, progress: number, currentStep: string) { const item = demoStore.get(id); if (item) demoStore.set(id, { ...item, status, progress, current_step: currentStep }); }
  async complete(id: string, data: Parameters<Repository["complete"]>[1]) {
    const item = demoStore.get(id); if (!item) throw new Error("Audit not found");
    const complete: AuditRecord = { ...item, ...data, status: "completed", progress: 100, current_step: "Audit complete", completed_at: new Date().toISOString(), pdf_url: `/api/audits/${id}/pdf` };
    demoStore.set(id, complete); return complete;
  }
  async fail(id: string, message: string) { const item = demoStore.get(id); if (item) demoStore.set(id, { ...item, status: "failed", current_step: "Analysis failed", error: message }); }
}

class SupabaseRepository implements Repository {
  constructor(private db: SupabaseClient) {}
  async create(input: Pick<AuditRecord, "company_name" | "website_url" | "email">) { const { data, error } = await this.db.from("audits").insert(input).select().single(); if (error) throw error; return data; }
  async get(id: string) {
    const { data, error } = await this.db.from("audits").select("*, business_profiles(*), seo_reports(*), competitors(*), automation_opportunities(*), final_reports(*)").eq("id", id).maybeSingle();
    if (error) throw error; if (!data) return null;
    return hydrate(data);
  }
  async list(options: ListOptions = {}) {
    const { search = "", status = "all", page = 1, limit = 10 } = options;
    let query = this.db.from("audits").select("*, automation_opportunities(monthly_roi)", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (search) query = query.or(`company_name.ilike.%${search}%,email.ilike.%${search}%`);
    if (status !== "all") query = query.eq("status", status);
    const { data, error, count } = await query; if (error) throw error;
    return { audits: (data ?? []).map(hydrate), total: count ?? 0 };
  }
  async progress(id: string, status: AuditStatus, progress: number, currentStep: string) { const { error } = await this.db.from("audits").update({ status, progress, current_step: currentStep }).eq("id", id); if (error) throw error; }
  async complete(id: string, payload: Parameters<Repository["complete"]>[1]) {
    const { profile, seo, competitors, opportunities, executive_summary, roadmap, report_html } = payload;
    const calls = [
      this.db.from("business_profiles").upsert({ audit_id: id, ...profile }), this.db.from("seo_reports").upsert({ audit_id: id, ...seo }),
      this.db.from("competitors").delete().eq("audit_id", id), this.db.from("automation_opportunities").delete().eq("audit_id", id),
      this.db.from("final_reports").upsert({ audit_id: id, executive_summary, roadmap, report_html, pdf_url: `/api/audits/${id}/pdf` }),
    ];
    const results = await Promise.all(calls); const failed = results.find((result) => result.error); if (failed?.error) throw failed.error;
    const inserts = await Promise.all([this.db.from("competitors").insert(competitors.map((x) => ({ audit_id: id, ...x }))), this.db.from("automation_opportunities").insert(opportunities.map((x) => ({ audit_id: id, ...x })))]);
    if (inserts[0].error) throw inserts[0].error; if (inserts[1].error) throw inserts[1].error;
    await this.db.from("audits").update({ status: "completed", progress: 100, current_step: "Audit complete", completed_at: new Date().toISOString() }).eq("id", id);
    const record = await this.get(id); if (!record) throw new Error("Audit disappeared after completion"); return record;
  }
  async fail(id: string, message: string) { await this.db.from("audits").update({ status: "failed", current_step: "Analysis failed", error: message.slice(0, 500) }).eq("id", id); }
}

function hydrate(row: Record<string, any>): AuditRecord {
  const report = Array.isArray(row.final_reports) ? row.final_reports[0] : row.final_reports;
  const profile = Array.isArray(row.business_profiles) ? row.business_profiles[0] : row.business_profiles;
  const seo = Array.isArray(row.seo_reports) ? row.seo_reports[0] : row.seo_reports;
  return {
    id: row.id, company_name: row.company_name, website_url: row.website_url, email: row.email,
    status: row.status, progress: row.progress, current_step: row.current_step,
    created_at: row.created_at, completed_at: row.completed_at, error: row.error,
    profile, seo,
    competitors: row.competitors ?? [],
    opportunities: row.automation_opportunities ?? [],
    executive_summary: report?.executive_summary ?? "",
    roadmap: report?.roadmap ?? [],
    report_html: report?.report_html ?? "",
    pdf_url: report?.pdf_url ?? "",
  };
}

let singleton: Repository | undefined;
export function getRepository(): Repository {
  if (singleton) return singleton;
  if (!config.demoMode) {
    if (!config.supabaseUrl || !config.supabaseKey) throw new Error("Supabase credentials required in production mode");
    singleton = new SupabaseRepository(createClient(config.supabaseUrl, config.supabaseKey, { auth: { persistSession: false } }));
  } else {
    singleton = new DemoRepository();
  }
  return singleton;
}
