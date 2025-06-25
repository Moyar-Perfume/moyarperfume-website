import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  fullName: { type: String, required: false },
  phoneNumber: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  provider: {
    type: String,
    enum: ["account", "google"],
    default: "account",
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
