import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate"; // This helps to connect to the connection pool in edge runtime
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

interface SingupRequest {
  email: string;
  password: string;
  username: string;
}

interface SinginRequest {
  emailusername: string;
  password: string;
}

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json<SinginRequest>();

  const User = await prisma.user.findFirst({
    where: {
      OR: [{ username: body.emailusername }, { email: body.emailusername }],
    },
  });

  if (!User || User.password !== body.password) {
    const msg = !User ? "Invalid User" : "Incorrect Password";
    return c.json(
      {
        msg,
      },
      403
    );
  }

  const token = await sign({ id: User.id }, c.env.JWT_SECRET);

  return c.json(
    {
      token,
    },
    200
  );
});

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json<SingupRequest>();
    const User = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        username: body.username,
      },
    });

    const token = await sign({ id: User.id }, c.env.JWT_SECRET);

    return c.json(
      {
        token,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        msg: "Incorrect Inputs",
      },
      403
    );
  }
});
