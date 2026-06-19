import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { getRepository } from "@/lib/repository";

export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ search?: string; status?: string; page?: string }> }) {
  const expected = process.env.ADMIN_TOKEN; const cookie = (await cookies()).get("audit_admin")?.value; const authenticated = !expected || cookie === createHash("sha256").update(expected).digest("hex"); if (!authenticated) return <AdminLogin />;
  const params = await searchParams; const search = params.search ?? ""; const status = params.status ?? "all"; const page = Math.max(1, Number(params.page ?? 1)); const repo = getRepository();
  const [{ audits, total }, aggregate] = await Promise.all([repo.list({ search, status, page, limit: 8 }), repo.list({ page: 1, limit: 1000 })]);
  return <AdminDashboard audits={audits} total={total} page={page} search={search} status={status} aggregate={aggregate.audits} />;
}
