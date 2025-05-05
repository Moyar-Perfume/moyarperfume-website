import { NextResponse } from "next/server";
import axios from "axios";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import Brand from "@/models/Brand";
import slugify from "slugify";
import { connectDB } from "@/libs/mongoDB";

// ----------------------- Helpers -----------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const splitNameAndCapacity = (fullName = "") => {
  const [baseName, capacity = "default"] = fullName
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
      nhanhID: p.idNhanh?.toString() || "",
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

const saveGroupedProductsToDB = async (grouped) => {
  console.log("💾 Bắt đầu lưu vào database...");
  let count = 0;

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

    const { image, brandName } = productGroup[0] || {};
    let brandID = null;

    if (brandName) {
      const brand = await Brand.findOneAndUpdate(
        { name: brandName },
        { name: brandName },
        { upsert: true, new: true }
      );
      brandID = brand._id;
    }

    await ProductNhanhvn.findOneAndUpdate(
      { slug },
      {
        name: baseName,
        slug,
        variants,
        images: image ? [{ url: image }] : [],
        brandID,
        available: true,
      },
      { upsert: true, new: true }
    );

    count++;
    if (count % 100 === 0) console.log(`📥 Đã lưu ${count} sản phẩm...`);
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

// // ---------------------- Main Handler ----------------------
// export async function GET() {
//   try {
//     await connectDB();

//     // Bỏ phần xử lý thời gian để lấy toàn bộ sản phẩm
//     // const lastSync = await SyncLog.findOne({ type: "productnhanh" }).sort({
//     //   updatedAt: -1,
//     // });
//     // const from = lastSync?.lastSyncedAt || 0;
//     // const to = Math.floor(Date.now() / 1000);

//     const allProducts = await fetchNhanhvnProducts();
//     const grouped = groupProductsByBaseName(allProducts);
//     await saveGroupedProductsToDB(grouped);

//     // Bỏ lưu thời gian đồng bộ
//     // await SyncLog.findOneAndUpdate(
//     //   { type: "productnhanh" },
//     //   { type: "productnhanh", lastSyncedAt: to },
//     //   { upsert: true }
//     // );

//     return NextResponse.json({ message: "Đồng bộ thành công!" });
//   } catch (error) {
//     console.error("SYNC ERROR:", error?.response?.data || error.message);
//     return NextResponse.json(
//       { message: "Lỗi đồng bộ sản phẩm" },
//       { status: 500 }
//     );
//   }
// }
