// app/api/cart/merge/route.js
import { getOrSetCartId } from "@/libs/cartCookie";
import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function POST() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const cartId = getOrSetCartId();

  if (!userId) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const guestCart = await Cart.findOne({ cartId });
  if (!guestCart)
    return NextResponse.json({ error: "Không có cart" }, { status: 404 });

  const userCart = await Cart.findOne({ userId, isGuest: false });

  if (userCart) {
    // Gộp
    guestCart.items.forEach((item) => {
      const index = userCart.items.findIndex(
        (i) => i.productId.toString() === item.productId.toString()
      );

      if (index >= 0) {
        userCart.items[index].quantity += item.quantity;
      } else {
        userCart.items.push(item);
      }
    });

    await guestCart.deleteOne();
    await userCart.save();
    return NextResponse.json({ merged: true });
  } else {
    // Gán cart vào user
    guestCart.userId = userId;
    guestCart.isGuest = false;
    await guestCart.save();
    return NextResponse.json({ merged: false });
  }
}
