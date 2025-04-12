"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfileClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Đang tải...</p>;

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Thông tin người dùng</h2>
        <p className="mb-4">Bạn chưa đăng nhập.</p>
        <div className="flex space-x-4">
          <Link href="/profile/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Đăng nhập
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Đăng ký
          </Link>
        </div>
      </div>
    );
  }

  const { user } = session;

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Thông tin người dùng</h2>
      <p className="mb-2">
        <strong>Tên:</strong> {user.name}
      </p>
      <p className="mb-4">
        <strong>Email:</strong> {user.email}
      </p>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}
