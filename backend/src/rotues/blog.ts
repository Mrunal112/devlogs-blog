import { Hono } from "hono";
import { PrismaClient } from ".prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  updateBlogInput,
  createBlogInput,
} from "@mrunal121/codelogs-blog-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

interface blogAdditionRequest {
  title: string;
  content: string;
}

interface blogUpdateRequest {
  id: string;
  title: string;
  content: string;
}

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        msg: "Unauthorized User",
      },
      403
    );
  }

  try {
    const token = authHeader.split(" ")[1];
    const isValidToken = await verify(token, c.env.JWT_SECRET);
    if (isValidToken.id) {
      c.set("userId", isValidToken.id as string);
      await next();
    }
  } catch (error) {
    return c.json(
      {
        msg: "Unautorized User",
      },
      403
    );
  }
});

blogRouter.post("/", async (c) => {
  try {
    const { success } = createBlogInput.safeParse(await c.req.json());

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

    const body = await c.req.json<blogAdditionRequest>();
    const blogId = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("userId"),
      },
    });

    return c.json(
      {
        msg: `Yes after the middlware using get ${c.get(
          "userId"
        )} or using c.get.var ${c.var.userId}`,
        blogId,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        msg: "Error creating blog",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

blogRouter.put("/", async (c) => {
  try {
    const { success } = updateBlogInput.safeParse(await c.req.json());

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

    const body = await c.req.json<blogUpdateRequest>();
    const blogId = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json(
      {
        msg: `Yes after the middlware using get ${c.get(
          "userId"
        )} or using c.get.var ${c.var.userId}`,
        blogId,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        msg: "Error updating blog",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json(
      {
        msg: "List of all blogs",
        blogs,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        msg: "Error fetching blogs",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Add a pagination feature
blogRouter.get("/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogId = c.req.param("id");
    const blog = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      return c.json(
        {
          msg: "Blog not found",
        },
        404
      );
    }

    return c.json(
      {
        msg: "Blog found",
        blog,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        msg: "Error fetching blog",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
