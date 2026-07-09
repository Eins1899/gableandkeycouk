import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  location: z.string().trim().min(1).max(200),
  bedrooms: z.enum(["Studio", "1", "2", "3", "4+"]),
  propertyType: z.enum(["Flat", "House", "Other"]),
  notes: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""), // honeypot
});

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

    if ((count ?? 0) >= 3) {
      throw new Error("RATE_LIMIT");
    }

    const { error } = await supabaseAdmin.from("estimate_submissions").insert({
      name: data.name,
      email: data.email,
      location: data.location,
      bedrooms: data.bedrooms,
      property_type: data.propertyType,
      notes: data.notes || null,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    if (error) throw new Error(error.message);

    // Try to send notification email if infrastructure is set up.
    try {
      const origin = new URL((await import("@tanstack/react-start/server")).getRequest().url).origin;
      await fetch(`${origin}/lovable/email/transactional/send`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.LOVABLE_API_KEY ?? ""}`,
        },
        body: JSON.stringify({
          templateName: "estimate-notification",
          recipientEmail: "hello@gableandkey.co.uk",
          idempotencyKey: `estimate-${ipHash}-${Date.now()}`,
          templateData: { ...data },
        }),
      }).catch(() => {});
    } catch {
      // Email not configured yet — submission is still stored.
    }

    return { ok: true as const };
  });
