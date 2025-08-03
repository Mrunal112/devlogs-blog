"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInput = exports.createBlogInput = exports.SigninInput = exports.SignupInput = void 0;
const zod_1 = require("zod");
exports.SignupInput = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
});
exports.SigninInput = zod_1.z.object({
    email: zod_1.z.string().or(zod_1.z.email()),
    password: zod_1.z.string().min(6),
});
exports.createBlogInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
});
exports.updateBlogInput = zod_1.z.object({
    id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
});
