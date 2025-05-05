import mongoose from "mongoose";

const SyncLogSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true }, // "product"
    lastSyncedAt: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SyncLog ||
  mongoose.model("SyncLog", SyncLogSchema);
