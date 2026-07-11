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

          // Best-effort email notification via Resend — never fail the request on email errors.
          try {
            const resendKey = process.env.RESEND_API_KEY;
            if (!resendKey) {
              console.warn("[estimate] RESEND_API_KEY not configured — skipping email");
            } else {
              const timestamp = new Date().toISOString();
              const escape = (s: string) =>
                s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
              const rows: [string, string][] = [
                ["Name", data.name],
                ["Email", data.email],
                ["Property location", data.location],
                ["Bedrooms", data.bedrooms],
                ["Property type", data.propertyType],
                ["Message", data.notes || "(none)"],
                ["Submitted", timestamp],
              ];
              const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5">
<h2 style="margin:0 0 12px">New estimate enquiry</h2>
<table style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>${escape(k)}</strong></td><td style="padding:4px 0;white-space:pre-wrap">${escape(v)}</td></tr>`).join("")}
</table>
</div>`;
              const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

              const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  authorization: `Bearer ${resendKey}`,
                },
                body: JSON.stringify({
                  from: "Gable & Key <notifications@notify.gableandkey.co.uk>",
                  to: ["hello@gableandkey.co.uk"],
                  reply_to: data.email,
                  subject: `New estimate enquiry — ${data.name}, ${data.location}`,
                  html,
                  text,
                }),
              });
              if (!res.ok) {
                console.warn("[estimate] resend send failed", res.status, await res.text().catch(() => ""));
              }
            }
          } catch (err) {
            console.warn("[estimate] email send threw", err);
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
