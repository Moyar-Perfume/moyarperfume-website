import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function requireAuth() {
  const token = cookies().get("token")?.value;

  console.log(token);

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
