import { Hono } from "hono";
import { userRouter } from "./rotues/user";
import { blogRouter } from "./rotues/blog";
import { authRouter } from "./rotues/auth";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use("/api/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/auth", authRouter);

app.get("/hi", (c) => {
  return c.json("Hi There");
});

export default app;
