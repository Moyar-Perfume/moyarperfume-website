"use client";

import { useSession } from "next-auth/react"; // thêm dòng này
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";
import Cart from "@/components/shared/Cart";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";

import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";

export default function RootClient({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const { isCartOpen, setIsCartOpen } = useCart();

  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user";

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <AntdRegistry>
      {isAdminPage ? (
        isAdminLoginPage ? (
          children
        ) : isAdmin ? ( // chỉ admin mới truy cập được admin layout
          <div>
            <AdminSidebar />
            <div className="overflow-hidden">
              <AdminHeader />
              <div className="pt-[60px] pl-[200px]">{children}</div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-red-500 font-semibold">
            Không có quyền truy cập
          </div>
        )
      ) : (
        <div className="min-h-screen bg-white relative">
          <div className="fixed top-0 left-0 right-0 z-50 w-full">
            <Navbar />
          </div>

          <div
            className={`fixed top-0 left-0 right-0 z-[100] max-h-[80vh] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
              isCartOpen
                ? "transform translate-y-0"
                : "transform -translate-y-full"
            } overflow-y-auto`}
          >
            <Cart />
          </div>

          <main className="pt-[70px] md:pt-[90px] xl:pt-[133px]">
            {children}
          </main>

          <Footer />

          {isCartOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-[90]"
              onClick={() => setIsCartOpen(false)}
            />
          )}
        </div>
      )}
    </AntdRegistry>
  );
}
