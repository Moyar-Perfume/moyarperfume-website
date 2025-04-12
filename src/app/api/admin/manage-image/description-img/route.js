import cloudinary from "@/libs/cloudinary";
import { connectDB } from "@/libs/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const { file } = await req.json();

    const uploadResponse = await cloudinary.v2.uploader.upload(file, {
      folder: "brands/brand-desciption",
      use_filename: true,
    });

    return NextResponse.json(uploadResponse.secure_url, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo brand:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
