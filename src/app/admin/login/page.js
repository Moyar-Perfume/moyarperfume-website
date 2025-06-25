// app/admin/login/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Input, Button } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [session, status, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        router.push("/admin/manage-product");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="p-10 text-center text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-[#1D1D1D] text-white flex flex-col justify-center items-center rounded-tr-2xl rounded-br-2xl relative p-10">
        <div className="text-center"></div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-md bg-white p-10 shadow-2xl rounded-xl">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <Button
              type="primary"
              size="large"
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleLogin}
              loading={loading}
            >
              Đăng nhập
            </Button>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-3">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
