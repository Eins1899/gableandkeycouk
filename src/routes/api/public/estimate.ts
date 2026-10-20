import { createFileRoute } from "@tanstack/react-router";
import { estimateSchema as schema, estimateRateLimited } from "@/lib/estimate";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, X-Requested-With, Origin",
  "Access-Control-Max-Age": "86400",
};

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
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
      OPTIONS: async ({ request }) => {
        const requestedHeaders = request.headers.get("access-control-request-headers");
        const allowHeaders = requestedHeaders
          ? `${CORS_HEADERS["Access-Control-Allow-Headers"]}, ${requestedHeaders}`
          : CORS_HEADERS["Access-Control-Allow-Headers"];
        return new Response(null, {
          status: 204,
          headers: { ...CORS_HEADERS, "Access-Control-Allow-Headers": allowHeaders },
        });
      },
      POST: async ({ request }) => {
        try {
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

          if (estimateRateLimited(count ?? 0)) return json({ error: "RATE_LIMIT" }, 429);

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

          if (error) return json({ error: "STORE_FAILED" }, 500);

          // Email failures never undo a stored enquiry.
          try {
            const { notifyEstimate } = await import("@/lib/estimate-email.server");
            await notifyEstimate(data);
          } catch (error) {
            console.warn("[estimate] email notification failed", error);
          }

          return json({ ok: true });
        } catch (err) {
          console.error("[estimate] unhandled error", err);
          return json({ error: "SERVER_ERROR" }, 500);
        }
      },
    },
  },
});
