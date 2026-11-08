import { createContactHandler } from "@/lib/contact/handler";
import { contactMode } from "@/lib/contact/config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createContactHandler();
export function GET() {
  return Response.json(
    { mode: contactMode() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
