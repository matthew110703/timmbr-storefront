import { z } from "zod";
import { strings } from "@/app/strings";

const s = strings.security;

/** Same rule as timmbr-core's password policy. */
export const STRONG_PASSWORD =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, s.profile.nameError)
    .max(64, s.profile.nameError),
});
export type NameValues = z.infer<typeof nameSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, s.password.required),
    newPassword: z.string().regex(STRONG_PASSWORD, s.password.weak),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: s.password.mismatch,
  });
export type PasswordValues = z.infer<typeof passwordSchema>;

/** "Create a password": the emailed / texted code plus the new password. */
export const createPasswordSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, s.password.codeError),
    newPassword: z.string().regex(STRONG_PASSWORD, s.password.weak),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: s.password.mismatch,
  });
export type CreatePasswordValues = z.infer<typeof createPasswordSchema>;
