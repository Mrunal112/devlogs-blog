import { Hono } from "hono";
import { verify } from "hono/jwt";

export const authRouter = new Hono<{
  Bindings: {
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

authRouter.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Access token required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return c.json({ error: 'Access token required' }, 401);
    }

    const payload = await verify(token, c.env.JWT_SECRET);
    
    if (!payload.id) {
      return c.json({ error: 'Invalid token' }, 403);
    }

    return c.json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        username: payload.username
      }
    });
    
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 403);
  }
});
