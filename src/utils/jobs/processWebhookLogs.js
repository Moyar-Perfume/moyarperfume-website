import mongoose from "mongoose";
import { connectDB } from "@/libs/mongoDB.js";
import WebhookLog from "@/models/WebhookLog";

const run = async () => {
  await connectDB();

  const logs = await WebhookLog.find({ status: "pending" }).limit(10);
  console.log(`🕒 Xử lý ${logs.length} webhook...`);

  for (const log of logs) {
    console.log("🔍 Đang xử lý log ID:", log._id);

    try {
      const payload = log.data;

      console.log("📦 Payload:", payload);

      // Nếu chưa có hàm thật, giả lập chờ
      // await updateProductInventory(payload);
      await new Promise((res) => setTimeout(res, 500)); // mô phỏng xử lý

      log.status = "done";
      await log.save();
      console.log("✅ Đã xử lý xong log:", log._id);
    } catch (err) {
      log.status = "error";
      log.error = err.message;
      await log.save();
      console.error("❌ Lỗi xử lý webhook:", err.message);
    }
  }

  console.log("✅ Đã xử lý xong.");
  process.exit();
};

run();
