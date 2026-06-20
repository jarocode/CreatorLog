import { z } from 'zod';

// Mirrors the remote project's minimum_password_length (config.toml).
export const MIN_PASSWORD_LENGTH = 6;

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Flattens a ZodError into `{ field: message }` for inline form errors,
 * keeping only the first message per field.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
