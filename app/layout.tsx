import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = { title: { default: "Northstar AI — Business Efficiency Audit", template: "%s — Northstar AI" }, description: "Turn your website into a board-ready map of AI automation opportunities, search gaps, and measurable ROI.", metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
