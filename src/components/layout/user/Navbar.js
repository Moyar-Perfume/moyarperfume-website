"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "@/components/shared/Search";
import Marquee from "react-fast-marquee";
import { useCart } from "@/contexts/CartContext";

const menuItems = [
  { name: "RECOMMENDATIONS", path: "/recommendations" },
  { name: "ALL PRODUCTS", path: "/product-list" },
  { name: "BRANDS", path: "/brands" },
  { name: "BLOG", path: "/blog" },
  { name: "CONTACT", path: "/contact" },
];

const mobileIcons = [
  { src: "/icon/search.svg", alt: "Search" },
  { src: "/icon/cart.svg", alt: "Cart" },
];

const desktopIcons = [
  { src: "/icon/search.svg", alt: "Search" },
  { src: "/icon/user.svg", alt: "User", path: "/profile" },
  { src: "/icon/cart.svg", alt: "Cart" },
];

export default function Navbar() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [scrollY, setScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Khi menu mobile mở, ngăn cuộn trang
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Xử lý click vào icon
  const handleIconClick = (alt) => {
    if (alt === "Search") setIsSearchOpen(true);
    if (alt === "Cart") setIsCartOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* Free Shipping */}
      <div
        className={`bg-black text-white transition-all duration-300 ${
          scrollY > 50 || isMobileMenuOpen ? "h-0 opacity-0" : "h-8 opacity-100"
        }`}
      >
        <Marquee
          speed={40}
          gradient={false}
          pauseOnHover={true}
          className="h-full flex items-center text-xs"
        >
          <span className="mx-4">
            FREE worldwide shipping on discovery boxes!
          </span>
          <span className="mx-4">
            FREE worldwide shipping on discovery boxes!
          </span>
          <span className="mx-4">
            Save 10% on first order with code WELCOME10
          </span>
          <span className="mx-4">New fragrances now available</span>
        </Marquee>
      </div>

      {/* Navbar */}
      <section className="w-full h-[70px] md:h-[90px] xl:h-[100px] bg-white flex items-center justify-between transition-all duration-300 shadow-md px-4 xl:px-6 relative z-[60]">
        {/* Hamburger Menu - Mobile & Tablet */}
        <div className="xl:hidden z-20">
          <button
            className="flex flex-col justify-center items-center w-8 h-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black my-1 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 xl:static xl:translate-x-0 w-[150px] md:w-[200px] xl:w-[250px] h-full flex items-center justify-center overflow-hidden z-20">
          <a
            className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] xl:w-[250px] xl:h-[250px]"
            href="/"
          >
            <Image src="/logo/logo_no_bg/logo_black.png" fill alt="Logo" />
          </a>
        </div>

        {/* Menu - Desktop */}
        <nav className="hidden xl:flex items-center gap-14">
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className="flex items-center uppercase font-gotu text-[18px] hover:text-gray-500 transition-all"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Icons */}
        <div className="flex xl:hidden items-center gap-4 z-20">
          {mobileIcons.map((icon, index) => (
            <div
              key={index}
              className="relative w-[20px] h-[20px] cursor-pointer"
              onClick={() => handleIconClick(icon.alt)}
            >
              <Image src={icon.src} fill alt={icon.alt} />
            </div>
          ))}
        </div>

        {/* Desktop Icons */}
        <div className="hidden xl:flex items-center gap-8 z-20 pr-4">
          {desktopIcons.map((icon, index) => (
            <div
              key={index}
              className="relative w-[20px] h-[20px] cursor-pointer"
              onClick={() => handleIconClick(icon.alt)}
            >
              {icon.path ? (
                <Link href={icon.path}>
                  <Image src={icon.src} fill alt={icon.alt} />
                </Link>
              ) : (
                <Image src={icon.src} fill alt={icon.alt} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden bg-white z-50 transition-all duration-500 overflow-auto fixed ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: scrollY > 50 ? "70px" : "78px",
          left: 0,
          right: 0,
          "@media (minWidth: 768px)": {
            top: scrollY > 50 ? "90px" : "98px",
          },
        }}
      >
        <div className="min-h-[calc(100vh-90px)] flex flex-col justify-between px-6 py-10">
          {/* Main menu items */}
          <div className="flex flex-col items-center mt-10">
            <div className="w-full max-w-md space-y-8">
              {menuItems.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className="block text-center uppercase font-gotu text-2xl py-3 hover:text-gray-500 transition-all border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Footer part with additional links */}
            <div className="w-full pt-10 mt-auto">
              {/* Registration & Login Links */}
              <div className="flex justify-center gap-8 pb-6">
                <Link
                  href="/user/register"
                  className="uppercase text-sm hover:text-gray-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/user/login"
                  className="uppercase text-sm hover:text-gray-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
