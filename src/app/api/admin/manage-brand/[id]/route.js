import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import mongoose from "mongoose";
import { connectDB } from "@/libs/mongoDB";
import { deleteImage } from "@/services/cloudinaryService";

// Xử lý yêu cầu DELETE
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID không hợp lệ!" }, { status: 400 });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu!" },
        { status: 404 }
      );
    }

    // Lấy public_id từ URL logo
    if (brand.logo) {
      const cloudinaryResult = await deleteImage(brand.logo);
      console.log("Cloudinary delete result:", cloudinaryResult);
    }

    // Xóa thương hiệu
    const deletedBrand = await Brand.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Đã xóa thương hiệu và hình ảnh thành công",
      deletedBrand,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Nếu bạn cần GET cho brand theo ID
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // Kiểm tra id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID không hợp lệ!" }, { status: 400 });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu!" },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Cập nhật brand
export async function PUT(req, { params }) {
  // ...
}
