import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Brand from "@/models/Brand";

export async function GET(req) {
  await connectDB();

  try {
    // const url = new URL(req.url);
    // const searchParams = url.searchParams;

    // const search = searchParams.get("search") || "";

    // // Tạo điều kiện lọc
    // const filter = search
    //   ? { name: { $regex: search, $options: "i" } } // không phân biệt hoa thường
    //   : {};

    // const totalBrands = await Brand.countDocuments(filter);

    const brands = await Brand.find().sort({ createdAt: -1 });

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách brand" },
      { status: 500 }
    );
  }
}
