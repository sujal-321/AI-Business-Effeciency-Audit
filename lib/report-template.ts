import { config } from "@/lib/config";
import type { AuditRecord } from "@/lib/types";
import { esc, formatCurrency } from "@/lib/utils";

export function createReportHtml(audit: AuditRecord) {
  const total = audit.opportunities?.reduce((sum, item) => sum + item.monthly_roi, 0) ?? 0;
  const hours = audit.opportunities?.reduce((sum, item) => sum + item.hours_saved, 0) ?? 0;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body{font-family:Inter,Arial,sans-serif;color:#111;background:#fff;margin:0}.page{max-width:920px;margin:auto;padding:72px}h1{font-size:56px;line-height:1;margin:24px 0}h2{margin-top:56px;font-size:28px}p{line-height:1.65;color:#444}.cover{background:#0c0d0d;color:white;padding:80px;border-radius:0 0 40px 40px}.cover p{color:#bbb}.eyebrow{color:${config.agencyAccent};text-transform:uppercase;letter-spacing:.15em;font-weight:700}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{border:1px solid #ddd;border-radius:16px;padding:20px}.metric{font-size:32px;font-weight:700}.item{border-top:1px solid #ddd;padding:20px 0}.pill{display:inline-block;background:#eef1ff;padding:6px 10px;border-radius:99px;font-size:12px}.muted{color:#777}@media print{.page{padding:48px}.cover{border-radius:0}}
  </style></head><body><section class="cover"><div class="eyebrow">${esc(config.agencyName)} / Intelligence brief</div><h1>${esc(audit.company_name)}<br>AI efficiency audit</h1><p>Independent opportunity assessment · ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p></section><main class="page">
  <div class="grid"><div class="card"><div class="muted">Monthly upside</div><div class="metric">${formatCurrency(total, true)}</div></div><div class="card"><div class="muted">Hours reclaimed</div><div class="metric">${hours}</div></div><div class="card"><div class="muted">SEO readiness</div><div class="metric">${audit.seo?.seo_score ?? 0}/100</div></div></div>
  <h2>Executive summary</h2><p>${esc(audit.executive_summary ?? "")}</p><h2>Business overview</h2><p>${esc(audit.profile?.company_summary ?? "")}</p>
  <h2>SEO & website analysis</h2>${audit.seo?.findings.map((x) => `<div class="item"><span class="pill">${esc(x.impact)} impact</span><h3>${esc(x.title)}</h3><p>${esc(x.detail)}</p></div>`).join("")}
  <h2>Competitive landscape</h2>${audit.competitors?.map((x) => `<div class="item"><h3>${esc(x.competitor_name)}</h3><p><b>Where they lead:</b> ${x.strengths.map(esc).join(" · ")}<br><b>Opening:</b> ${x.opportunities.map(esc).join(" · ")}</p></div>`).join("")}
  <h2>Automation portfolio</h2>${audit.opportunities?.map((x, i) => `<div class="item"><span class="pill">${esc(x.priority)}</span><h3>${i + 1}. ${esc(x.problem)}</h3><p>${esc(x.solution)}</p><p><b>${x.hours_saved} hours/mo · ${formatCurrency(x.monthly_roi)}/mo upside · ${esc(x.implementation_difficulty)} complexity</b></p></div>`).join("")}
  <h2>Recommended AI roadmap</h2>${audit.roadmap?.map((x) => `<div class="item"><div class="eyebrow">${esc(x.period)}</div><h3>${esc(x.title)}</h3><p>${x.actions.map(esc).join(" · ")}</p></div>`).join("")}
  <h2>Final recommendation</h2><p>Start with one visible revenue workflow and one internal capacity workflow. Establish baseline metrics before launch, review weekly, and only scale automations that demonstrate measurable adoption and business impact.</p>
  </main></body></html>`;
}
