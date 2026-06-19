import { Resend } from "resend";
import { config } from "@/lib/config";
import { generateAuditPdf } from "@/lib/pdf";
import type { AuditRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export async function deliverReport(audit: AuditRecord) {
  if (!config.resendKey) return { delivered: false, reason: "RESEND_API_KEY not configured" };
  const total = audit.opportunities?.reduce((sum, x) => sum + x.monthly_roi, 0) ?? 0;
  const pdf = await generateAuditPdf(audit);
  const resend = new Resend(config.resendKey);
  const { error } = await resend.emails.send({
    from: config.emailFrom, to: audit.email, subject: `${audit.company_name}: your AI efficiency audit is ready`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px"><p style="color:#275efe;font-weight:700">${config.agencyName}</p><h1>Your efficiency audit is ready.</h1><p>Hi there,</p><p>We found an estimated <b>${formatCurrency(total)} in monthly efficiency and growth upside</b> across ${audit.opportunities?.length ?? 0} automation opportunities.</p><p>${audit.executive_summary}</p><p><a href="${config.appUrl}/audit/${audit.id}" style="background:#101111;color:white;padding:14px 20px;border-radius:8px;text-decoration:none;display:inline-block">Explore the interactive report</a></p><p style="color:#777">The attached report contains the complete analysis and 90-day roadmap.</p></div>`,
    attachments: [{ filename: `${audit.company_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ai-audit.pdf`, content: pdf }],
  });
  if (error) throw new Error(error.message);
  return { delivered: true };
}

export async function notifyWebhook(audit: AuditRecord) {
  if (!config.webhookUrl) return;
  await fetch(config.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "audit.completed", audit_id: audit.id, company_name: audit.company_name, report_url: `${config.appUrl}/audit/${audit.id}` }), signal: AbortSignal.timeout(10_000) });
}
