import { z } from "zod";

export const SignupInput = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

export const SigninInput = z.object({
  emailusername: z.string().or(z.email()),
  password: z.string().min(6),
});

export const createBlogInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updateBlogInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
});

export type SignupInput = z.infer<typeof SignupInput>;
export type SigninInput = z.infer<typeof SigninInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
