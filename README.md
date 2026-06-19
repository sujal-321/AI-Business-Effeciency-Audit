# AI Business Efficiency Audit

A production-oriented SaaS lead-generation application that turns a company website into a polished AI efficiency assessment: business profile, SEO diagnostic, competitor hypotheses, a prioritized automation portfolio, quantified ROI, a 90-day roadmap, PDF, email delivery, and an operator dashboard.

The interface is deliberately demo-ready. `DEMO_MODE=true` runs the complete journey without third-party credentials; production mode switches to Firecrawl, OpenAI, Supabase, Gotenberg (optional), and Resend through small provider adapters.

## Implementation phases

### Phase 1 — Foundation and data model

- Next.js 15 App Router, React 19, strict TypeScript, Tailwind, and shadcn-style UI primitives.
- Normalized Supabase PostgreSQL schema in `supabase/migrations/001_initial_schema.sql`.
- Server-only service-role repository with a process-local demo adapter.
- Zod input validation, environment contract, structured logs, retry utility, and in-memory hourly rate limiting.

### Phase 2 — Intelligence pipeline

- Firecrawl reads homepage, About, Services, and Contact pages (unavailable secondary pages are tolerated).
- OpenAI schema-enforced outputs create the business profile, SEO audit, three-competitor directional analysis, 10+ automation opportunities, and report narrative.
- Specialist analyses run concurrently once the business profile is known.
- ROI is normalized in application code: monthly value = cost savings + revenue opportunity; annual value = monthly value × 12.
- Each major step is persisted so the progress experience and dashboard reflect current state.

### Phase 3 — Report and delivery

- Interactive responsive client report with KPI cards, score rings, findings, competitor cards, opportunity matrix, and 30/60/90-day roadmap.
- Consulting-style PDF generated natively with PDFKit. If `GOTENBERG_URL` is configured, stored report HTML is converted through Gotenberg instead.
- Resend delivers a personalized HTML summary, report link, and attached PDF.
- Optional completion webhook supports CRM and automation handoffs.

### Phase 4 — Operations dashboard

- Total/in-progress/completed audits and aggregate modeled opportunity value.
- Search, status filter, pagination, and report deep links.
- Optional `ADMIN_TOKEN` gate stored as a short-lived HttpOnly hash cookie.
- Seeded demo audits make the dashboard useful on first run.

## Project structure

```text
app/
  api/audits/              create, inspect, process, and download APIs
  api/admin/login/         operator authentication
  audit/[id]/              processing and interactive report pages
  admin/                   operations dashboard
components/                product UI and shadcn-style primitives
lib/
  ai.ts                    schema-enforced OpenAI specialists
  audit-service.ts         orchestration and progress state machine
  delivery.ts              Resend and webhook delivery
  firecrawl.ts             website ingestion
  pdf.ts                   native/Gotenberg PDF generation
  repository.ts            demo/Supabase persistence adapters
  report-template.ts       archival report HTML
  schemas.ts               all input and AI output contracts
supabase/migrations/       PostgreSQL schema, indexes, and RLS
tests/                     validation and ROI contract tests
```

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
|---|---:|---|
| `DEMO_MODE` | local | `true` runs without providers |
| `NEXT_PUBLIC_APP_URL` | yes | public base URL used in report links |
| `NEXT_PUBLIC_SUPABASE_URL` | production | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | production | server-only database access |
| `OPENAI_API_KEY` | production | structured business analysis |
| `OPENAI_MODEL` | production | defaults to `gpt-4o` |
| `FIRECRAWL_API_KEY` | production | website scraping |
| `RESEND_API_KEY` | delivery | email API |
| `EMAIL_FROM` | delivery | verified Resend sender |
| `GOTENBERG_URL` | optional | HTML-to-PDF service; PDFKit is the fallback |
| `ADMIN_TOKEN` | recommended | dashboard access key |
| `AUDIT_RATE_LIMIT_PER_HOUR` | optional | create limit per forwarded IP; default `5` |
| `WEBHOOK_URL` | optional | receives `audit.completed` JSON |
| `AGENCY_NAME` / `AGENCY_ACCENT` | optional | white-label report branding |

Never expose the Supabase service role, OpenAI, Firecrawl, or Resend keys with a `NEXT_PUBLIC_` prefix.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`, submit any plausible company, website, and email, then watch the progress experience resolve into the full report. Visit `/admin` for the operating dashboard.

## Production setup

1. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in the SQL editor or Supabase CLI.
2. Set `DEMO_MODE=false` and configure all production provider variables.
3. Verify the `EMAIL_FROM` domain in Resend.
4. Deploy to Vercel. The process route declares a 300-second maximum duration; select a plan/runtime that supports the expected scrape and analysis latency.
5. Point `NEXT_PUBLIC_APP_URL` to the deployed origin and, if desired, configure a public Gotenberg service.

The process endpoint is idempotent for completed audits. For heavy traffic, preserve the same repository and pipeline interfaces but dispatch `processAudit(id)` from a durable queue (Vercel Queues, Trigger.dev, Inngest, or Supabase-backed workers); a synchronous process request is intentional here so the repository remains self-contained and deployable without another vendor.

## Testing

```bash
npm run typecheck
npm test
npm run build
```

Manual smoke test:

1. Submit a demo audit and confirm all five progress stages advance.
2. Confirm KPI totals equal the sum of opportunity rows.
3. Download the PDF and inspect cover, score bars, opportunity matrix, and roadmap.
4. Search/filter the audit in `/admin` and open it from history.
5. In production mode, confirm the Supabase rows, Resend message, attachment, and optional webhook.

## Production notes

- Provider calls have bounded timeouts and retries; secondary site pages degrade gracefully.
- Competitor output is labeled as directional because this version infers likely competitors from category context instead of scraping competitor sites.
- The built-in rate limiter is suitable for a single runtime. Multi-instance deployments should move counters to Redis/Upstash without changing the route contract.
- Public report URLs use unguessable UUIDs. Sensitive deployments should add recipient authentication or signed expiring report links.
- RLS intentionally grants no browser policies: all persistence is server-side through the service role.
