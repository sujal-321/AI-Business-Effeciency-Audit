import { NextResponse } from "next/server";
import { config } from "@/lib/config";
export function GET() { return NextResponse.json({ status: "ok", mode: config.demoMode ? "demo" : "production", at: new Date().toISOString() }); }
