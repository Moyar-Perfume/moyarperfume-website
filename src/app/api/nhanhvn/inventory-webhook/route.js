import { NextResponse } from "next/server";
import axios from "axios";
import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import { splitNameAndCapacity } from "@/utils/splitNameAndCapacity";
import WebhookLog from "@/models/WebhookLog";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("📥 Webhook nhận:", JSON.stringify(body, null, 2));

    const log = await WebhookLog.create({ data: body });
    console.log(`📝 Đã lưu webhook vào DB (logId: ${log._id})`);

    const response = NextResponse.json(
      { message: "Webhook received" },
      { status: 200 }
    );

    // Xử lý webhook không đồng bộ
    handleWebhook(body, log._id).catch((err) =>
      console.error("❌ Lỗi xử lý webhook async:", err)
    );

    return response;
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

async function handleWebhook(body, logId) {
  const event = body?.data?.event;
  const nhanhID = body?.data?.data?.productId;

  console.log(`📦 Event: ${event} - NhanhID: ${nhanhID}`);

  if (!event || !nhanhID) {
    console.warn("⚠️ Thiếu event hoặc productId trong webhook");
    return;
  }

  if (event === "productDelete") {
    const result = await Product.updateMany(
      {},
      { $pull: { variants: { nhanhID } } }
    );
    console.log(
      `🗑️ Đã xoá variant nhanhID ${nhanhID} từ ${result.modifiedCount} sản phẩm`
    );
  } else if (event === "productAdd" || event === "productUpdate") {
    const detail = await fetchProductDetail(nhanhID);
    if (!detail) {
      console.warn(`⚠️ Không lấy được chi tiết sản phẩm ${nhanhID}`);
      return;
    }

    console.log(
      `🔍 Lấy thông tin chi tiết sản phẩm thành công: ${detail.name}`
    );

    const { baseName, capacity } = splitNameAndCapacity(detail.name);
    console.log(`🔧 Tách tên: "${baseName}", dung tích: "${capacity}"`);

    const variantData = {
      nhanhID,
      capacity,
      price: detail.price || 0,
      quantity: detail.inventory?.available || 0,
      available: detail.inventory?.available > 0,
    };

    const product = await Product.findOne({ name: baseName });

    if (product) {
      const variantIndex = product.variants.findIndex(
        (v) => v.nhanhID === nhanhID
      );

      if (variantIndex >= 0) {
        console.log(`✏️ Cập nhật variant cũ (ID: ${nhanhID})`);
        product.variants[variantIndex] = {
          ...product.variants[variantIndex].toObject(),
          ...variantData,
        };
      } else {
        console.log(`➕ Thêm mới variant vào sản phẩm "${baseName}"`);
        product.variants.push(variantData);
      }

      await product.save();
      console.log(
        `✅ Đã lưu cập nhật sản phẩm "${baseName}" (ID: ${product._id})`
      );
    } else {
      console.log(`🆕 Tạo mới sản phẩm "${baseName}" với 1 variant`);
      await Product.create({
        name: baseName,
        slug: baseName.toLowerCase().replace(/\s+/g, "-"),
        available: true,
        variants: [variantData],
      });
    }
  }

  // Xoá webhook log sau xử lý
  await WebhookLog.findByIdAndDelete(logId);
  console.log(`🧹 Đã xoá webhook log ${logId}`);
}

async function fetchProductDetail(productId) {
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
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (res.data?.data?.[productId]) {
      console.log(`✅ Fetch thành công chi tiết sản phẩm ${productId}`);
      return res.data.data[productId];
    }

    console.warn(`⚠️ Không có dữ liệu sản phẩm từ Nhanh cho ID ${productId}`);
    return null;
  } catch (err) {
    console.error(`❌ Lỗi khi fetch sản phẩm ${productId}:`, err.message);
    return null;
  }
}
