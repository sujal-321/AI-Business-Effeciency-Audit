"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Globe2, LoaderCircle, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuditForm() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget);
    let url = String(form.get("website_url")); if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
      const response = await fetch("/api/audits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_name: form.get("company_name"), website_url: url, email: form.get("email") }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Could not start the audit");
      router.push(`/audit/${data.audit.id}/processing`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong"); setLoading(false); }
  }
  return <form onSubmit={submit} className="relative rounded-[28px] border border-white/10 bg-white p-2 shadow-2xl shadow-black/25">
    <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="relative"><span className="sr-only">Company name</span><Sparkles className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={17} /><Input name="company_name" minLength={2} maxLength={120} required placeholder="Company name" className="h-14 border-0 bg-[#f3f2ee] pl-11 focus:bg-white" /></label>
      <label className="relative"><span className="sr-only">Website URL</span><Globe2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={17} /><Input name="website_url" required placeholder="yourcompany.com" className="h-14 border-0 bg-[#f3f2ee] pl-11 focus:bg-white" /></label>
      <label className="relative"><span className="sr-only">Contact email</span><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={17} /><Input name="email" type="email" required placeholder="you@company.com" className="h-14 border-0 bg-[#f3f2ee] pl-11 focus:bg-white" /></label>
      <Button disabled={loading} className="h-14 rounded-[20px] bg-cobalt px-7 hover:bg-cobalt/90">{loading ? <><LoaderCircle className="mr-2 animate-spin" size={17} /> Starting</> : <>Run my audit <ArrowRight className="ml-2" size={17} /></>}</Button>
    </div>
    {error && <p role="alert" className="px-4 pb-2 pt-3 text-sm text-red-600">{error}</p>}
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pb-2 pt-3 text-xs text-black/45"><span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Free diagnostic</span><span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> No credit card</span><span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Report delivered by email</span></div>
  </form>;
}
