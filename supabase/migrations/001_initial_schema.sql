create extension if not exists "pgcrypto";

create type audit_status as enum ('queued','scraping','analyzing','seo','opportunities','reporting','completed','failed');

create table audits (
  id uuid primary key default gen_random_uuid(), company_name text not null, website_url text not null, email text not null,
  status audit_status not null default 'queued', progress integer not null default 4 check (progress between 0 and 100),
  current_step text not null default 'Queued for analysis', error text, created_at timestamptz not null default now(), completed_at timestamptz
);
create table business_profiles (
  id uuid primary key default gen_random_uuid(), audit_id uuid not null unique references audits(id) on delete cascade,
  industry text not null, business_model text not null, target_audience text not null, services jsonb not null default '[]',
  pain_points jsonb not null default '[]', company_summary text not null
);
create table seo_reports (
  id uuid primary key default gen_random_uuid(), audit_id uuid not null unique references audits(id) on delete cascade,
  seo_score integer not null, technical_score integer not null, content_score integer not null,
  findings jsonb not null default '[]', recommendations jsonb not null default '[]'
);
create table competitors (
  id uuid primary key default gen_random_uuid(), audit_id uuid not null references audits(id) on delete cascade,
  competitor_name text not null, strengths jsonb not null default '[]', weaknesses jsonb not null default '[]', opportunities jsonb not null default '[]'
);
create table automation_opportunities (
  id uuid primary key default gen_random_uuid(), audit_id uuid not null references audits(id) on delete cascade,
  problem text not null, solution text not null, hours_saved numeric not null, cost_savings numeric not null,
  revenue_opportunity numeric not null, monthly_roi numeric not null, annual_roi numeric not null,
  implementation_difficulty text not null, priority text not null, category text not null
);
create table final_reports (
  id uuid primary key default gen_random_uuid(), audit_id uuid not null unique references audits(id) on delete cascade,
  executive_summary text not null, roadmap jsonb not null default '[]', report_html text not null, pdf_url text
);

create index audits_created_at_idx on audits(created_at desc);
create index audits_status_idx on audits(status);
create index audits_company_name_idx on audits using gin(to_tsvector('english', company_name));
create index opportunities_audit_id_idx on automation_opportunities(audit_id);

alter table audits enable row level security;
alter table business_profiles enable row level security;
alter table seo_reports enable row level security;
alter table competitors enable row level security;
alter table automation_opportunities enable row level security;
alter table final_reports enable row level security;

-- All app access uses the server-side service role. No browser policies are intentionally granted.
