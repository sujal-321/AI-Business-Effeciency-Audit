import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { config } from "@/lib/config";
import { businessProfileSchema, competitorListSchema, opportunityListSchema, reportNarrativeSchema, seoReportSchema } from "@/lib/schemas";
import { retry } from "@/lib/utils";
import type { AutomationOpportunity, BusinessProfile, Competitor, RoadmapItem, ScrapedSite, SeoReport } from "@/lib/types";

let client: OpenAI | undefined;
function openai() {
  if (!config.openaiKey) throw new Error("OPENAI_API_KEY is required outside demo mode");
  return client ??= new OpenAI({ apiKey: config.openaiKey, timeout: 60_000, maxRetries: 2 });
}

async function structured<T>(name: string, schema: Parameters<typeof zodResponseFormat>[0], system: string, user: string): Promise<T> {
  return retry(async () => {
    const completion = await openai().chat.completions.parse({
      model: config.openaiModel, temperature: 0.2,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: zodResponseFormat(schema, name),
    });
    const parsed = completion.choices[0]?.message.parsed;
    if (!parsed) throw new Error(completion.choices[0]?.message.refusal ?? `No ${name} returned`);
    return parsed as T;
  }, 3, 900);
}

const evidenceRule = "Use only defensible conclusions from the supplied site evidence. Be specific, commercially literate, concise, and never invent exact company facts. Estimates must be realistic USD planning ranges expressed as midpoint numbers.";

export function analyzeProfile(companyName: string, site: ScrapedSite) {
  return structured<BusinessProfile>("business_profile", businessProfileSchema,
    `You are a senior business analyst. ${evidenceRule}`,
    `Analyze ${companyName}. Return its business profile.\n\nWEBSITE EVIDENCE:\n${site.combined}`);
}

export function analyzeSeo(site: ScrapedSite) {
  const metadata = site.pages.map((p) => ({ url: p.url, metadata: p.metadata, words: p.markdown.split(/\s+/).length }));
  return structured<SeoReport>("seo_audit", seoReportSchema,
    `You are a technical SEO director. Score the supplied pages from 0-100. ${evidenceRule} Note that crawl speed measurements are unavailable; do not claim measured Core Web Vitals.`,
    `Produce the SEO audit using content and metadata evidence. Include at least 4 findings and recommendations.\n\nPAGE DATA:${JSON.stringify(metadata)}\n\nCONTENT:\n${site.combined}`);
}

export async function analyzeCompetitors(companyName: string, profile: BusinessProfile, site: ScrapedSite): Promise<Competitor[]> {
  const result = await structured<{ competitors: Competitor[] }>("competitor_analysis", competitorListSchema,
    `You are a market intelligence consultant. ${evidenceRule} Choose three plausible named competitors. Clearly ground comparisons in the analyzed company's visible positioning; competitor observations are directional hypotheses, not scraped facts.`,
    `Identify and compare 3 competitors for ${companyName}. PROFILE:${JSON.stringify(profile)}\n\nSITE:${site.combined.slice(0, 35_000)}`);
  return result.competitors;
}

export async function analyzeOpportunities(profile: BusinessProfile): Promise<AutomationOpportunity[]> {
  const result = await structured<{ opportunities: AutomationOpportunity[] }>("automation_portfolio", opportunityListSchema,
    `You are a senior AI automation consultant. Generate 10-12 distinct, implementable opportunities. Cover lead generation, support, operations, reporting, and AI agents. ${evidenceRule} hours_saved is monthly; cost_savings and revenue_opportunity are monthly; monthly_roi equals their sum and annual_roi equals monthly_roi times 12.`,
    `Build an automation portfolio for this company profile:\n${JSON.stringify(profile)}`);
  return result.opportunities.map((item) => ({ ...item, monthly_roi: item.cost_savings + item.revenue_opportunity, annual_roi: (item.cost_savings + item.revenue_opportunity) * 12 }));
}

export async function writeNarrative(companyName: string, profile: BusinessProfile, seo: SeoReport, opportunities: AutomationOpportunity[]): Promise<{ executive_summary: string; roadmap: RoadmapItem[] }> {
  const top = [...opportunities].sort((a, b) => b.monthly_roi - a.monthly_roi).slice(0, 6);
  return structured("report_narrative", reportNarrativeSchema,
    `You are a partner at a premium AI transformation consultancy. Write decisive, useful prose without hype. ${evidenceRule}`,
    `Create an executive summary and a cumulative 30/60/90-day roadmap for ${companyName}. PROFILE:${JSON.stringify(profile)} SEO:${JSON.stringify(seo)} PRIORITIES:${JSON.stringify(top)}`);
}
