import { notFound, redirect } from "next/navigation";
import { ProcessingView } from "@/components/processing-view";
import { getRepository } from "@/lib/repository";

export const dynamic = "force-dynamic";
export default async function ProcessingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const audit = await getRepository().get(id); if (!audit) notFound(); if (audit.status === "completed") redirect(`/audit/${id}`);
  return <ProcessingView initial={audit} />;
}
