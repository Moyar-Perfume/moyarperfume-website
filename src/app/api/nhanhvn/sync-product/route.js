import { NextResponse } from "next/server";
import axios from "axios";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import Brand from "@/models/Brand";
import slugify from "slugify";
import { connectDB } from "@/libs/mongoDB";
import { splitNameAndCapacity } from "@/utils/splitNameAndCapacity";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchNhanhvnProducts = async () => {
  let page = 1;
  const allProducts = {};

  while (true) {
    const dataPayload = { page, icpp: 100 };

    const formData = new URLSearchParams();
    formData.append("accessToken", process.env.ACCESS_TOKEN);
    formData.append("version", process.env.API_VERSION);
    formData.append("appId", process.env.APP_ID);
    formData.append("businessId", process.env.BUSINESS_ID);
    formData.append("data", JSON.stringify(dataPayload));

    const res = await axios.post(
      "https://open.nhanh.vn/api/product/search",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { products = {}, totalPages = 1 } = res.data?.data || {};
    Object.assign(allProducts, products);

    if (page >= totalPages) break;
    page++;
    await sleep(1000);
  }

  return allProducts;
};

const groupProductsByBaseName = (products) => {
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
      images: p.images || [],
      brandName: p.brandName || "",
      nhanhBrandID: p.brandId || "",
      showHot: p.showHot === 1,
      showNew: p.showNew === 1,
      showHome: p.showHome === 1,
    });
  }
  return grouped;
};

const fetchProductDetail = async (productId) => {
  try {
    const formData = new URLSearchParams();
    formData.append("accessToken", process.env.ACCESS_TOKEN);
    formData.append("version", process.env.API_VERSION);
    formData.append("appId", process.env.APP_ID);
    formData.append("businessId", process.env.BUSINESS_ID);
    formData.append("data", productId);

    const res = await axios.post(
      "https://open.nhanh.vn/api/product/detail",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const detail = res.data?.data?.[productId];

    console.log("Đang lấy sản phẩm: " + productId);
    return detail?.content || "";
  } catch (err) {
    console.error(`❌ Lỗi lấy chi tiết sản phẩm ${productId}:`, err.message);
    return "";
  }
};

const saveGroupedProductsToDB = async (grouped) => {
  let count = 0;
  const delay = 400;

  for (const baseName in grouped) {
    const productGroup = grouped[baseName];
    const slug = slugify(baseName, { lower: true });

    const variants = productGroup.map((v) => ({
      nhanhID: v.nhanhID,
      capacity: v.capacity,
      price: v.price,
      quantity: v.quantity,
      available: v.quantity > 0,
    }));

    let mainVariant =
      productGroup.find((v) => v.capacity === "10ml") ||
      productGroup.find((v) =>
        v.capacity?.toLowerCase().includes("chiết 10ml")
      ) ||
      productGroup[0];

    const mainImage = mainVariant.image || "";
    const subImages = mainVariant.images || [];
    const nhanhBrandID = mainVariant.nhanhBrandID;
    const nhanhID = mainVariant.nhanhID;

    let brandID = null;
    if (mainVariant.brandName) {
      const brandSlug = slugify(mainVariant.brandName, { lower: true });
      let brand = await Brand.findOne({ slug: brandSlug });
      if (!brand) {
        try {
          brand = await Brand.create({
            name: mainVariant.brandName,
            slug: brandSlug,
            nhanhID: nhanhBrandID || "",
          });
          console.log("✅ Tạo brand mới:", mainVariant.brandName);
        } catch (err) {
          console.error("❌ Lỗi tạo brand:", err.message);
        }
      }
      brandID = brand?._id || null;
    }

    const content = nhanhID ? await fetchProductDetail(nhanhID) : "";

    await sleep(delay);
    await ProductNhanhvn.findOneAndUpdate(
      { slug },
      {
        name: baseName,
        slug,
        variants,
        mainImage,
        subImages,
        nhanhBrandID,
        brandID,
        available: true,
        description: "",
        content: content,
        showHot: mainVariant.showHot,
        showNew: mainVariant.showNew,
        showHome: mainVariant.showHome,
      },
      { upsert: true, new: true }
    );

    count++;
    if (count % 50 === 0) console.log(`📦 Đã xử lý ${count} sản phẩm...`);
  }

  console.log(`🎯 Đã lưu xong ${count} sản phẩm nhóm.`);
};

export async function POST() {
  try {
    await connectDB();
    const allProducts = await fetchNhanhvnProducts();
    const grouped = groupProductsByBaseName(allProducts);
    await saveGroupedProductsToDB(grouped);
    return NextResponse.json({ message: "Đồng bộ thành công!" });
  } catch (err) {
    console.error("❌ Đồng bộ lỗi:", err?.response?.data || err.message);
    return NextResponse.json(
      { message: "Lỗi đồng bộ sản phẩm" },
      { status: 500 }
    );
  }
}
