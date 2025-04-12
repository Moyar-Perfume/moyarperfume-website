import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import "@/models/Brand"; // Import Brand model to ensure it's registered

export async function GET(request) {
  await connectDB();
  try {
    const url = new URL(request.url || "http://localhost");
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
    const isAdmin = searchParams.get("admin") === "true"; // Kiểm tra xem có phải từ trang admin không
    const search = searchParams.get("search") || ""; // Thêm tham số tìm kiếm

    // Thêm các tham số lọc mới
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

    // Nếu không phải từ trang admin thì chỉ lấy sản phẩm có available = true
    if (!isAdmin) {
      query.available = true;
    }

    // Thêm điều kiện tìm kiếm theo tên sản phẩm
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa/thường
    }

    // Lọc theo brand
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
      query.tags = { $in: [`gioitinh_Nước Hoa ${gioitinh}`] }; // lọc theo tag giới tính
    }

    // Lọc theo giá
    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== null) {
        query.price.$lte = maxPrice;
      }
    }

    // Lọc theo tags
    if (tags && tags.length > 0) {
      // Tạo mảng các điều kiện lọc cho từng tag
      const tagConditions = tags.map((tag) => {
        // Kiểm tra xem tag có prefix không
        if (tag.includes("_")) {
          const [prefix, value] = tag.split("_");
          return { tags: { $in: [tag] } };
        } else {
          // Nếu không có prefix, tìm kiếm tag chứa giá trị này
          return { tags: { $regex: tag, $options: "i" } };
        }
      });

      // Kết hợp các điều kiện với $and
      query.$and = tagConditions;
    }

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    // Đếm tổng số sản phẩm phù hợp với query
    const totalProducts = await Product.countDocuments(query);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalProducts / limit);

    // Lấy sản phẩm cho trang hiện tại
    const products = await Product.find(query)
      .populate("brandID")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sắp xếp theo thứ tự mới nhất

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
