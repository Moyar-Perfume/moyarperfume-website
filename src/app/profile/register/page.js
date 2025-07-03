"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/constants/apiURL"; // Giả sử bạn có file cấu hình URL API

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    try {
      // Gọi API để đăng ký
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // Xử lý thành công, ví dụ chuyển hướng tới trang đăng nhập
      router.push("/profile/login?status=registered");
    } catch (err) {
      // Xử lý lỗi từ API
      const errorMessage =
        err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container bao bọc toàn trang với màu nền
    <div className="bg-[#f7f5f2] min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white p-8 md:p-12 shadow-sm">
        <h1 className="text-4xl text-center font-serif text-gray-800 mb-10">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
              >
                FIRST NAME
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
              >
                LAST NAME
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
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
              value={password}
              required
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Checkbox đồng ý */}
          <div className="flex items-start gap-3">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 accent-black"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to receive communications by e-mail from Moyar Perfume
              <span className="block text-xs text-gray-500 mt-1">
                Your email address will never be disclosed to other entities and
                you will be able to remove yourself from this list at any time.
              </span>
            </label>
          </div>

          {/* Hiển thị thông báo lỗi */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white uppercase tracking-wider py-3 mt-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create an account"}
          </button>
        </form>

        {/* Liên kết tới trang đăng nhập */}
        <div className="text-center mt-6 text-sm">
          <Link href="/profile/login" className="text-gray-600 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
