"use client";

import { useSession } from "next-auth/react";

export default function ProfileClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Đang tải...</p>;
  if (status === "unauthenticated") return <p>Bạn chưa đăng nhập.</p>;

  const { user } = session;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Thông tin người dùng</h2>
      <p>
        <strong>Tên:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
