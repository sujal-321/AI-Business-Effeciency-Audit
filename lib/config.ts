const isTrue = (value: string | undefined) => value === "true";

export const config = {
  demoMode: isTrue(process.env.DEMO_MODE) || !process.env.SUPABASE_SERVICE_ROLE_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  openaiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o",
  firecrawlKey: process.env.FIRECRAWL_API_KEY,
  resendKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? "Audit Studio <audits@example.com>",
  gotenbergUrl: process.env.GOTENBERG_URL,
  webhookUrl: process.env.WEBHOOK_URL,
  agencyName: process.env.AGENCY_NAME ?? "Northstar AI",
  agencyAccent: process.env.AGENCY_ACCENT ?? "#275efe",
  rateLimit: (() => { const n = Number(process.env.AUDIT_RATE_LIMIT_PER_HOUR); return Number.isFinite(n) && n > 0 ? n : 5; })(),
};
