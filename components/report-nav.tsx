"use client";
import { Download, Printer } from "lucide-react";

export function ReportActions({ pdfUrl }: { pdfUrl: string }) {
  return <div className="flex gap-2"><button onClick={() => window.print()} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:bg-black/5" aria-label="Print report"><Printer size={16} /></button><a href={pdfUrl} className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5"><Download size={14} /> Download PDF</a></div>;
}
