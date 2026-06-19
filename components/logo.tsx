import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-tight" aria-label="Northstar AI home">
    <span className={`grid size-8 place-items-center rounded-full border ${light ? "border-white/20 bg-white/10" : "border-black/10 bg-ink"}`}><span className="size-2.5 rotate-45 bg-lime transition-transform group-hover:rotate-[135deg]" /></span>
    <span className={light ? "text-white" : "text-ink"}>Northstar<span className={light ? "text-white/45" : "text-black/35"}>/AI</span></span>
  </Link>;
}
