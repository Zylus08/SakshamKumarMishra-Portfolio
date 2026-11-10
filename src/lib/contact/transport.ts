import type { ContactInput } from "./schema";
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
export function notification(input: ContactInput, timestamp: string) {
  const text = `SKM — Contact inquiry\n\nSubject: ${input.subject}\nVisitor: ${input.name || "Not provided"}\nEmail: ${input.email}\nSubmitted: ${timestamp}\n\n${input.message}`;
  const html = `<!doctype html><html lang="en"><body style="background:#f3f0e9;color:#25262b;font-family:Arial,sans-serif;padding:32px"><h1 style="font-size:24px">SKM · A new conversation</h1><h2 style="font-size:20px">${escapeHtml(input.subject)}</h2><p><strong>Visitor:</strong> ${escapeHtml(input.name || "Not provided")}<br><strong>Email:</strong> ${escapeHtml(input.email)}<br><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p><div style="white-space:pre-wrap;border-top:1px solid #cec8bd;padding-top:24px;line-height:1.7">${escapeHtml(input.message)}</div></body></html>`;
  return { text, html };
}
export type EmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
};
export class ContactProviderError extends Error {
  constructor(
    public readonly reason: "rejected" | "network" | "invalid_ack",
    public readonly status?: number,
  ) {
    super("Provider could not confirm acceptance");
  }
}
export async function sendResend(
  payload: EmailPayload,
  key: string,
  fetcher: typeof fetch = fetch,
) {
  let response: Response;
  try {
    response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new ContactProviderError("network");
  }
  if (!response.ok) throw new ContactProviderError("rejected", response.status);
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ContactProviderError("invalid_ack", response.status);
  }
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !data.id.trim()
  )
    throw new ContactProviderError("invalid_ack", response.status);
  return { accepted: true as const, id: data.id };
}
export async function mockTransport() {
  return { mock: true as const };
}
