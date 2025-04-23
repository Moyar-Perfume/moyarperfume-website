import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";

import cloudinary from "@/libs/cloudinary";
import Brand from "@/models/Brand";
import slugify from "slugify";

export async function GET(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Tạo điều kiện lọc
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // không phân biệt hoa thường
      : {};

    const totalBrands = await Brand.countDocuments(filter);
    const totalPages = Math.ceil(totalBrands / limit);

    const brands = await Brand.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        brands,
        pagination: {
          currentPage: page,
          totalPages,
          totalBrands,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách brand" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const { name, logo, description } = await req.json();

    const slug = slugify(name, { lower: true, strict: true });

    let existingBrandBySlug = await Brand.findOne({ slug });
    if (existingBrandBySlug) {
      return Response.json({ error: "Brand đã tồn tại !!!" }, { status: 400 });
    }

    let logoUrl = ""; // mặc định nếu không có logo

    if (logo) {
      const uploadResponse = await cloudinary.v2.uploader.upload(logo, {
        transformation: [{ width: 300, height: 300, crop: "limit" }],
        folder: "brands/brand-logo",
        public_id: slug,
        use_filename: true,
      });

      logoUrl = uploadResponse.secure_url;
    }

    const newBrand = await Brand.create({
      name,
      logo: logoUrl,
      slug,
      description,
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo brand:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
