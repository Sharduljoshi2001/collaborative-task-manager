import { z } from "zod";
//user registration schema
export const registerSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  name : z.string().min(2,"Name must be atleast 2 characters"),
  password:z.string().min(6,"Password must be atleast 6 characters")
});
export type RegisterInput = z.infer<typeof registerSchema>;

//login validation schema
export const loginSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;