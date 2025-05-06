import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import WebhookLog from "@/models/WebhookLog";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("📥 Webhook Data:", data);
    await WebhookLog.create({ data });

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
