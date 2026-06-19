import { NextResponse } from "next/server";
import { processAudit } from "@/lib/audit-service";
import { logger } from "@/lib/logger";

export const maxDuration = 300;
export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try { const { id } = await context.params; const audit = await processAudit(id); return NextResponse.json({ audit }); }
  catch (error) {
    logger.error("audit.process_failed", error);
    if (error instanceof Error && error.message === "Audit not found") return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    return NextResponse.json({ error: "Processing failed. Our team has been notified." }, { status: 500 });
  }
}
