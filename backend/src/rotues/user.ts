import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate"; // This helps to connect to the connection pool in edge runtime
import { sign } from "hono/jwt";
import { SigninInput, SignupInput } from "@mrunal121/codelogs-blog-common";

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
  try {
    const { success } = SigninInput.safeParse(await c.req.json());
    if (!success) {
      return c.json(
        {
          msg: "Invalid Input",
        },
        400
      );
    }

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
  } catch (error) {
    return c.json(
      {
        msg: "Error during signin",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

userRouter.post("/signup", async (c) => {
  try {
    const { success } = SignupInput.safeParse(await c.req.json());

    if (!success) {
      return c.json(
        {
          msg: "Invalid Input",
        },
        400
      );
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

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
