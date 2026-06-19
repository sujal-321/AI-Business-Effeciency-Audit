import { NextResponse } from "next/server";
import { processAudit } from "@/lib/audit-service";

export const maxDuration = 300;
export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try { const { id } = await context.params; const audit = await processAudit(id); return NextResponse.json({ audit }); }
  catch (error) { const message = error instanceof Error ? error.message : "Audit failed"; return NextResponse.json({ error: message }, { status: message === "Audit not found" ? 404 : 500 }); }
}
