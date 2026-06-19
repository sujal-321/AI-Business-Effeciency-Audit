import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["pdfkit"],
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
};

export default nextConfig;
