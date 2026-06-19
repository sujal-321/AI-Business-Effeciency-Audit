import type { AuditRecord } from "@/lib/types";

const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString();

export function createDemoResult(id: string, companyName: string, websiteUrl: string, email: string): AuditRecord {
  const opportunities = [
    ["Slow inbound lead response", "Deploy an AI lead concierge that qualifies, enriches, and routes every inquiry in under 60 seconds.", 32, 2400, 7000, "Low", "Now", "Lead generation"],
    ["Manual prospect research", "Create an enrichment agent that builds account briefs and personalized outreach angles automatically.", 44, 3300, 5200, "Medium", "Now", "AI agents"],
    ["Repeated support questions", "Ground a customer-facing assistant in approved service, pricing, and policy content with human handoff.", 58, 4350, 1800, "Medium", "Now", "Customer experience"],
    ["Leads lost after first contact", "Run behavior-aware email and SMS nurture sequences with CRM status synchronization.", 26, 1950, 6400, "Low", "Now", "Lead generation"],
    ["Reporting assembled by hand", "Unify sales, marketing, and delivery KPIs in an automated weekly executive digest.", 18, 1350, 900, "Low", "Next", "Data & reporting"],
    ["Inconsistent sales proposals", "Generate on-brand proposals from discovery notes, approved case studies, and pricing guardrails.", 22, 1650, 3600, "Medium", "Next", "Operations"],
    ["Unstructured customer feedback", "Classify calls, tickets, and reviews into themes, urgency, and product signals.", 20, 1500, 1200, "Medium", "Next", "Data & reporting"],
    ["High-friction client onboarding", "Orchestrate forms, document collection, kickoff scheduling, and internal task creation.", 30, 2250, 1600, "Medium", "Next", "Operations"],
    ["Content production bottleneck", "Build a human-reviewed content system from customer questions and search demand.", 35, 2625, 2500, "Medium", "Later", "Lead generation"],
    ["Knowledge trapped across tools", "Deploy a permission-aware internal knowledge assistant for policies, process, and delivery playbooks.", 40, 3000, 1000, "High", "Later", "AI agents"],
  ].map(([problem, solution, hours, savings, revenue, difficulty, priority, category]) => ({
    problem: String(problem), solution: String(solution), hours_saved: Number(hours), cost_savings: Number(savings), revenue_opportunity: Number(revenue),
    monthly_roi: Number(savings) + Number(revenue), annual_roi: (Number(savings) + Number(revenue)) * 12,
    implementation_difficulty: difficulty as "Low" | "Medium" | "High", priority: priority as "Now" | "Next" | "Later", category: category as "Lead generation",
  }));

  return {
    id, company_name: companyName, website_url: websiteUrl, email, status: "completed", progress: 100, current_step: "Audit complete",
    created_at: new Date().toISOString(), completed_at: new Date().toISOString(), error: null,
    profile: {
      industry: "Professional Services", business_model: "Expert-led B2B services with consultative sales",
      target_audience: "Growth-minded small and mid-market companies seeking a dependable specialist partner",
      services: ["Strategy & advisory", "Managed implementation", "Ongoing optimization", "Customer support"],
      pain_points: ["Long lead-response cycles", "Manual client onboarding", "Fragmented reporting", "Inconsistent follow-up"],
      company_summary: `${companyName} presents as a specialist services company with a strong consultative proposition. Its clearest growth lever is turning existing expertise into faster, more consistent digital journeys—from first website visit through qualification, delivery, and expansion.`,
    },
    seo: {
      seo_score: 64, technical_score: 71, content_score: 57,
      findings: [
        { title: "Search intent is under-served", impact: "high", detail: "Core pages explain capabilities but do not capture enough problem-aware and comparison-stage demand." },
        { title: "Metadata needs sharper differentiation", impact: "medium", detail: "Several title and description patterns could communicate outcomes and geography more clearly." },
        { title: "Internal linking is shallow", impact: "medium", detail: "Service, proof, and educational content are not connected into strong topical clusters." },
        { title: "Conversion proof arrives late", impact: "high", detail: "Trust signals and quantified outcomes should appear earlier on commercial pages." },
      ],
      recommendations: ["Build one search-led pillar page per priority service", "Add outcome-specific titles and descriptions", "Publish proof-rich case studies with structured data", "Create contextual links between insights, services, and conversion pages"],
    },
    competitors: [
      { competitor_name: "Apex Advisory", strengths: ["Clear category positioning", "Strong proof library"], weaknesses: ["Generic nurture journey", "Dense service pages"], opportunities: ["Win on response speed", "Show a simpler buying path"] },
      { competitor_name: "Momentum Works", strengths: ["Modern brand", "Educational content"], weaknesses: ["Weak differentiation", "Limited ROI evidence"], opportunities: ["Own the outcome narrative", "Publish quantified results"] },
      { competitor_name: "Northline Partners", strengths: ["Established reputation", "Broad offering"], weaknesses: ["Dated experience", "Slow conversion path"], opportunities: ["Lead with specialist expertise", "Offer an interactive assessment"] },
    ],
    opportunities,
    executive_summary: `${companyName} has a credible market proposition and a practical path to unlock meaningful capacity without adding proportional headcount. The audit identifies a near-term automation portfolio worth approximately $46K per month across cost savings and growth upside. The first 30 days should focus on lead response, qualification, and support deflection—high-visibility wins that create the data foundation for deeper operational automation.`,
    roadmap: [
      { period: "30 days", title: "Capture the quick wins", actions: ["Launch lead qualification and routing", "Instrument conversion events and response SLAs", "Create the approved knowledge base"] },
      { period: "60 days", title: "Connect the revenue engine", actions: ["Automate nurture and proposal workflows", "Unify CRM lifecycle data", "Deploy weekly performance intelligence"] },
      { period: "90 days", title: "Scale the operating system", actions: ["Orchestrate onboarding and delivery handoffs", "Launch internal knowledge assistant", "Measure ROI and prioritize the second wave"] },
    ],
    report_html: "", pdf_url: `/api/audits/${id}/pdf`,
  };
}

export const seededAudits: AuditRecord[] = [
  createDemoResult("demo-acme", "Acme Advisory", "https://acme.example", "alex@acme.example"),
  createDemoResult("demo-luma", "Luma Health", "https://luma.example", "team@luma.example"),
  createDemoResult("demo-north", "North & Co.", "https://north.example", "hello@north.example"),
].map((audit, index) => ({ ...audit, created_at: ago(index * 3 + 1), completed_at: ago(index * 3 + 1), opportunities: audit.opportunities?.map((o) => ({ ...o, monthly_roi: o.monthly_roi - index * 550, annual_roi: (o.monthly_roi - index * 550) * 12 })) }));
