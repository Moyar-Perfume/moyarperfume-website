import mongoose from "mongoose";

const WebhookLogSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true }, // Toàn bộ payload webhook
    status: {
      type: String,
      enum: ["pending", "done", "error"],
      default: "pending",
    },
    error: { type: String, default: "" }, // Nếu xử lý lỗi thì lưu lỗi
  },
  { timestamps: true }
);

export default mongoose.models.WebhookLog ||
  mongoose.model("WebhookLog", WebhookLogSchema);
