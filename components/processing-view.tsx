"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleDashed, LoaderCircle, Search, Sparkles } from "lucide-react";
import type { AuditRecord } from "@/lib/types";

const stages = [
  ["scraping", "Website intelligence", "Reading your offer, proof, and conversion path"],
  ["analyzing", "Business profile", "Mapping the model, audience, and commercial context"],
  ["seo", "Growth diagnostic", "Scoring search readiness and content gaps"],
  ["opportunities", "Automation portfolio", "Finding and valuing the strongest workflows"],
  ["reporting", "Consulting report", "Building the narrative, PDF, and roadmap"],
] as const;
const order = ["queued", ...stages.map((x) => x[0]), "completed"];

export function ProcessingView({ initial }: { initial: AuditRecord }) {
  const router = useRouter(); const [audit, setAudit] = useState(initial); const started = useRef(false);
  useEffect(() => {
    if (!started.current) { started.current = true; fetch(`/api/audits/${initial.id}/process`, { method: "POST" }).catch(() => undefined); }
    const timer = setInterval(async () => { try { const res = await fetch(`/api/audits/${initial.id}`, { cache: "no-store" }); const data = await res.json(); if (data.audit) { setAudit(data.audit); if (data.audit.status === "completed") { clearInterval(timer); setTimeout(() => router.replace(`/audit/${initial.id}`), 500); } } } catch {} }, 650);
    return () => clearInterval(timer);
  }, [initial.id, router]);
  const active = order.indexOf(audit.status);
  return <main className="noise grid min-h-screen bg-ink text-white lg:grid-cols-[1.1fr_.9fr]">
    <section className="relative flex min-h-[58vh] flex-col justify-between overflow-hidden border-b border-white/10 p-7 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-12">
      <div className="grid-bg absolute inset-0 opacity-50" /><div className="absolute left-1/3 top-1/4 size-[440px] rounded-full bg-cobalt/25 blur-[100px]" />
      <a href="/" className="relative flex items-center gap-2.5 font-semibold"><span className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10"><span className="size-2.5 rotate-45 bg-lime" /></span>Northstar<span className="-ml-2 text-white/40">/AI</span></a>
      <div className="relative py-16 lg:py-0"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60"><span className="size-1.5 animate-pulse rounded-full bg-lime" /> Analysis in progress</div><h1 className="display max-w-2xl text-5xl leading-[.92] md:text-7xl">Finding the leverage inside <span className="text-lime">{audit.company_name}.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-white/50">Our specialist agents are turning your public website into a prioritized, quantified transformation plan.</p></div>
      <div className="relative flex items-center gap-2 text-xs text-white/35"><Search size={14} /> {new URL(audit.website_url).hostname}</div>
    </section>
    <section className="flex items-center bg-[#111313] p-7 lg:p-14"><div className="w-full max-w-xl"><div className="mb-9 flex items-end justify-between"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-white/35">Current step</div><div className="mt-2 text-xl font-semibold">{audit.current_step}</div></div><div className="display text-5xl text-lime">{audit.progress}%</div></div>
      <div className="mb-12 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${audit.progress}%` }} /></div>
      <div>{stages.map(([key, title, copy], index) => { const stageIndex = order.indexOf(key); const done = active > stageIndex; const current = active === stageIndex; return <div key={key} className="relative flex gap-5 pb-8 last:pb-0"><div className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-[#17191a]">{done ? <Check className="text-lime" size={17} /> : current ? <LoaderCircle className="animate-spin text-lime" size={18} /> : <CircleDashed className="text-white/20" size={18} />}</div>{index < stages.length - 1 && <div className={`absolute left-[19px] top-10 h-[calc(100%-40px)] w-px ${done ? "bg-lime/50" : "bg-white/10"}`} />}<div className="pt-1"><div className={`font-semibold ${done || current ? "text-white" : "text-white/30"}`}>{title}</div><p className={`mt-1 text-sm ${current ? "text-white/55" : "text-white/25"}`}>{copy}</p></div></div>; })}</div>
      {audit.status === "failed" && <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{audit.error ?? "The audit could not be completed."} <a href="/" className="ml-2 underline">Try again</a></div>}
      <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/30"><Sparkles size={14} /> Keep this tab open while the analysis finishes.</div>
    </div></section>
  </main>;
}
