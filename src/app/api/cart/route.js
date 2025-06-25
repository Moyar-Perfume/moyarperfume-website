import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Cart from "@/models/Cart";
import { getOrSetCartId } from "@/libs/cartCookie";
import ProductNhanhvn from "@/models/ProductNhanhvn";

export async function GET() {
  await connectDB();
  const cartId = getOrSetCartId();

  let cart = await Cart.findOne({ cartId });
  if (!cart) return NextResponse.json({ cart: null });

  const newItems = [];

  for (const item of cart.items) {
    const product = await ProductNhanhvn.findOne({ slug: item.slug });

    // Nếu sản phẩm không tồn tại => bỏ qua item này
    if (!product) continue;

    const variant = product.variants.id(item.variant.id);

    // Nếu variant không tồn tại => cũng bỏ qua item này
    if (!variant) continue;

    // Nếu hợp lệ thì đẩy vào danh sách mới
    newItems.push({
      ...item.toObject(),
      name: product.name,
      image: product.images?.[0]?.url,
      variant: {
        ...item.variant,
        capacity: variant.capacity,
        price: variant.price,
        quantity: variant.quantity,
        nhanhID: variant.nhanhID,
      },
    });
  }

  // Cập nhật lại cart nếu có item bị xóa
  if (newItems.length !== cart.items.length) {
    cart.items = newItems.map((item) => ({
      slug: item.slug,
      variant: { id: item.variant.id },
      quantity: item.quantity,
    }));
    await cart.save();
  }

  return NextResponse.json({
    cart: { ...cart.toObject(), items: newItems },
  });
}
