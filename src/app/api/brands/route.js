import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Brand from "@/models/Brand";

export async function GET() {
  await connectDB();
  try {
    const brands = await Brand.find();
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách brand" },
      { status: 500 }
    );
  }
}
