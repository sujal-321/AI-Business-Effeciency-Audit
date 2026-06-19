import { ArrowDown, ArrowRight, Bot, ChartNoAxesCombined, CircleCheck, Clock3, FileSearch, Gauge, Layers3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { AuditForm } from "@/components/audit-form";
import { SiteHeader } from "@/components/site-header";

const opportunities = [
  { icon: Bot, title: "Automation portfolio", copy: "10+ high-confidence workflows ranked by value, urgency, and implementation complexity." },
  { icon: Search, title: "SEO intelligence", copy: "Technical, content, and conversion gaps translated into a practical growth backlog." },
  { icon: ChartNoAxesCombined, title: "ROI modeling", copy: "Monthly capacity, cost savings, revenue upside, and annualized value for every idea." },
];
const method = [["01", "Map the business", "We read the pages that define your offer, audience, proof, and conversion journey."], ["02", "Find the friction", "Specialist AI agents examine search readiness, customer experience, and operating workflows."], ["03", "Model the upside", "Every recommendation is scored for hours saved, economic value, and implementation effort."], ["04", "Build the roadmap", "The result becomes a clear 30/60/90-day sequence—not another idea graveyard."]];

export default function Home() {
  return <main className="overflow-hidden"><SiteHeader />
    <section className="noise relative bg-ink text-white">
      <div className="grid-bg absolute inset-0 opacity-60" /><div className="absolute -right-32 top-20 size-[520px] rounded-full bg-cobalt/20 blur-[100px]" />
      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28">
        <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-white/50 fade-up"><span className="size-2 rounded-full bg-lime shadow-[0_0_18px_#d8ff63]" /> AI opportunity intelligence</div>
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_360px]">
          <h1 className="display max-w-[980px] text-[clamp(4rem,8.4vw,8.7rem)] leading-[.85] fade-up">Find the work your business should <span className="text-lime">stop doing.</span></h1>
          <div className="pb-3 fade-up"><p className="text-lg leading-8 text-white/62">A website-powered diagnostic that uncovers where AI can create capacity, improve conversion, and compound growth.</p><a href="#audit" className="mt-7 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-sm font-semibold transition hover:border-lime hover:text-lime">See your opportunity map <ArrowDown size={16} /></a></div>
        </div>
        <div id="audit" className="mt-16 scroll-mt-24 lg:mt-24"><AuditForm /></div>
      </div>
      <div className="relative border-t border-white/10"><div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 px-6 py-6 text-xs text-white/38 lg:px-10"><span>Built for leaders who value evidence over AI theatre.</span><div className="flex gap-7"><span className="flex items-center gap-2"><ShieldCheck size={14} /> Private by design</span><span className="flex items-center gap-2"><Clock3 size={14} /> ~3 minute analysis</span><span className="flex items-center gap-2"><FileSearch size={14} /> Board-ready PDF</span></div></div></div>
    </section>

    <section id="outcomes" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><div className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-cobalt">What you get</div><h2 className="display text-5xl leading-[.95] md:text-7xl">One clear view of the upside.</h2></div><p className="max-w-2xl self-end text-xl leading-8 text-black/55">Not a generic checklist. A commercially grounded assessment shaped around your actual offer, audience, website, and operating model.</p></div>
      <div className="mt-16 grid border-y border-black/10 md:grid-cols-3">{opportunities.map(({ icon: Icon, title, copy }, i) => <article key={title} className={`group py-10 md:px-8 md:py-14 ${i > 0 ? "border-t border-black/10 md:border-l md:border-t-0" : ""}`}><div className="mb-12 grid size-12 place-items-center rounded-full bg-ink text-lime transition group-hover:-translate-y-1"><Icon size={20} /></div><h3 className="mb-3 text-xl font-semibold tracking-tight">{title}</h3><p className="leading-7 text-black/50">{copy}</p></article>)}</div>
    </section>

    <section id="method" className="bg-[#e9e8e2]">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-36"><div className="mb-14 flex flex-wrap items-end justify-between gap-7"><div><div className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-cobalt">The method</div><h2 className="display text-5xl md:text-7xl">From URL to action plan.</h2></div><span className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold">Multi-agent analysis · Structured outputs</span></div>
        <div className="grid gap-px overflow-hidden rounded-[28px] bg-black/10 lg:grid-cols-2">{method.map(([num, title, copy]) => <article key={num} className="group bg-cream p-8 md:p-12"><div className="mb-16 flex items-center justify-between"><span className="font-mono text-xs text-black/35">{num}</span><div className="grid size-9 place-items-center rounded-full border border-black/10 transition group-hover:rotate-45 group-hover:bg-lime"><ArrowRight size={15} /></div></div><h3 className="display mb-4 text-3xl">{title}</h3><p className="max-w-md leading-7 text-black/50">{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="bg-cobalt text-white"><div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-[1fr_.8fr] lg:px-10 lg:py-32"><div><Sparkles className="mb-10 text-lime" /><h2 className="display text-5xl leading-[.95] md:text-7xl">A serious report for the conversations that matter.</h2></div><div className="grid content-end gap-6"><p className="text-xl leading-8 text-white/70">Use it to align leadership, qualify an automation partner, or decide where your next dollar of transformation budget belongs.</p><div className="grid grid-cols-2 gap-4 pt-4 text-sm"><span className="flex items-center gap-2"><CircleCheck size={17} className="text-lime" /> Executive summary</span><span className="flex items-center gap-2"><CircleCheck size={17} className="text-lime" /> Opportunity matrix</span><span className="flex items-center gap-2"><CircleCheck size={17} className="text-lime" /> Competitive view</span><span className="flex items-center gap-2"><CircleCheck size={17} className="text-lime" /> 90-day roadmap</span></div></div></div></section>

    <footer className="bg-ink text-white"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-10 px-6 py-14 lg:flex-row lg:px-10"><div><div className="display text-3xl">Northstar<span className="text-white/30">/AI</span></div><p className="mt-3 text-sm text-white/40">Clarity before automation.</p></div><div className="flex items-end gap-8 text-sm text-white/50"><a href="#audit" className="hover:text-white">Start an audit</a><a href="/admin" className="hover:text-white">Dashboard</a></div></div></footer>
  </main>;
}
