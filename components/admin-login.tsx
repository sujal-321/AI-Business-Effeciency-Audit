"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, LoaderCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLogin() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); const data = new FormData(event.currentTarget); const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: data.get("token") }) }); if (res.ok) { router.refresh(); return; } const body = await res.json(); setError(body.error ?? "Access denied"); setLoading(false); }
  return <main className="grid min-h-screen place-items-center bg-ink p-6"><div className="w-full max-w-md rounded-[28px] bg-cream p-8 shadow-2xl"><Logo /><div className="mt-16 grid size-11 place-items-center rounded-full bg-cobalt text-white"><KeyRound size={18} /></div><h1 className="display mt-7 text-4xl">Operator access.</h1><p className="mt-3 text-sm leading-6 text-black/50">Enter the private dashboard key configured for this deployment.</p><form onSubmit={submit} className="mt-8 space-y-3"><Input name="token" type="password" required autoFocus placeholder="Access key" /><Button className="w-full bg-cobalt hover:bg-cobalt/90" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={17} /> : <>Open dashboard <ArrowRight className="ml-2" size={16} /></>}</Button>{error && <p className="text-sm text-red-600">{error}</p>}</form></div></main>;
}
