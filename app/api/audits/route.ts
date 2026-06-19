import { NextRequest, NextResponse } from "next/server";
import { auditInputSchema } from "@/lib/schemas";
import { getRepository } from "@/lib/repository";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const limit = checkRateLimit(ip); if (!limit.allowed) return NextResponse.json({ error: "Too many audits. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetsAt - Date.now()) / 1000)) } });
    const parsed = auditInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the submitted details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    const audit = await getRepository().create(parsed.data); logger.info("audit.created", { auditId: audit.id });
    return NextResponse.json({ audit }, { status: 201, headers: { "X-RateLimit-Remaining": String(limit.remaining) } });
  } catch (error) {
    logger.error("audit.create_failed", error); return NextResponse.json({ error: "We could not start this audit." }, { status: 500 });
  }
}
