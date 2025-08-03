import { decode, sign, verify } from "hono/jwt";

const payload = {
  username: "mrunal121",
};

async function createToken(payload: { username: string }) {
  const secret = "hehesecrethai";

  const token = await sign(payload, secret);

  return token;
}
