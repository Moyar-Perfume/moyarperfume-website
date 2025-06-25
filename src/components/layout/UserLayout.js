import { useCart } from "@/contexts/CartContext";
import Cart from "../cart/Cart";
import Footer from "../user/Footer";
import Navbar from "../user/Navbar";
import { useEffect } from "react";

export default function UserLayout({ children }) {
  const { isCartOpen, setIsCartOpen } = useCart();

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
    <div className="min-h-screen bg-white relative">
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <Navbar />
      </div>

      <div
        className={`fixed top-0 left-0 right-0 z-[100] max-h-[80vh] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isCartOpen ? "transform translate-y-0" : "transform -translate-y-full"
        } overflow-y-auto`}
      >
        <Cart />
      </div>

      <main className="pt-[70px] md:pt-[90px] xl:pt-[133px]">{children}</main>

      <Footer />

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-[90]"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
