import { describe, expect, it } from "vitest";
import { auditInputSchema, businessProfileSchema, opportunityListSchema } from "@/lib/schemas";
import { createDemoResult } from "@/lib/demo-data";

describe("audit input", () => {
  it("accepts a valid lead", () => { expect(auditInputSchema.parse({ company_name: "Acme", website_url: "https://acme.com", email: "ops@acme.com" })).toBeTruthy(); });
  it("rejects unsafe URL schemes", () => { expect(auditInputSchema.safeParse({ company_name: "Acme", website_url: "file:///etc/passwd", email: "ops@acme.com" }).success).toBe(false); });
});

describe("analysis contracts", () => {
  it("keeps the demo payload aligned with the production schemas", () => {
    const result = createDemoResult("test", "Test Co", "https://test.co", "hello@test.co");
    expect(businessProfileSchema.safeParse(result.profile).success).toBe(true);
    expect(opportunityListSchema.safeParse({ opportunities: result.opportunities }).success).toBe(true);
    expect(result.opportunities).toHaveLength(10);
    expect(result.opportunities?.every((x) => x.annual_roi === x.monthly_roi * 12)).toBe(true);
  });
});
