import { connectDB } from "@/libs/mongoDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Username đã tồn tại" }), {
      status: 400,
    });
  }

  const hashed = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    username: body.username,
    password: hashed,
    role: body.role,
    fullName: body.fullName,
    phoneNumber: body.phoneNumber,
    address: body.address,
  });

  return Response.json({ message: "Tạo tài khoản thành công" });
}
