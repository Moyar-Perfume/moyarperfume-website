import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export function getOrSetCartId() {
  const cookieStore = cookies();
  let cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    cartId = uuidv4();
    cookieStore.set("cartId", cartId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
      path: "/",
    });
  }

  return cartId;
}
