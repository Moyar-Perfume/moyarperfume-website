// app/admin/login/page.jsx
"use client";

import { useState } from "react";
import { Input, Button } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result.error) {
        console.error("Lỗi đăng nhập:", result.error);
        alert(result.error);
      } else {
        console.log("Đăng nhập thành công, chuyển hướng đến trang quản lý");
        router.push("/admin/manage-product");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập chi tiết:", error);
      alert("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

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
        </div>
      </div>
    </div>
  );
}
