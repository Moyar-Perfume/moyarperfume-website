import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getPublicIdFolderFromUrl } from "@/utils/getPublicIdFromUrl";
import cloudinary from "@/libs/cloudinary";

// Xử lý yêu cầu DELETE
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm!" },
        { status: 404 }
      );
    }

    // Lấy public_id từ URL logo
    if (product.images[0].url) {
      const publicId = getPublicIdFolderFromUrl(product.images[0].url);

      cloudinary.api.delete_resources_by_prefix(
        `${publicId}/`,
        (error, result) => {
          console.log(result, error);
        }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Đã xóa thương hiệu và hình ảnh thành công",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  await connectDB();
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID sản phẩm không được cung cấp" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}
