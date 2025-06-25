// app/api/cart/route.js

import { getOrSetCartId } from "@/libs/cartCookie";
import { connectDB } from "@/libs/mongoDB";
import Cart from "@/models/Cart";

export async function PUT(req) {
  try {
    await connectDB();
    const { itemId, quantity } = await req.json();

    if (!itemId || !quantity) {
      return Response.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }
    const cartId = getOrSetCartId(); // Hoặc lấy từ token/session
    if (!cartId) {
      return Response.json(
        { message: "Không tìm thấy cartId" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return Response.json(
        { message: "Không tìm thấy giỏ hàng" },
        { status: 404 }
      );
    }

    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (!item) {
      return Response.json(
        { message: "Sản phẩm không tồn tại trong giỏ hàng" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();

    return Response.json({ message: "Cập nhật thành công", cart });
  } catch (error) {
    console.error("Lỗi PUT /cart:", error);
    return Response.json({ message: "Lỗi server" }, { status: 500 });
  }
}
