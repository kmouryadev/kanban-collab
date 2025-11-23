import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be 8-20 characters.")
    .regex(
      /(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must include letters and numbers."
    ),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
