export type ContactDiagnostic = {
  event:
    | "disabled"
    | "configuration_error"
    | "limiter_error"
    | "rate_limited"
    | "provider_accepted"
    | "provider_rejected"
    | "provider_network"
    | "provider_invalid_ack";
  requestId: string;
  providerStatus?: number;
  providerId?: string;
  missingSettings?: string[];
  invalidSettings?: string[];
};
export type ContactLogger = (event: ContactDiagnostic) => void;
// Only fixed event names and explicitly selected non-sensitive fields enter logs.
export const logContact: ContactLogger = (event) => {
  console.info(JSON.stringify({ component: "contact", ...event }));
};
