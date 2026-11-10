import { createContactHandler } from "@/lib/contact/handler";
import { contactAvailability } from "@/lib/contact/config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createContactHandler();
export function GET() {
  return Response.json(
    { mode: contactAvailability() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
