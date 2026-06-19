import { z } from "zod";

export const auditInputSchema = z.object({
  company_name: z.string().trim().min(2).max(120),
  website_url: z.string().trim().url().refine((url) => /^https?:\/\//i.test(url), "Use an HTTP(S) URL"),
  email: z.string().trim().email().max(254),
});

export const businessProfileSchema = z.object({
  industry: z.string(), business_model: z.string(), target_audience: z.string(),
  services: z.array(z.string()).min(1), pain_points: z.array(z.string()).min(1), company_summary: z.string(),
});

export const seoReportSchema = z.object({
  seo_score: z.number().min(0).max(100), technical_score: z.number().min(0).max(100), content_score: z.number().min(0).max(100),
  findings: z.array(z.object({ title: z.string(), impact: z.enum(["high", "medium", "low"]), detail: z.string() })).min(3),
  recommendations: z.array(z.string()).min(3),
});

export const competitorListSchema = z.object({ competitors: z.array(z.object({
  competitor_name: z.string(), strengths: z.array(z.string()), weaknesses: z.array(z.string()), opportunities: z.array(z.string()),
})).length(3) });

export const opportunityListSchema = z.object({ opportunities: z.array(z.object({
  problem: z.string(), solution: z.string(), hours_saved: z.number().nonnegative(), cost_savings: z.number().nonnegative(),
  revenue_opportunity: z.number().nonnegative(), monthly_roi: z.number().nonnegative(), annual_roi: z.number().nonnegative(),
  implementation_difficulty: z.enum(["Low", "Medium", "High"]), priority: z.enum(["Now", "Next", "Later"]),
  category: z.enum(["Lead generation", "Customer experience", "Operations", "AI agents", "Data & reporting"]),
})).min(10) });

export const reportNarrativeSchema = z.object({
  executive_summary: z.string(),
  roadmap: z.array(z.object({ period: z.enum(["30 days", "60 days", "90 days"]), title: z.string(), actions: z.array(z.string()).min(2) })).length(3),
});

export type AuditInput = z.infer<typeof auditInputSchema>;
