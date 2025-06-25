import { connectDB } from "@/libs/mongoDB";
import User from "@/models/User";
import { requireAuth } from "@/middlewares/authMiddleware";

export async function GET() {
  try {
    await connectDB();
    const authUser = requireAuth();
    const user = await User.findById(authUser.userId).select("-password");

    return Response.json(user);
  } catch (err) {
    return Response.json({ message: err.message }, { status: 401 });
  }
}
