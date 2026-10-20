import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { estimateEmailRows, estimateRateLimited, estimateSchema } from "./estimate";
import { notifyEstimate } from "./estimate-email.server";

const enquiry = {
  name: "Form verification", email: "form-check@example.com", location: "York",
  bedrooms: "2", propertyType: "Flat", alreadyListed: "Yes",
  listingLinkOrPhone: "https://www.airbnb.co.uk/rooms/123456", notes: "Verification enquiry", website: "",
};

describe("Estimate rules", () => {
  test("limits each IP to 3 submissions per hour", () => {
    assert.equal(estimateRateLimited(2), false);
    assert.equal(estimateRateLimited(3), true);
  });
  test("requires a Yes or No Airbnb listing answer", () => {
    assert.equal(estimateSchema.safeParse({ ...enquiry, alreadyListed: "" }).success, false);
    assert.equal(estimateSchema.safeParse({ ...enquiry, alreadyListed: "Yes" }).success, true);
    assert.equal(estimateSchema.safeParse({ ...enquiry, alreadyListed: "No" }).success, true);
  });
  test("listing link or phone remains optional", () => {
    const { listingLinkOrPhone: _optional, ...input } = enquiry;
    assert.equal(estimateSchema.parse(input).listingLinkOrPhone, "");
  });
  test("requires a valid email", () => {
    assert.equal(estimateSchema.safeParse({ ...enquiry, email: "invalid" }).success, false);
  });
  test("notifications contain every submitted field and timestamp", () => {
    const rows = estimateEmailRows(estimateSchema.parse(enquiry), "2026-10-20T20:33:00Z");
    assert.deepEqual(rows.map(([, value]) => value), [
      enquiry.name, enquiry.email, enquiry.location, "2", "Flat", "Yes",
      enquiry.listingLinkOrPhone, enquiry.notes, "2026-10-20T20:33:00Z",
    ]);
  });
  test("a populated honeypot can reach silent acceptance", () => {
    assert.equal(estimateSchema.parse({ ...enquiry, website: "spam" }).website, "spam");
  });
  test("email HTTP and network failures stay non-fatal", async () => {
    const original = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "test-placeholder-not-a-credential";
    try {
      assert.equal(await notifyEstimate(estimateSchema.parse(enquiry), (async () => new Response("Unverified domain", { status: 403 })) as typeof fetch), undefined);
      assert.equal(await notifyEstimate(estimateSchema.parse(enquiry), (async () => { throw new Error("Network unavailable"); }) as typeof fetch), undefined);
    } finally {
      if (original === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = original;
    }
  });
});