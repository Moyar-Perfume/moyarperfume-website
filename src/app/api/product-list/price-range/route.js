// /app/api/filter/price-range/route.js (hoặc đường dẫn tương đương trong /api)

import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import ProductNhanhvn from "@/models/ProductNhanhvn";

export async function GET() {
  await connectDB();

  try {
    // Sử dụng aggregation pipeline để tính toán min, max và lấy tất cả giá
    const result = await ProductNhanhvn.aggregate([
      // Tách mỗi sản phẩm thành nhiều document, mỗi document ứng với một variant
      { $unwind: "$variants" },

      // Chỉ lấy các variant có sẵn hàng và có giá lớn hơn 0
      {
        $match: {
          "variants.available": { $in: [true, "true"] },
        },
      },

      // Nhóm tất cả lại để tính toán trong một lần duy nhất
      {
        $group: {
          _id: null, // Nhóm tất cả document thành một
          minPrice: { $min: "$variants.price" }, // Tìm giá thấp nhất
          maxPrice: { $max: "$variants.price" }, // Tìm giá cao nhất
          allPrices: { $push: "$variants.price" }, // Gom tất cả giá vào một mảng
        },
      },
    ]);

    // Trường hợp không có sản phẩm nào được tìm thấy
    if (result.length === 0) {
      // Trả về một mảng cho budgetRange
      return NextResponse.json({ budgetRange: [0, 0], allPrices: [] });
    }

    // Lấy kết quả từ aggregation
    const { minPrice, maxPrice, allPrices } = result[0];

    // *** THAY ĐỔI: Gộp minPrice và maxPrice vào mảng budgetRange ***
    return NextResponse.json({
      budgetRange: [minPrice, maxPrice],
      allPrices,
    });
  } catch (error) {
    console.error("Lỗi khi lấy khoảng giá và danh sách giá:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
