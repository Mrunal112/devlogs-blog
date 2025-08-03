import { z } from "zod";
export declare const SignupInput: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const SigninInput: z.ZodObject<{
    email: z.ZodUnion<[z.ZodString, z.ZodEmail]>;
    password: z.ZodString;
}, z.core.$strip>;
export declare const createBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export declare const updateBlogInput: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof SignupInput>;
export type SigninInput = z.infer<typeof SigninInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
