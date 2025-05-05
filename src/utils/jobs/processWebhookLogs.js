import mongoose from "mongoose";
import { connectDB } from "@/libs/mongoDB.js";
import WebhookLog from "@/models/WebhookLog";

const run = async () => {
  await connectDB();

  const logs = await WebhookLog.find({ status: "pending" }).limit(10);
  console.log(`🕒 Xử lý ${logs.length} webhook...`);

  for (const log of logs) {
    try {
      const payload = log.data;

      // 👉 Xử lý logic ở đây (ví dụ: cập nhật tồn kho theo `payload`)
      // await updateProductInventory(payload);

      log.status = "done";
      await log.save();
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
