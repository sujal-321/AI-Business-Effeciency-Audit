import { config } from "@/lib/config";
import { createDemoResult } from "@/lib/demo-data";
import { analyzeCompetitors, analyzeOpportunities, analyzeProfile, analyzeSeo, writeNarrative } from "@/lib/ai";
import { deliverReport, notifyWebhook } from "@/lib/delivery";
import { scrapeWebsite } from "@/lib/firecrawl";
import { logger } from "@/lib/logger";
import { createReportHtml } from "@/lib/report-template";
import { getRepository } from "@/lib/repository";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processAudit(id: string) {
  const repo = getRepository(); const audit = await repo.get(id);
  if (!audit) throw new Error("Audit not found");
  if (audit.status === "completed") return audit;
  try {
    logger.info("audit.started", { auditId: id, demoMode: config.demoMode });
    if (config.demoMode) {
      for (const [status, progress, step] of [["scraping", 18, "Reading priority website pages"], ["analyzing", 38, "Building the business profile"], ["seo", 55, "Scoring website and search readiness"], ["opportunities", 74, "Modeling automation opportunities"], ["reporting", 91, "Assembling the consulting report"]] as const) { await repo.progress(id, status, progress, step); await wait(260); }
      const result = createDemoResult(id, audit.company_name, audit.website_url, audit.email);
      const report_html = createReportHtml(result);
      const complete = await repo.complete(id, { profile: result.profile!, seo: result.seo!, competitors: result.competitors!, opportunities: result.opportunities!, executive_summary: result.executive_summary!, roadmap: result.roadmap!, red_flags: result.red_flags!, report_html });
      logger.info("audit.completed", { auditId: id }); return complete;
    }
    await repo.progress(id, "scraping", 15, "Reading priority website pages"); const site = await scrapeWebsite(audit.website_url);
    await repo.progress(id, "analyzing", 34, "Building the business profile"); const profile = await analyzeProfile(audit.company_name, site);
    await repo.progress(id, "seo", 51, "Scoring website and search readiness"); const [seo, competitors, opportunities] = await Promise.all([analyzeSeo(site), analyzeCompetitors(audit.company_name, profile, site), analyzeOpportunities(profile)]);
    await repo.progress(id, "opportunities", 76, "Prioritizing the automation portfolio"); const narrative = await writeNarrative(audit.company_name, profile, seo, opportunities);
    await repo.progress(id, "reporting", 91, "Assembling the consulting report"); const draft = { ...audit, profile, seo, competitors, opportunities, ...narrative }; const report_html = createReportHtml(draft);
    const complete = await repo.complete(id, { profile, seo, competitors, opportunities, ...narrative, report_html });
    await Promise.allSettled([deliverReport(complete), notifyWebhook(complete)]); logger.info("audit.completed", { auditId: id }); return complete;
  } catch (error) {
    logger.error("audit.failed", error, { auditId: id }); await repo.fail(id, error instanceof Error ? error.message : "Unknown processing error"); throw error;
  }
}
