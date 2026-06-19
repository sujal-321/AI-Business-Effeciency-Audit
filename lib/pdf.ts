import PDFDocument from "pdfkit";
import type { AuditRecord } from "@/lib/types";
import { config } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

const colors = { ink: "#101111", blue: config.agencyAccent, pale: "#F1F3F7", gray: "#676B73", lime: "#D8FF63", white: "#FFFFFF" };

export async function generateAuditPdf(audit: AuditRecord): Promise<Buffer> {
  if (config.gotenbergUrl && audit.report_html) {
    const form = new FormData(); form.append("files", new Blob([audit.report_html], { type: "text/html" }), "index.html");
    const response = await fetch(`${config.gotenbergUrl.replace(/\/$/, "")}/forms/chromium/convert/html`, { method: "POST", body: form, signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`Gotenberg returned ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true, info: { Title: `${audit.company_name} AI Efficiency Audit`, Author: config.agencyName } });
    const chunks: Buffer[] = []; doc.on("data", (chunk) => chunks.push(Buffer.from(chunk))); doc.on("end", () => resolve(Buffer.concat(chunks))); doc.on("error", reject);
    const width = doc.page.width; const height = doc.page.height; const left = 54; const content = width - 108;
    const total = audit.opportunities?.reduce((sum, x) => sum + x.monthly_roi, 0) ?? 0;
    const hours = audit.opportunities?.reduce((sum, x) => sum + x.hours_saved, 0) ?? 0;
    const clip = (value: string, max: number) => value.length > max ? `${value.slice(0, max - 1).trim()}...` : value;
    let pageNumber = 1;
    const footer = () => {
      doc.font("Helvetica").fontSize(7.5).fillColor(colors.gray).text(`${config.agencyName}  /  Confidential opportunity assessment`, left, height - 34, { width: 380, lineBreak: false });
      doc.text(String(pageNumber), width - 75, height - 34, { width: 21, align: "right", lineBreak: false });
    };
    const newPage = (title: string, kicker: string) => {
      if (pageNumber > 1) footer(); doc.addPage({ size: "A4", margin: 0 }); pageNumber += 1;
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.blue).text(kicker.toUpperCase(), left, 58, { characterSpacing: 1.5, lineBreak: false });
      doc.fontSize(25).fillColor(colors.ink).text(title, left, 82, { width: content, lineBreak: false });
      doc.moveTo(left, 124).lineTo(width - left, 124).strokeColor("#E3E5E8").lineWidth(1).stroke();
    };
    const paragraphAt = (text: string, y: number, size = 10.5, maxHeight = 125) => {
      doc.font("Helvetica").fontSize(size).fillColor("#454A52").text(text, left, y, { width: content, lineGap: 4, height: maxHeight, ellipsis: true });
    };

    // Cover
    doc.rect(0, 0, width, height).fill(colors.ink);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.lime).text(`${config.agencyName.toUpperCase()} / INTELLIGENCE BRIEF`, left, 68, { characterSpacing: 1.5, lineBreak: false });
    doc.fontSize(42).fillColor(colors.white).text(clip(audit.company_name, 34), left, 180, { width: content, height: 105, ellipsis: true });
    doc.font("Helvetica").fontSize(27).fillColor("#AEB3BB").text("AI business\nefficiency audit", left, 298, { width: 300, lineGap: 5 });
    doc.roundedRect(left, 572, content, 110, 14).fill("#191B1D");
    const metrics = [[formatCurrency(total, true), "MONTHLY VALUE IDENTIFIED"], [String(hours), "HOURS RECLAIMED / MONTH"], [`${audit.seo?.seo_score ?? 0}/100`, "SEO READINESS"]];
    metrics.forEach(([value, label], index) => { const x = left + 22 + index * 164; doc.font("Helvetica-Bold").fontSize(21).fillColor(colors.white).text(value, x, 596, { width: 145, lineBreak: false }); doc.font("Helvetica").fontSize(7.5).fillColor("#9DA2AA").text(label, x, 629, { width: 145, lineBreak: false }); });
    doc.fontSize(8.5).fillColor("#8B9097").text(`Prepared ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, left, 752, { lineBreak: false });

    // Executive overview
    newPage("The opportunity in one page", "Executive summary");
    paragraphAt(audit.executive_summary ?? "", 155, 11, 155);
    doc.font("Helvetica-Bold").fontSize(18).fillColor(colors.ink).text("Business context", left, 337, { lineBreak: false });
    paragraphAt(audit.profile?.company_summary ?? "", 372, 10, 105);
    doc.roundedRect(left, 505, content, 118, 12).fill(colors.pale);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.ink).text("BUSINESS MODEL", left + 20, 527, { characterSpacing: .7, lineBreak: false });
    doc.font("Helvetica").fontSize(9.5).fillColor(colors.gray).text(clip(audit.profile?.business_model ?? "", 135), left + 20, 550, { width: 205, height: 52, ellipsis: true });
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.ink).text("PRIMARY AUDIENCE", left + 260, 527, { characterSpacing: .7, lineBreak: false });
    doc.font("Helvetica").fontSize(9.5).fillColor(colors.gray).text(clip(audit.profile?.target_audience ?? "", 135), left + 260, 550, { width: 205, height: 52, ellipsis: true });
    doc.font("Helvetica-Bold").fontSize(18).fillColor(colors.ink).text("Priority signal", left, 662, { lineBreak: false });
    doc.roundedRect(left, 696, content, 56, 10).fill(colors.blue);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.white).text(`${audit.opportunities?.filter((x) => x.priority === "Now").length ?? 0} start-now workflows  /  ${formatCurrency(total * 12, true)} annual modeled value`, left + 20, 718, { lineBreak: false });

    // SEO
    newPage("Website & search readiness", "Diagnostic");
    const scores = [["Overall SEO", audit.seo?.seo_score ?? 0], ["Technical foundation", audit.seo?.technical_score ?? 0], ["Content readiness", audit.seo?.content_score ?? 0]] as const;
    scores.forEach(([label, score], index) => { const y = 158 + index * 54; doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.ink).text(label, left, y, { lineBreak: false }); doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.gray).text(`${score}/100`, width - 104, y, { width: 50, align: "right", lineBreak: false }); doc.roundedRect(left, y + 22, content, 7, 3.5).fill("#E4E7EC"); doc.roundedRect(left, y + 22, content * score / 100, 7, 3.5).fill(colors.blue); });
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.gray).text("KEY FINDINGS", left, 335, { characterSpacing: 1.2, lineBreak: false });
    (audit.seo?.findings ?? []).slice(0, 4).forEach((item, index) => { const y = 368 + index * 91; doc.circle(left + 10, y + 10, 10).fill(item.impact === "high" ? colors.blue : "#D6DAE1"); doc.font("Helvetica-Bold").fontSize(7).fillColor(item.impact === "high" ? colors.white : colors.ink).text(String(index + 1), left + 6, y + 7, { width: 8, align: "center", lineBreak: false }); doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.ink).text(clip(item.title, 62), left + 34, y, { width: 330, lineBreak: false }); doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.blue).text(`${item.impact.toUpperCase()} IMPACT`, width - 135, y + 2, { width: 81, align: "right", lineBreak: false }); doc.font("Helvetica").fontSize(9).fillColor(colors.gray).text(clip(item.detail, 170), left + 34, y + 23, { width: 405, height: 45, lineGap: 3, ellipsis: true }); if (index < 3) doc.moveTo(left + 34, y + 79).lineTo(width - left, y + 79).strokeColor("#E6E8EB").stroke(); });

    // Competition
    newPage("Competitive landscape", "Market signal");
    doc.font("Helvetica").fontSize(9.5).fillColor(colors.gray).text("Directional comparison based on the company's visible positioning and category conventions. Validate these hypotheses through live market research before strategic commitment.", left, 148, { width: content, lineGap: 3 });
    (audit.competitors ?? []).slice(0, 3).forEach((item, index) => { const y = 220 + index * 177; doc.roundedRect(left, y, content, 148, 11).strokeColor("#D9DDE3").lineWidth(1).stroke(); doc.font("Helvetica-Bold").fontSize(15).fillColor(colors.ink).text(clip(item.competitor_name, 45), left + 20, y + 20, { lineBreak: false }); doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.gray).text("THEIR EDGE", left + 20, y + 53, { characterSpacing: .8, lineBreak: false }); doc.font("Helvetica").fontSize(9).fillColor(colors.gray).text(clip(item.strengths.join(" / "), 150), left + 20, y + 72, { width: 202, height: 55, lineGap: 3, ellipsis: true }); doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.blue).text("YOUR OPENING", left + 264, y + 53, { characterSpacing: .8, lineBreak: false }); doc.font("Helvetica").fontSize(9).fillColor(colors.gray).text(clip(item.opportunities.join(" / "), 150), left + 264, y + 72, { width: 202, height: 55, lineGap: 3, ellipsis: true }); });

    // Opportunity matrix split into stable pages.
    const opportunities = audit.opportunities ?? [];
    for (let start = 0; start < opportunities.length; start += 5) {
      newPage(start === 0 ? "Automation opportunity matrix" : "Automation opportunity matrix / continued", `Value portfolio ${Math.floor(start / 5) + 1}`);
      opportunities.slice(start, start + 5).forEach((item, localIndex) => { const index = start + localIndex; const y = 153 + localIndex * 124; doc.circle(left + 13, y + 14, 12).fill(item.priority === "Now" ? colors.blue : "#D5D9E0"); doc.font("Helvetica-Bold").fontSize(8).fillColor(item.priority === "Now" ? colors.white : colors.ink).text(String(index + 1), left + 7, y + 11, { width: 12, align: "center", lineBreak: false }); doc.font("Helvetica-Bold").fontSize(12).fillColor(colors.ink).text(clip(item.problem, 70), left + 42, y, { width: 330, lineBreak: false }); doc.font("Helvetica-Bold").fontSize(12).fillColor(colors.blue).text(formatCurrency(item.monthly_roi), width - 150, y, { width: 96, align: "right", lineBreak: false }); doc.font("Helvetica").fontSize(8).fillColor(colors.gray).text(`${item.category.toUpperCase()}  /  ${item.hours_saved} HRS/MO  /  ${item.implementation_difficulty.toUpperCase()}`, left + 42, y + 24, { characterSpacing: .35, lineBreak: false }); doc.fontSize(9).fillColor("#4C5158").text(clip(item.solution, 175), left + 42, y + 49, { width: content - 42, height: 44, lineGap: 3, ellipsis: true }); doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.ink).text(`${formatCurrency(item.annual_roi)} ANNUAL VALUE`, left + 42, y + 96, { lineBreak: false }); if (localIndex < 4) doc.moveTo(left + 42, y + 113).lineTo(width - left, y + 113).strokeColor("#E4E6EA").stroke(); });
    }

    // Roadmap
    newPage("Recommended AI roadmap", "90-day plan");
    (audit.roadmap ?? []).slice(0, 3).forEach((item, index) => { const y = 152 + index * 167; doc.roundedRect(left, y, content, 140, 11).fill(index === 0 ? colors.ink : colors.pale); doc.rect(left, y, 7, 140).fill(index === 0 ? colors.lime : colors.blue); doc.font("Helvetica-Bold").fontSize(8.5).fillColor(index === 0 ? colors.lime : colors.blue).text(item.period.toUpperCase(), left + 25, y + 22, { characterSpacing: 1, lineBreak: false }); doc.fontSize(15).fillColor(index === 0 ? colors.white : colors.ink).text(clip(item.title, 55), left + 25, y + 44, { lineBreak: false }); doc.font("Helvetica").fontSize(9).fillColor(index === 0 ? "#B8BDC4" : colors.gray).text(item.actions.slice(0, 3).map((action) => `- ${clip(action, 82)}`).join("\n"), left + 25, y + 72, { width: content - 50, height: 52, lineGap: 3, ellipsis: true }); });
    doc.font("Helvetica-Bold").fontSize(16).fillColor(colors.ink).text("Final recommendation", left, 676, { lineBreak: false });
    doc.font("Helvetica").fontSize(9.5).fillColor(colors.gray).text("Fund the first wave against measurable baselines: response time, conversion, workflow hours, and customer satisfaction. Keep human approval at consequential decisions, review exceptions weekly, and expand only after adoption and value are visible in the operating data.", left, 705, { width: content, height: 62, lineGap: 3, ellipsis: true });
    footer(); doc.end();
  });
}
