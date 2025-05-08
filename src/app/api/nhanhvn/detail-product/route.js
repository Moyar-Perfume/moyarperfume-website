import { NextResponse } from "next/server";
import axios from "axios";

let detailFetchCount = 0;

export async function POST(req) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Thiếu productId" }, { status: 400 });
    }

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

    const content = productDetail.content || "";

    return NextResponse.json({ content }, { status: 200 });
  } catch (err) {
    console.error("❌ Lỗi fetch chi tiết sản phẩm:", err.message);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
