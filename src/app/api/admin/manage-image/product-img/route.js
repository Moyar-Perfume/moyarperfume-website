import { NextResponse } from "next/server";

import cloudinary from "@/libs/cloudinary";

// export async function POST(request) {
//   try {
//     const data = await request.json();
//     const { file, slug, typeNumber, _id } = data;

//     if (!file) {
//       return NextResponse.json(
//         { error: "Lỗi dữ liệu", details: "Không tìm thấy file" },
//         { status: 400 }
//       );
//     }

//     // Sử dụng typeNumber từ request hoặc mặc định là 1
//     const imageNumber = typeNumber || 1;
//     console.log(`Using image number ${imageNumber} for slug: ${slug}`);

//     let width = 500;
//     let height = 500;

//     if (imageNumber === 2) {
//       width = 900;
//       height = 500;
//     } else if (imageNumber === 3) {
//       width = 800;
//       height = 900;
//     }

//     // Upload to Cloudinary
//     const uploadResponse = await cloudinary.v2.uploader.upload(file, {
//       folder: `products/${_id}`,
//       public_id: slug ? `${slug}-${imageNumber}` : `product-${imageNumber}`,
//       overwrite: true,
//       transformation: [
//         { width, height, crop: "fit", gravity: "auto" }, // fill để resize và giữ khung ảnh
//       ],
//     });

//     return NextResponse.json(uploadResponse.secure_url, { status: 201 });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: "Lỗi server", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Lỗi dữ liệu", details: "Không tìm thấy URL ảnh" },
        { status: 400 }
      );
    }
    const publicId = url.split("/").pop().split(".")[0];

    if (!publicId) {
      return NextResponse.json(
        { error: "Lỗi xử lý", details: "Không tìm thấy public_id" },
        { status: 400 }
      );
    }

    const deleteResponse = await cloudinary.v2.uploader.destroy(publicId);

    if (deleteResponse.result !== "ok") {
      throw new Error("Xóa ảnh không thành công");
    }

    return NextResponse.json({ success: true, message: "Ảnh đã bị xóa" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Lỗi server", details: error.message },
      { status: 500 }
    );
  }
}
