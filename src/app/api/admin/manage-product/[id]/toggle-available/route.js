import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import { NextResponse } from "next/server";

////// Product Cũ
// export async function PATCH(request, { params }) {
//   try {
//     await connectDB();
//     const productId = params.id;

//     // Tìm sản phẩm
//     const product = await Product.findById(productId);

//     if (!product) {
//       return NextResponse.json(
//         { error: "Không tìm thấy sản phẩm" },
//         { status: 404 }
//       );
//     }

//     // Đảo ngược trạng thái available
//     product.available = !product.available;

//     // Lưu sản phẩm
//     await product.save();

//     return NextResponse.json(
//       {
//         message: `Đã ${
//           product.available ? "bật" : "tắt"
//         } trạng thái hiển thị cho sản phẩm`,
//         available: product.available,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
//     return NextResponse.json(
//       { error: "Lỗi khi cập nhật trạng thái hiển thị" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const productId = params.id;

    // Tìm sản phẩm
    const product = await ProductNhanhvn.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Đảo ngược trạng thái available
    product.available = !product.available;

    // Lưu sản phẩm
    await product.save();

    return NextResponse.json(
      {
        message: `Đã ${
          product.available ? "bật" : "tắt"
        } trạng thái hiển thị cho sản phẩm`,
        available: product.available,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật trạng thái hiển thị" },
      { status: 500 }
    );
  }
}
