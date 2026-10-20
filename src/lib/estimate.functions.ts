import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { estimateSchema as schema, estimateRateLimited } from "./estimate";

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitEstimate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot — silently accept
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const userAgent = getRequestHeader("user-agent") ?? null;
    const ipHash = await sha256(ip + "|gk-salt");

    // Rate limit: max 3 per IP per hour
    const { count } = await supabaseAdmin
      .from("estimate_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (estimateRateLimited(count ?? 0)) {
      throw new Error("RATE_LIMIT");
    }

    const { error } = await supabaseAdmin.from("estimate_submissions").insert({
      name: data.name,
      email: data.email,
      location: data.location,
      bedrooms: data.bedrooms,
      property_type: data.propertyType,
      already_listed: data.alreadyListed,
      listing_link_or_phone: data.listingLinkOrPhone || null,
      notes: data.notes || null,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    if (error) throw new Error(error.message);

    try {
      const { notifyEstimate } = await import("./estimate-email.server");
      await notifyEstimate(data);
    } catch (error) {
      console.warn("[estimate] email notification failed", error);
    }

    return { ok: true as const };
  });
