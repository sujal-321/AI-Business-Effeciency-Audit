import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let token: string | undefined;
  try { const body = await request.json(); token = typeof body?.token === "string" ? body.token : undefined; } catch { token = undefined; }
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return NextResponse.json({ ok: true, demo: true });
  const providedBuffer = Buffer.from(token ?? ""); const expectedBuffer = Buffer.from(expected);
  const valid = providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
  if (!valid) return NextResponse.json({ error: "Invalid access key" }, { status: 401 });
  const value = createHash("sha256").update(expected).digest("hex"); const response = NextResponse.json({ ok: true });
  response.cookies.set("audit_admin", value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 }); return response;
}
