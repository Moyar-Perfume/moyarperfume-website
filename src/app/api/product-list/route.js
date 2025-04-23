import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import "@/models/Brand"; // Import Brand model to ensure it's registered

export async function GET(request) {
  await connectDB();
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const brandId = searchParams.get("brandId");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 12;
    const exclude = searchParams.get("exclude");
    const productId = searchParams.get("productId");
    const gioitinh = searchParams.get("gender");
    const search = searchParams.get("search") || "";
    const nongdo = searchParams.getAll("nongdo");
    const latest = searchParams.get("latest") === "true";

    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice"))
      : null;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice"))
      : null;
    const tags = searchParams.get("tags")
      ? JSON.parse(searchParams.get("tags"))
      : [];
    const brandIds = searchParams.get("brandIds")
      ? JSON.parse(searchParams.get("brandIds"))
      : [];

    let query = {};

    query.available = true;

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (brandIds && brandIds.length > 0) {
      query.brandID = { $in: brandIds };
    } else if (brandId) {
      query.brandID = brandId;
    }

    if (exclude) {
      query.slug = { $ne: exclude };
    }

    if (productId) {
      query._id = { $ne: productId };
    }

    if (gioitinh) {
      query.tags = { $in: [`gioitinh_Nước Hoa ${gioitinh}`] };
    }

    if (nongdo.length > 0) {
      query.tags = { $in: nongdo.map((val) => `nongdo_${val}`) };
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== null) {
        query.price.$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .populate("brandID")
      .skip(skip)
      .limit(limit)
      .sort(latest ? { createdAt: -1 } : { createdAt: 1 });

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
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}
