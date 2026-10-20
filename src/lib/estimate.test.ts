import { describe, expect, test } from "bun:test";
import { estimateEmailRows, estimateRateLimited, estimateSchema } from "./estimate";
import { notifyEstimate } from "./estimate-email.server";

const enquiry = {
  name: "Form verification", email: "form-check@example.com", location: "York",
  bedrooms: "2", propertyType: "Flat", alreadyListed: "Yes",
  listingLinkOrPhone: "https://www.airbnb.co.uk/rooms/123456", notes: "Verification enquiry", website: "",
};

describe("Estimate rules", () => {
  test("limits each IP to 3 submissions per hour", () => {
    expect(estimateRateLimited(2)).toBe(false);
    expect(estimateRateLimited(3)).toBe(true);
  });
  test("requires a Yes or No Airbnb listing answer", () => {
    expect(estimateSchema.safeParse({ ...enquiry, alreadyListed: "" }).success).toBe(false);
    expect(estimateSchema.safeParse({ ...enquiry, alreadyListed: "Yes" }).success).toBe(true);
    expect(estimateSchema.safeParse({ ...enquiry, alreadyListed: "No" }).success).toBe(true);
  });
  test("listing link or phone remains optional", () => {
    const { listingLinkOrPhone: _optional, ...input } = enquiry;
    expect(estimateSchema.parse(input).listingLinkOrPhone).toBe("");
  });
  test("requires a valid email", () => {
    expect(estimateSchema.safeParse({ ...enquiry, email: "invalid" }).success).toBe(false);
  });
  test("notifications contain every submitted field and timestamp", () => {
    const rows = estimateEmailRows(estimateSchema.parse(enquiry), "2026-10-20T20:33:00Z");
    expect(rows.map(([, value]) => value)).toEqual([
      enquiry.name, enquiry.email, enquiry.location, "2", "Flat", "Yes",
      enquiry.listingLinkOrPhone, enquiry.notes, "2026-10-20T20:33:00Z",
    ]);
  });
  test("a populated honeypot can reach silent acceptance", () => {
    expect(estimateSchema.parse({ ...enquiry, website: "spam" }).website).toBe("spam");
  });
  test("email HTTP and network failures stay non-fatal", async () => {
    const original = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "test-placeholder-not-a-credential";
    try {
      await expect(notifyEstimate(estimateSchema.parse(enquiry), (async () => new Response("Unverified domain", { status: 403 })) as typeof fetch)).resolves.toBeUndefined();
      await expect(notifyEstimate(estimateSchema.parse(enquiry), (async () => { throw new Error("Network unavailable"); }) as typeof fetch)).resolves.toBeUndefined();
    } finally {
      if (original === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = original;
    }
  });
});