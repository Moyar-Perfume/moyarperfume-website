import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import { NextResponse } from "next/server";

////// Product Cũ
// export async function PATCH(request, { params }) {
//   try {
//     await connectDB();
//     const productId = params.id;
//     const variantId = params.variantId;

//     // Tìm sản phẩm
//     const product = await Product.findById(productId);

//     if (!product) {
//       return NextResponse.json(
//         { error: "Không tìm thấy sản phẩm" },
//         { status: 404 }
//       );
//     }

//     // Tìm variant
//     const variant = product.variants.id(variantId);

//     if (!variant) {
//       return NextResponse.json(
//         { error: "Không tìm thấy biến thể sản phẩm" },
//         { status: 404 }
//       );
//     }

//     // Đảo ngược trạng thái available của variant
//     variant.available = !variant.available;

//     // Lưu sản phẩm
//     await product.save();

//     return NextResponse.json(
//       {
//         message: `Đã ${
//           variant.available ? "bật" : "tắt"
//         } trạng thái hiển thị cho biến thể`,
//         available: variant.available,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Lỗi khi cập nhật trạng thái hiển thị cho biến thể:", error);
//     return NextResponse.json(
//       { error: "Lỗi khi cập nhật trạng thái hiển thị cho biến thể" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const productId = params.id;
    const variantId = params.variantId;

    // Tìm sản phẩm
    const product = await ProductNhanhvn.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Tìm variant
    const variant = product.variants.id(variantId);

    if (!variant) {
      return NextResponse.json(
        { error: "Không tìm thấy biến thể sản phẩm" },
        { status: 404 }
      );
    }

    // Đảo ngược trạng thái available của variant
    variant.available = !variant.available;

    // Lưu sản phẩm
    await product.save();

    return NextResponse.json(
      {
        message: `Đã ${
          variant.available ? "bật" : "tắt"
        } trạng thái hiển thị cho biến thể`,
        available: variant.available,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái hiển thị cho biến thể:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật trạng thái hiển thị cho biến thể" },
      { status: 500 }
    );
  }
}
