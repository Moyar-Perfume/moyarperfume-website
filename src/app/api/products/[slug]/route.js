import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import "@/models/Brand"; // Import Brand model to ensure it's registered
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = params;

    // Make sure the Brand model is loaded before using populate
    const product = await Product.findOne({ slug }).populate("brandID");

    if (!product) {
      console.log("Product not found with slug:", slug);
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy chi tiết sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}
