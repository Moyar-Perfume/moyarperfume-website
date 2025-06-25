"use client";

import { useSession } from "next-auth/react";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";

export default function RootClient({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (!isAdminPage || isAdminLoginPage) return;

    if (status === "authenticated" && !isAdmin) {
      router.replace("/admin/login");
    }

    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [isAdminPage, isAdminLoginPage, status, isAdmin, router]);

  if (isAdminPage && !isAdminLoginPage && status === "loading") {
    return (
      <div className="p-10 text-center text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return (
    <AntdRegistry>
      {isAdminPage ? (
        isAdminLoginPage ? (
          children
        ) : isAdmin ? (
          <AdminLayout>{children}</AdminLayout>
        ) : null
      ) : (
        <UserLayout>{children}</UserLayout>
      )}
    </AntdRegistry>
  );
}
