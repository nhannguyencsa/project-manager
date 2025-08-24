import {z} from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Passwrod is required")
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be 8 characters"),
  confirmPassword: z.string().min(8, "Password must be 8 characters"),
  name: z.string().min(3, "Name must be at least 3 characters")
}).refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "Pass do not match"
});