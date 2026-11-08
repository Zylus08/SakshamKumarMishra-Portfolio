import { z } from "zod";
const singleLine = z
  .string()
  .trim()
  .refine(
    (value) => !/[\r\n\u0000-\u001f\u007f]/.test(value),
    "Use a single line.",
  );
export const contactSchema = z
  .object({
    email: singleLine.pipe(
      z.string().email("Enter a valid email address.").max(254),
    ),
    subject: singleLine.pipe(
      z
        .string()
        .min(3, "Use at least 3 characters.")
        .max(160, "Use at most 160 characters."),
    ),
    message: z
      .string()
      .trim()
      .min(20, "Write at least 20 characters.")
      .max(5000, "Use at most 5,000 characters.")
      .refine(
        (value) =>
          !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value),
        "Remove control characters.",
      ),
    name: singleLine.pipe(z.string().max(80)).optional().default(""),
    website: z.string().max(200).optional().default(""),
  })
  .strict();
export type ContactInput = z.infer<typeof contactSchema>;
export const MAX_BODY_BYTES = 16_384;
