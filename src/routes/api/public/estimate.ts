import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  location: z.string().trim().min(1).max(200),
  bedrooms: z.enum(["Studio", "1", "2", "3", "4+"]),
  propertyType: z.enum(["Flat", "House", "Other"]),
  notes: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/public/estimate")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "INVALID_JSON" }, 400);
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) return json({ error: "INVALID_INPUT" }, 400);
        const data = parsed.data;

        // Honeypot — silently accept
        if (data.website && data.website.length > 0) {
          return json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        const userAgent = request.headers.get("user-agent");
        const ipHash = await sha256(ip + "|gk-salt");

        const { count } = await supabaseAdmin
          .from("estimate_submissions")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

        if ((count ?? 0) >= 3) return json({ error: "RATE_LIMIT" }, 429);

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

        if (error) return json({ error: "STORE_FAILED" }, 500);

        // Best-effort email notification — never fail the request on email errors.
        try {
          const origin = new URL(request.url).origin;
          const res = await fetch(`${origin}/lovable/email/transactional/send`, {
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
          });
          if (!res.ok) {
            console.warn("[estimate] email send failed", res.status, await res.text().catch(() => ""));
          }
        } catch (err) {
          console.warn("[estimate] email send threw", err);
        }

        return json({ ok: true });
      },
    },
  },
});
