import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import { getOrSetCartId } from "@/libs/cartCookie";
import Cart from "@/models/Cart";

export async function DELETE(req) {
  await connectDB();

  const cartId = getOrSetCartId();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const variantId = searchParams.get("variantId");

  if (!slug || !variantId) {
    return NextResponse.json(
      { error: "Thiếu thông tin slug hoặc variantId" },
      { status: 400 }
    );
  }

  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    return NextResponse.json(
      { error: "Không tìm thấy giỏ hàng" },
      { status: 404 }
    );
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => !(item.slug === slug && item.variant.id === variantId)
  );

  if (cart.items.length === initialLength) {
    return NextResponse.json(
      { error: "Không tìm thấy sản phẩm để xoá" },
      { status: 404 }
    );
  }

  await cart.save();

  return NextResponse.json({ success: true, cart });
}
