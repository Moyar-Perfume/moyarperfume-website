import { NextResponse } from "next/server";

export async function POST(req) {
  let body;

  // ✅ Parse JSON an toàn
  try {
    body = await req.json();
  } catch (error) {
    console.error("❌ Lỗi parse JSON từ webhook:", error);
    return NextResponse.json({ message: "Invalid JSON" });
  }

  const { event, data } = body;

  // ✅ Kiểm tra dữ liệu cần thiết
  if (!event || !data) {
    console.warn("⚠️ Thiếu trường event hoặc data trong payload:", body);
    return NextResponse.json({ message: "Missing fields" });
  }

  // ✅ In log ra console
  console.log("📦 Webhook Event:", event);
  console.log("📊 Webhook Data:", data);

  // ✅ Trả về HTTP 200 theo yêu cầu
  return NextResponse.json({ message: "Webhook received" });
}
