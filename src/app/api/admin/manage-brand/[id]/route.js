import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import mongoose from "mongoose";
import { connectDB } from "@/libs/mongoDB";
import { deleteImage } from "@/services/cloudinaryService";
import cloudinary from "@/libs/cloudinary";

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
  await connectDB();
  try {
    const { id } = params;
    const { name, logo, description, slug } = await req.json();

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    let logoUrl = existingBrand.logo; // Giữ nguyên logo cũ nếu không có logo mới

    // Kiểm tra nếu logo không phải là chuỗi rỗng
    if (logo && logo !== "") {
      if (logo.startsWith("data:image")) {
        const uploadResponse = await cloudinary.v2.uploader.upload(logo, {
          transformation: [{ width: 300, height: 300, crop: "limit" }],
          folder: "brands/brand-logo",
          public_id: id,
          use_filename: true,
          overwrite: true,
        });

        logoUrl = uploadResponse.secure_url; // Cập nhật logo mới từ Cloudinary
      }
    } else {
      logoUrl = ""; // Nếu logo là rỗng, để logo = ""
    }

    existingBrand.name = name;
    existingBrand.slug = slug;
    existingBrand.logo = logoUrl; // Cập nhật logo
    existingBrand.description = description;

    await existingBrand.save();

    return NextResponse.json(existingBrand, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật thương hiệu:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
