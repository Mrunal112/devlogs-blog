import { Hono } from "hono";
import { userRouter } from "./rotues/user";
import { blogRouter } from "./rotues/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.get("/hi", (c) => {
  return c.json("Hi There");
});

export default app;
