import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import ProductNhanhvn from "@/models/ProductNhanhvn"; // Model sản phẩm
import Brand from "@/models/Brand"; // Import model Brand

// Trong Next.js App Router, tên hàm phải là một phương thức HTTP (GET, POST, etc.)
export async function GET(req) {
  try {
    // Kết nối đến cơ sở dữ liệu
    await connectDB();

    // Lấy các tham số từ URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // Lấy từ khóa tìm kiếm

    // Nếu không có từ khóa tìm kiếm, trả về lỗi
    if (!query) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp từ khóa tìm kiếm." },
        { status: 400 }
      );
    }

    // --- Logic tìm kiếm sản phẩm ---
    const productSearchQuery = {
      name: { $regex: query, $options: "i" },
      variants: { $elemMatch: { available: true } },
    };
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const productsPromise = ProductNhanhvn.find(productSearchQuery)
      .populate("brandID")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const totalProductsPromise =
      ProductNhanhvn.countDocuments(productSearchQuery);

    // --- Logic tìm kiếm thương hiệu ---
    const brandSearchQuery = {
      name: { $regex: query, $options: "i" },
    };
    // Giới hạn số lượng brand trả về để giao diện gọn gàng
    const brandsPromise = Brand.find(brandSearchQuery).limit(5).lean();

    // Thực thi tất cả các promise song song để tối ưu tốc độ
    const [productsFromDB, totalProducts, brands] = await Promise.all([
      productsPromise,
      totalProductsPromise,
      brandsPromise,
    ]);

    // Xử lý kết quả sản phẩm: chỉ giữ lại variant 'available'
    const products = productsFromDB.map((product) => ({
      ...product,
      variants: product.variants.filter(
        (variant) => variant.available === true
      ),
    }));

    const totalPages = Math.ceil(totalProducts / limit);

    // Trả về kết quả đã được gộp chung
    return NextResponse.json({
      results: {
        products: {
          items: products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasMore: page < totalPages,
          },
        },
        brands: {
          items: brands,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra ở phía máy chủ." },
      { status: 500 }
    );
  }
}
