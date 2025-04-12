import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function requireAuth() {
  const token = cookies().get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}
