import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return <header className={`relative z-30 border-b ${dark ? "border-white/10 bg-ink text-white" : "border-black/10 bg-cream/90 text-ink backdrop-blur-xl"}`}>
    <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10"><Logo light={dark} />
      <nav className="hidden items-center gap-8 text-sm md:flex"><Link href="/#method" className="opacity-65 transition hover:opacity-100">Method</Link><Link href="/#outcomes" className="opacity-65 transition hover:opacity-100">Outcomes</Link><Link href="/admin" className="opacity-65 transition hover:opacity-100">Dashboard</Link></nav>
      <Link href="/#audit" className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "bg-lime text-ink" : "bg-ink text-white"}`}>Start audit <ArrowUpRight size={15} /></Link>
    </div>
  </header>;
}
