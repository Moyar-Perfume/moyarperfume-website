"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link để tạo liên kết

export default function Login() {
  const router = useRouter();
  // Thay đổi state để phù hợp với giao diện (Email thay vì Username)
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Xóa lỗi cũ khi bắt đầu đăng nhập

    // Sử dụng `email` từ state, nhưng gửi lên với key là `username`
    // để không làm ảnh hưởng tới cấu hình NextAuth của bạn.
    const res = await signIn("credentials", {
      redirect: false,
      username: identifier, // Gửi email dưới dạng username
      password,
    });

    setLoading(false);

    if (res.error) {
      setErrorMsg("Email hoặc mật khẩu không chính xác."); // Thông báo lỗi thân thiện hơn
    } else {
      // Chuyển hướng về trang profile sau khi đăng nhập thành công
      router.push("/profile");
    }
  };

  return (
    // Container bao bọc toàn trang với màu nền
    <div className="bg-[#f7f5f2] min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-sm">
        <h1 className="text-4xl text-center font-serif text-gray-800 mb-8">
          Sign in
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Trường Email */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
            >
              EMAIL / USERNAME
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Email or Username"
              value={identifier}
              required
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          {/* Trường Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              required
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Hiển thị thông báo lỗi */}
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white uppercase tracking-wider py-3 mt-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Các liên kết phụ */}
        <div className="text-center mt-6 text-sm space-x-4">
          <Link
            href="/profile/forgot-password" // Cập nhật đường dẫn nếu cần
            className="text-gray-600 hover:underline"
          >
            Forgot your password?
          </Link>
          <Link
            href="/profile/register" // Cập nhật đường dẫn tới trang đăng ký
            className="text-gray-600 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
