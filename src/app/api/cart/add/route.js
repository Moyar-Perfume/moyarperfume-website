import { NextResponse } from "next/server";

import Cart from "@/models/Cart";

import { connectDB } from "@/libs/mongoDB";
import { getOrSetCartId } from "@/libs/cartCookie";
import ProductNhanhvn from "@/models/ProductNhanhvn";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { slug, variant, quantity } = body;

  const cartId = getOrSetCartId();

  const product = await ProductNhanhvn.findOne({ slug });
  if (!product)
    return NextResponse.json(
      { error: "Sản phẩm không tồn tại" },
      { status: 404 }
    );

  const matchedVariant = product.variants.id(variant.id);
  if (!matchedVariant)
    return NextResponse.json(
      { error: "Biến thể không hợp lệ" },
      { status: 400 }
    );

  let cart = await Cart.findOne({ cartId });

  if (!cart) {
    cart = new Cart({ cartId, isGuest: true, items: [] });
  }

  // Kiểm tra xem item đã tồn tại trong cart chưa (cùng slug + variant.id)
  const index = cart.items.findIndex(
    (item) => item.slug === slug && item.variant.id === variant.id
  );

  if (index >= 0) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({
      slug,
      variant: {
        id: variant.id,
        capacity: matchedVariant.capacity,
        price: matchedVariant.price,
      },
      quantity,
    });
  }

  await cart.save();
  return NextResponse.json({ success: true, cart });
}
