import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
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

    const folderPath = "products/" + id;

    try {
      // 1. Lấy danh sách tất cả public_id trong folder
      const listResult = await cloudinary.v2.api.resources({
        type: "upload",
        prefix: folderPath + "/", // rất quan trọng
        max_results: 100,
      });

      const publicIds = listResult.resources.map((res) => res.public_id);

      // 2. Xóa toàn bộ ảnh trong folder nếu có
      if (publicIds.length > 0) {
        await cloudinary.v2.api.delete_resources(publicIds);
      }

      // 3. Xóa folder sau khi ảnh đã bị xóa
      await cloudinary.v2.api.delete_folder(folderPath);
    } catch (error) {
      console.error("Lỗi khi xóa folder Cloudinary:", error);
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

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const updateData = await req.json();
    updateData.updatedAt = new Date();

    const imagesFromClient = updateData.images || [];
    const uploadedImages = [];

    for (let i = 0; i < imagesFromClient.length; i++) {
      const { file, type, typeNumber, url, public_id } = imagesFromClient[i];

      // Nếu là ảnh cũ (có url và public_id), giữ lại
      if (!file && url) {
        uploadedImages.push({
          url,
          public_id,
          type,
          typeNumber,
        });
        continue;
      }

      // Lấy base64 từ file mới
      const base64Data = file;
      if (!base64Data) continue;

      // Resize theo loại ảnh
      let width = 500;
      let height = 500;
      if (typeNumber === 2) {
        width = 900;
        height = 500;
      } else if (typeNumber === 3) {
        width = 800;
        height = 900;
      }

      // Upload lên Cloudinary
      const uploadRes = await cloudinary.v2.uploader.upload(base64Data, {
        folder: `products/${id}`,
        public_id: `${id}-${typeNumber}`,
        overwrite: true,
        transformation: [{ width, height, crop: "fill", gravity: "auto" }],
      });

      uploadedImages.push({
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        type,
        typeNumber,
      });
    }

    // Gán lại danh sách ảnh
    updateData.images = uploadedImages;

    // Cập nhật vào MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}
