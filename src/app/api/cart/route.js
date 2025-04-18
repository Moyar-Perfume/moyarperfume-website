import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getOrSetCartId } from "@/libs/cartCookie";

export async function GET() {
  await connectDB();
  const cartId = getOrSetCartId();

  const cart = await Cart.findOne({ cartId });
  if (!cart) return NextResponse.json({ cart: null });

  const enrichedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findOne({ slug: item.slug });

      const variant = product?.variants.id(item.variant.id);
      return {
        ...item.toObject(),
        product: {
          name: product?.name,
          slug: product?.slug,
          image: product?.images?.[0]?.url,
        },
        variantDetails: variant || null,
      };
    })
  );

  return NextResponse.json({
    cart: { ...cart.toObject(), items: enrichedItems },
  });
}
