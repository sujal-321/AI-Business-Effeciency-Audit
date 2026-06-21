export type AuditStatus = "queued" | "scraping" | "analyzing" | "seo" | "opportunities" | "reporting" | "completed" | "failed";

export interface BusinessProfile {
  industry: string;
  business_model: string;
  target_audience: string;
  services: string[];
  pain_points: string[];
  company_summary: string;
}

export interface SeoReport {
  seo_score: number;
  technical_score: number;
  content_score: number;
  findings: { title: string; impact: "high" | "medium" | "low"; detail: string }[];
  recommendations: string[];
}

export interface Competitor {
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export interface AutomationOpportunity {
  problem: string;
  solution: string;
  hours_saved: number;
  cost_savings: number;
  revenue_opportunity: number;
  monthly_roi: number;
  annual_roi: number;
  implementation_difficulty: "Low" | "Medium" | "High";
  priority: "Now" | "Next" | "Later";
  category: "Lead generation" | "Customer experience" | "Operations" | "AI agents" | "Data & reporting";
}

export interface RoadmapItem { period: "30 days" | "60 days" | "90 days"; title: string; actions: string[] }

export interface RedFlag {
  title: string;
  reason: string;
  risk: "high" | "medium" | "low";
}

export interface AuditRecord {
  id: string;
  company_name: string;
  website_url: string;
  email: string;
  status: AuditStatus;
  progress: number;
  current_step: string;
  created_at: string;
  completed_at: string | null;
  error: string | null;
  profile?: BusinessProfile;
  seo?: SeoReport;
  competitors?: Competitor[];
  opportunities?: AutomationOpportunity[];
  executive_summary?: string;
  roadmap?: RoadmapItem[];
  red_flags?: RedFlag[];
  report_html?: string;
  pdf_url?: string;
}

export interface ScrapedSite {
  pages: { title: string; url: string; markdown: string; metadata?: Record<string, unknown> }[];
  combined: string;
}
