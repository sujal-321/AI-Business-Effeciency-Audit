import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import { generateAuditPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const audit = await getRepository().get(id);
  if (!audit || audit.status !== "completed") return NextResponse.json({ error: "Report not found" }, { status: 404 });
  const pdf = await generateAuditPdf(audit); const filename = audit.company_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}-ai-audit.pdf"`, "Cache-Control": "private, max-age=3600" } });
}
