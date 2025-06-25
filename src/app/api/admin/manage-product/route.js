import cloudinary from "@/libs/cloudinary";
import { connectDB } from "@/libs/mongoDB";
import Brand from "@/models/Brand";
import Product from "@/models/Product";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Tạo Sản Phẩm Mới
// export async function POST(req) {
//   await connectDB();
//   try {
//     const body = await req.json();
//     const {
//       name,
//       brandID,
//       description,
//       slug,
//       tags,
//       available,
//       variants,
//       images,
//     } = body;

//     const productId = new mongoose.Types.ObjectId();

//     const uploadedImages = [];

//     for (let i = 0; i < images.length; i++) {
//       const { file, type, typeNumber } = images[i];

//       // Kích thước theo typeNumber
//       let width = 1024;
//       let height = 1024;
//       if (typeNumber === 2) {
//         width = 900;
//         height = 500;
//       } else if (typeNumber === 3) {
//         width = 800;
//         height = 900;
//       }

//       const uploadRes = await cloudinary.v2.uploader.upload(file, {
//         folder: `products/${productId}`,
//         public_id: `${productId}-${typeNumber}`,
//         overwrite: true,
//         transformation: [{ width, height, crop: "fill", gravity: "auto" }],
//       });

//       uploadedImages.push({
//         url: uploadRes.secure_url,
//         public_id: uploadRes.public_id,
//         typeNumber,
//         type: type,
//       });
//     }

//     // Create new product
//     const newProduct = new Product({
//       _id: productId,
//       name,
//       brandID,
//       description,
//       slug,
//       tags,
//       available: available !== undefined ? available : true,
//       images: uploadedImages || [],
//       variants,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     await newProduct.save();

//     return NextResponse.json(
//       {
//         message: "Thêm sản phẩm mới thành công",
//         product: newProduct,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       { error: "Không thể tạo sản phẩm mới", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const searchQuery = searchParams.get("search") || "";

    let brandIDs = [];

    if (searchQuery) {
      const matchedBrands = await Brand.find({
        name: { $regex: searchQuery, $options: "i" },
      }).select("_id");

      brandIDs = matchedBrands.map((brand) => brand._id);
    }

    const searchCondition = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { brandID: { $in: brandIDs } },
      ],
    };

    const totalProducts = await ProductNhanhvn.countDocuments(searchCondition);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await ProductNhanhvn.find(searchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("brandID", "name");

    // ✅ Trường hợp không có sản phẩm
    if (products.length === 0) {
      return NextResponse.json(
        {
          message: "No Product Found",
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
            hasMore: false,
          },
        },
        { status: 200 }
      );
    }

    // ✅ Trường hợp có sản phẩm
    return NextResponse.json(
      {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}

////// Sản Phẩm Cũ
// export async function GET(req) {
//   await connectDB();
//   try {
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;

//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "12");
//     const skip = (page - 1) * limit;

//     const searchQuery = searchParams.get("search")?.trim() || "";

//     let brandIDs = [];

//     // Tìm tất cả brand có chứa từ khóa trong tên
//     if (searchQuery) {
//       const matchedBrands = await Brand.find({
//         name: { $regex: searchQuery, $options: "i" },
//       }).select("_id");

//       brandIDs = matchedBrands.map((brand) => brand._id);
//     }

//     // Điều kiện tìm kiếm
//     const searchCondition = {
//       $or: [
//         { name: { $regex: searchQuery, $options: "i" } }, // theo tên sản phẩm
//         { brandID: { $in: brandIDs } }, // theo brand khớp
//       ],
//     };

//     const totalProducts = await Product.countDocuments(searchCondition);
//     const totalPages = Math.ceil(totalProducts / limit);

//     const products = await Product.find(searchCondition)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("brandID", "name");

//     return NextResponse.json(
//       {
//         products,
//         pagination: {
//           currentPage: page,
//           totalPages,
//           totalProducts,
//           hasMore: page < totalPages,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json(
//       { error: "Không thể lấy dữ liệu sản phẩm", details: error.message },
//       { status: 500 }
//     );
//   }
// }
