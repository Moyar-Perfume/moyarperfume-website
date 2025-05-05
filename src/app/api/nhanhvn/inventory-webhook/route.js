import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  // ✅ Check dữ liệu từ webhook gửi về
  if (!body?.event || !body?.data) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  // ❗ Bạn xử lý gì đó ở đây (ghi log, cập nhật DB, v.v.)
  console.log(
    "📦 Webhook nhận được:",
    { message: body.event },
    { status: 200 }
  );
  console.log(
    "📊 Data Webhook nhận được:",
    { message: body.data },
    { status: 200 }
  );

  // ✅ Trả về HTTP status code 200
  return NextResponse.json({ message: "Webhook received" });
}
