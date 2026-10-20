import { estimateEmailRows, type EstimateInput } from "./estimate";

export async function notifyEstimate(data: EstimateInput, send: typeof fetch = fetch) {
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("[estimate] RESEND_API_KEY not configured — skipping email");
      return;
    }
    const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = estimateEmailRows(data, new Date().toISOString());
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: "Gable & Key <notifications@notify.gableandkey.co.uk>",
        to: ["hello@gableandkey.co.uk"],
        reply_to: data.email,
        subject: `New estimate enquiry — ${data.name}, ${data.location}`,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<h2>New estimate enquiry</h2><table>${rows.map(([k, v]) => `<tr><th align="left">${escape(k)}</th><td>${escape(v)}</td></tr>`).join("")}</table>`,
      }),
    });
    if (!response.ok) console.warn("[estimate] resend send failed", response.status, await response.text());
  } catch (error) {
    console.warn("[estimate] email send threw", error);
  }
}