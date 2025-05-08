import { NextResponse } from "next/server";
import axios from "axios";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import Brand from "@/models/Brand";
import slugify from "slugify";
import { connectDB } from "@/libs/mongoDB";

// ----------------------- Helpers -----------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const splitNameAndCapacity = (fullName = "") => {
  const cleanName = fullName
    .replace(/[\u2013\u2014\u2012\u2010\u2011]/g, "-") // chuẩn hóa dash Unicode
    .replace(/[\s\u00A0]*[-\u2010-\u2015][\s\u00A0]*/g, " - "); // chuẩn hóa mọi dấu gạch về " - "

  const [baseName, capacity = "default"] = cleanName
    .split(" - ")
    .map((part) => part.trim());

  return { baseName, capacity };
};

const fetchNhanhvnProducts = async () => {
  let page = 1;
  const allProducts = {};

  console.log("🔁 Bắt đầu lấy dữ liệu từ Nhanh.vn...");

  while (true) {
    console.log(`📦 Đang lấy trang ${page}...`);
    const dataPayload = {
      page,
      icpp: 100,
    };

    const formData = new URLSearchParams();
    formData.append("accessToken", process.env.ACCESS_TOKEN);
    formData.append("version", process.env.API_VERSION);
    formData.append("appId", process.env.APP_ID);
    formData.append("businessId", process.env.BUSINESS_ID);
    formData.append("data", JSON.stringify(dataPayload));

    const res = await axios.post(
      "https://open.nhanh.vn/api/product/search",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { products = {}, totalPages = 1 } = res.data?.data || {};
    console.log(
      `✅ Trang ${page} lấy được ${Object.keys(products).length} sản phẩm.`
    );

    Object.assign(allProducts, products);

    if (page >= totalPages) break;
    page++;
    await sleep(1000);
  }

  console.log(
    `🎯 Tổng số sản phẩm lấy được: ${Object.keys(allProducts).length}`
  );
  return allProducts;
};

const groupProductsByBaseName = (products) => {
  console.log("🔍 Bắt đầu gom nhóm theo tên sản phẩm...");
  const grouped = {};

  for (const key in products) {
    const p = products[key];
    const { baseName, capacity } = splitNameAndCapacity(p.name);
    if (!baseName) continue;

    grouped[baseName] = grouped[baseName] || [];
    grouped[baseName].push({
      nhanhID: p.idNhanh || "",
      capacity,
      price: p.price || 0,
      quantity: p.inventory?.available || 0,
      image: p.image || "",
      brandName: p.brandName || "",
    });
  }

  console.log(
    `🧾 Số nhóm sản phẩm sau khi xử lý: ${Object.keys(grouped).length}`
  );
  return grouped;
};

let detailFetchCount = 0;

const fetchProductDetail = async (productId) => {
  try {
    detailFetchCount++;
    console.log(
      `🔍 [${detailFetchCount}] Fetch chi tiết sản phẩm ID: ${productId}`
    );

    const formData = new URLSearchParams();
    formData.append("accessToken", process.env.ACCESS_TOKEN);
    formData.append("version", process.env.API_VERSION);
    formData.append("appId", process.env.APP_ID);
    formData.append("businessId", process.env.BUSINESS_ID);
    formData.append("data", productId);

    const res = await axios.post(
      "https://open.nhanh.vn/api/product/detail",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const productDetail = res.data?.data?.[productId];
    const content = productDetail?.content || "";

    return content;
  } catch (err) {
    console.error(
      `❌ Lỗi khi fetch chi tiết sản phẩm ${productId}:`,
      err.message
    );
    return "";
  }
};

const saveGroupedProductsToDB = async (grouped) => {
  console.log("💾 Bắt đầu lưu vào database...");
  let count = 0;
  const delayBetweenCalls = 400;

  for (const baseName in grouped) {
    const slug = slugify(baseName, { lower: true });
    const productGroup = grouped[baseName];

    const variants = productGroup.map((v) => ({
      nhanhID: v.nhanhID,
      capacity: v.capacity,
      price: v.price,
      quantity: v.quantity,
      available: v.quantity > 0,
    }));

    const { image, brandName, nhanhID } = productGroup[0] || {};
    let brandID = null;

    if (brandName) {
      const brandSlug = slugify(brandName, { lower: true });
      let brand = await Brand.findOne({ slug: brandSlug });

      if (!brand) {
        try {
          brand = await Brand.create({ name: brandName, slug: brandSlug });
          console.log("✅ Tạo brand mới:", brandName);
        } catch (err) {
          console.error("❌ Không thể tạo brand:", brandName, "-", err.message);
          continue;
        }
      } else {
        console.log("⏭️ Brand đã tồn tại:", brandName);
      }
      brandID = brand?._id || null;
    }

    // Chờ 220ms trước khi gọi tiếp API chi tiết
    await sleep(delayBetweenCalls);
    const description = nhanhID ? await fetchProductDetail(nhanhID) : "";

    await ProductNhanhvn.findOneAndUpdate(
      { slug },
      {
        name: baseName,
        slug,
        variants,
        images: image ? [{ url: image }] : [],
        brandID,
        available: true,
        description,
      },
      { upsert: true, new: true }
    );

    count++;
    if (count % 50 === 0) console.log(`📥 Đã lưu ${count} sản phẩm...`);
  }

  console.log(`✅ Hoàn tất lưu ${count} nhóm sản phẩm.`);
};

// ---------------------- Main Handler ----------------------
export async function POST() {
  try {
    await connectDB();
    console.log("🔌 Đã kết nối database.");

    const allProducts = await fetchNhanhvnProducts();
    const grouped = groupProductsByBaseName(allProducts);
    await saveGroupedProductsToDB(grouped);

    console.log("🎉 Đồng bộ toàn bộ sản phẩm hoàn tất.");
    return NextResponse.json({ message: "Đồng bộ thành công!" });
  } catch (error) {
    console.error("❌ SYNC ERROR:", error?.response?.data || error.message);
    return NextResponse.json(
      { message: "Lỗi đồng bộ sản phẩm" },
      { status: 500 }
    );
  }
}
