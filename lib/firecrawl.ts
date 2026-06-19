import { config } from "@/lib/config";
import { retry } from "@/lib/utils";
import type { ScrapedSite } from "@/lib/types";

const wantedPaths = ["", "/about", "/services", "/contact"];

export async function scrapeWebsite(websiteUrl: string): Promise<ScrapedSite> {
  if (!config.firecrawlKey) throw new Error("FIRECRAWL_API_KEY is required outside demo mode");
  const origin = new URL(websiteUrl).origin;
  const pages = await Promise.all(wantedPaths.map(async (path) => {
    const url = new URL(path, origin).toString();
    try {
      const response = await retry(() => fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST", headers: { Authorization: `Bearer ${config.firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true, waitFor: 1500 }), signal: AbortSignal.timeout(45_000),
      }).then(async (res) => { if (!res.ok) throw new Error(`Firecrawl returned ${res.status}`); return res.json(); }), 3, 800);
      const data = response.data ?? response;
      return { title: data.metadata?.title ?? (path.slice(1) || "Homepage"), url, markdown: data.markdown ?? "", metadata: data.metadata ?? {} };
    } catch (error) {
      if (path === "") throw error;
      return null;
    }
  }));
  const valid = pages.filter((page): page is NonNullable<typeof page> => Boolean(page?.markdown));
  if (!valid.length) throw new Error("No readable website content was returned");
  const combined = valid.map((page) => `# ${page.title}\nURL: ${page.url}\n${page.markdown}`).join("\n\n---\n\n").slice(0, 100_000);
  return { pages: valid, combined };
}
