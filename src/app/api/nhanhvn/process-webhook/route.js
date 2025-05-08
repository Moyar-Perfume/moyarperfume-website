import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import WebhookLog from "@/models/WebhookLog";
import axios from "axios";

export async function GET() {
  try {
    await connectDB();
    const pendingLogs = await WebhookLog.find({ status: "pending" }).limit(10);

    for (const log of pendingLogs) {
      const productId = log.data?.productId;
      if (!productId) continue;

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

        const productDetail = res.data;

        // Update lại bản ghi
        await WebhookLog.findByIdAndUpdate(log._id, {
          status: "done",
          detail: productDetail,
        });
      } catch (error) {
        await WebhookLog.findByIdAndUpdate(log._id, {
          status: "error",
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      { message: "Xử lý xong webhook" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Lỗi xử lý webhook:", err.message);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
