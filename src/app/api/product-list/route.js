import { connectDB } from "@/libs/mongoDB";
import ProductNhanhvn from "@/models/ProductNhanhvn"; // Đổi sang model mới
import { NextResponse } from "next/server";
import "@/models/Brand"; // Đảm bảo Brand vẫn được import

export const dynamic = "force-dynamic";

export async function GET(request) {
  await connectDB();
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

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
    const mua = searchParams.getAll("mua");

    const latest = searchParams.get("latest") === "true";

    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice"))
      : null;

    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice"))
      : null;

    // const tags = searchParams.get("tags")
    //   ? JSON.parse(searchParams.get("tags"))
    //   : [];

    const scent = searchParams.get("scent");
    const subScent = searchParams.getAll("subScent");

    console.log("subScent:", subScent);

    const brands = searchParams.getAll("brands");

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (brands && brands.length > 0) {
      query.brandID = { $in: brands };
    }

    if (exclude) {
      query.slug = { $ne: exclude };
    }

    if (productId) {
      query._id = { $ne: productId };
    }

    let tagConditions = [];

    if (gioitinh) {
      tagConditions.push({ tags: `gioitinh_Nước Hoa ${gioitinh}` });
    }

    if (scent) {
      tagConditions.push({ tags: `muihuong_${scent}` });
    }

    if (subScent && subScent.length > 0) {
      tagConditions.push({
        tags: { $in: subScent.map((val) => `notehuong_${val}`) },
      });
    }

    if (nongdo.length > 0) {
      tagConditions.push({
        tags: { $in: nongdo.map((val) => `nongdo_${val}`) },
      });
    }

    if (mua.length > 0) {
      tagConditions.push({ tags: { $all: mua.map((val) => `mua_${val}`) } });
    }

    if (tagConditions.length > 0) {
      query.$and = tagConditions;
    }

    if (minPrice !== null || maxPrice !== null) {
      query.variants = { $elemMatch: { available: true } };
      if (minPrice !== null) {
        query.variants.$elemMatch.price = {
          ...query.variants.$elemMatch.price,
          $gte: minPrice,
        };
      }
      if (maxPrice !== null) {
        query.variants.$elemMatch.price = {
          ...query.variants.$elemMatch.price,
          $lte: maxPrice,
        };
      }
    }

    const skip = (page - 1) * limit;
    const totalProducts = await ProductNhanhvn.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await ProductNhanhvn.find(query)
      .populate("brandID")
      .skip(skip)
      .limit(limit)
      .sort(latest ? { createdAt: -1 } : { createdAt: 1 })
      .lean();

    const filteredProducts = products.map((product) => ({
      ...product,
      variants: product.variants.filter((v) => {
        if (!v.available) return false;
        if (minPrice !== null && v.price < minPrice) return false;
        if (maxPrice !== null && v.price > maxPrice) return false;
        return true;
      }),
    }));

    return NextResponse.json(
      {
        products: filteredProducts,
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
