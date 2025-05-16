"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../components/ui/Button";

import React from "react";
import { Carousel, ConfigProvider } from "antd";

import productData from "@/data/productData";
import blogData from "@/data/blogData";
import Product from "@/components/shared/Product";
import api from "@/constants/apiURL";

const feedbacks = [
  {
    color: "blue",
    date: "01/11/2024",
    content:
      "Cảm giác nhận hàng y như unbox quà tặng! Đóng gói đẹp, chắc chắn, có cả giấy thơm. Mùi đúng chuẩn, lưu hương lâu. Giao hàng nhanh như chớp luôn!",
  },
  {
    color: "puple",
    date: "03/11/2024",
    content:
      "Mình rất ấn tượng cách shop chăm chút từng đơn hàng. Hộp được bọc chắc chắn, không hề móp méo. Mùi y chang bản full mình từng mua ở store – đúng hàng chuẩn chính hãng luôn!",
  },
  {
    color: "pink",
    date: "05/11/2024",
    content:
      "Giao hàng cực nhanh luôn, hôm qua đặt mà nay nhận được rồi. Hộp đóng gói rất chỉn chu, nhìn là thấy shop có tâm lắm đó!",
  },
  {
    color: "green",
    date: "07/11/2024",
    content:
      "Rất ưng cách shop đóng gói, cẩn thận từng lớp luôn. Kiểu như được tặng quà vậy á. Mình chắc chắn sẽ ủng hộ tiếp!",
  },
];

const introItems = [
  {
    id: 1,
    image: "/introduction/intro_01.png",
    title: "1. Enter Your Preferences",
    description:
      "Focus on what you enjoy, the scents you love.\nWe'll handle the hard work for you.",
  },
  {
    id: 2,
    image: "/introduction/intro_02.png",
    title: "2. Your Personalized Selection",
    description:
      "Focus on what you enjoy, the scents you love. \nWe'll handle the hard work for you.",
  },
  {
    id: 3,
    image: "/introduction/intro_03.png",
    title: "3. Receive Your Sample Box",
    description:
      "Focus on what you enjoy, the scents you love. \nWe'll handle the hard work for you.",
  },
];

const bestsellerProduct = [
  {
    id: 1,
    name: "Narciso Rodriguez Pure Musc",
    slug: "https://shopee.vn/10ml-Pure-Musc-Nar-tr%E1%BA%AFng-N%C6%B0%E1%BB%9Bc-hoa-n%E1%BB%AF-i.422771282.16657082469?sp_atk=44c9cd02-9c85-4e56-9431-baf0469819c4&xptdk=44c9cd02-9c85-4e56-9431-baf0469819c4",
    tags: ["shadow_207 209 213"],
    price: 0,
    images: [{ url: "/product/product-01.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Narciso Rodriguez" },
  },
  {
    id: 2,
    name: "Signature EDP",
    slug: "https://shopee.vn/10ml-Montblanc-Signature-N%C6%B0%E1%BB%9Bc-hoa-n%E1%BB%AF-Moyar-Perfume-i.422771282.15588612866",
    tags: ["shadow_222 222 222"],
    price: 0,
    images: [{ url: "/product/product-02.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "montblanc" },
  },
  {
    id: 3,
    name: "White Tea",
    slug: "https://shopee.vn/10ml-Elizabeth-Arden-White-Tea-EDT-N%C6%B0%E1%BB%9Bc-hoa-n%E1%BB%AF-i.422771282.22152721778",
    tags: ["shadow_246 244 242"],
    price: 0,
    images: [{ url: "/product/product-03.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Elizabeth Arden" },
  },
  {
    id: 4,
    name: "Bright Crystal",
    slug: "https://shopee.vn/10ml-%E2%80%A2-Bright-Crystal-Versace-N%C6%B0%E1%BB%9Bc-hoa-n%E1%BB%AF-i.422771282.9879316410",
    tags: ["shadow_228 166 192"],
    price: 0,
    images: [{ url: "/product/product-04.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Versace" },
  },
  {
    id: 5,
    name: "Narciso Rodriguez For Her EDP",
    slug: "https://shopee.vn/10ml-Nar-Rodriguez-for-Her-EDP-(-h%E1%BB%93ng-nh%E1%BA%A1t-)-N%C6%B0%E1%BB%9Bc-hoa-n%E1%BB%AF-i.422771282.13114211594",
    tags: ["shadow_246 202 196"],
    price: 0,
    images: [{ url: "/product/product-05.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Narciso Rodriguez" },
  },
];

const newestProduct = [
  {
    id: 1,
    name: "Kira Matcha Latte",
    slug: "https://shopee.vn/10ml-Kira-Matcha-Latte-N%C6%B0%E1%BB%9Bc-hoa-unisex-Moyar-Perfume-i.422771282.26283877129",
    tags: ["shadow_185 177 83"],
    price: 0,
    images: [{ url: "/product/product-06.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Kira" },
  },
  {
    id: 2,
    name: "Kira Rice Milk",
    slug: "https://shopee.vn/10ml-Kira-Rice-Milk-N%C6%B0%E1%BB%9Bc-hoa-unisex-Moyar-Perfume-i.422771282.29233872269",
    tags: ["shadow_212 186 152"],
    price: 0,
    images: [{ url: "/product/product-07.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Kira" },
  },
  {
    id: 3,
    name: "Kira Coffeeling",
    slug: "https://shopee.vn/10ml-Kira-Coffeelling-N%C6%B0%E1%BB%9Bc-hoa-unisex-Moyar-Perfume-i.422771282.27083872275",
    tags: ["shadow_166 123 107"],
    price: 0,
    images: [{ url: "/product/product-08.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Kira" },
  },
  {
    id: 4,
    name: "Spectre Wraith",
    slug: "https://shopee.vn/10ml-Fragrance-World-Spectre-Wraith-N%C6%B0%E1%BB%9Bc-hoa-nam-Moyar-Perfume-i.422771282.28833809256",
    tags: ["shadow_39 39 39"],
    price: 0,
    images: [{ url: "/product/product-09.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Fragrance World" },
  },
  {
    id: 5,
    name: "Spectre Ghost",
    slug: "https://shopee.vn/10ml-Fragrance-World-Spectre-Ghost-N%C6%B0%E1%BB%9Bc-hoa-nam-Moyar-Perfume-i.422771282.24544190006",
    tags: ["shadow_147 132 126"],
    price: 0,
    images: [{ url: "/product/product-10.png" }],
    variants: [
      { capacity: "10ml", price: 0, available: true },
      { capacity: "Fullseal", price: 0, available: true },
    ],
    brandID: { name: "Fragrance World" },
  },
];

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const images = Array(10).fill("/logo/logo_no_bg/logo_black_perfume.png");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setMousePosition({
      x: (clientX - centerX) / 20,
      y: (clientY - centerY) / 20,
    });
  };

  // const [newestProduct, setNewestProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchNewestProduct = async () => {
  //     try {
  //       setIsLoading(true);
  //       const res = await api.get("/product-list?latest=true");

  //       const data = res.data.products;

  //       if (data) {
  //         setNewestProduct(data); // Set sản phẩm mới nhất
  //       } else {
  //         console.log("Không có sản phẩm nào được trả về.");
  //       }
  //     } catch (err) {
  //       console.error("Lỗi khi lấy sản phẩm:", err);
  //       setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchNewestProduct();
  // }, []);

  const [blogPost, setBlogPost] = useState(blogData);

  return (
    <main
      className="w-full flex flex-col items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Banner */}
      <section className="w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-90px)] xl:min-h-[calc(100vh-132px)] max-h-screen bg-black flex relative overflow-hidden">
        {/* Overlay đen mờ cho toàn bộ banner */}
        <div className="absolute inset-0 bg-black opacity-80 z-10"></div>

        {/* Text content - Đặt ở giữa banner */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center w-full max-w-[600px] px-4">
          <span className="text-base sm:text-lg lg:text-xl text-white">
            Believe In Miracle
          </span>
          <div className="mt-3 sm:mt-4">
            <span className="font-gotu text-sm sm:text-base lg:text-lg px-2 block text-white">
              Each Moyar Perfume scent is crafted to inspire hope,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              reveal beauty, and spark extraordinary moments in the everyday.
            </span>
          </div>
          <div className="mt-5 sm:mt-7 lg:mt-9">
            <a href="https://shopee.vn/moyarperfume">
              <Button className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2.5 sm:py-3">
                Find Your Scent
              </Button>
            </a>
          </div>
        </div>

        {/* Background images */}
        <div className="grid grid-cols-3 w-full relative">
          {/* Trái */}
          <div className="col-span-1 flex flex-col gap-20 items-end justify-center">
            <div
              className="relative transition-all duration-200
              w-[100px] h-[200px]
              sm:w-[170px] sm:h-[100px] 
              md:w-[170px] md:h-[100px] 
              lg:w-[220px] lg:h-[120px] 
              xl:w-[250px] xl:h-[150px] 
              2xl:w-[300px] 2xl:h-[200px]"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              }}
            >
              <Image
                src="/banner/banner-left-01.jpg"
                alt="Banner 1"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw "
                className="object-cover"
              />
            </div>
            <div
              className="relative mr-14 transition-all duration-200
              w-[200px] h-[250px]
              md:w-[340px] md:h-[200px]
              lg:w-[440px] lg:h-[240px]
              xl:w-[500px] xl:h-[300px]"
              style={{
                transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) `,
              }}
            >
              <Image
                src="/banner/banner-left-02.jpg"
                alt="Banner 2"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Giữa */}
          <div className="h-full flex flex-col col-span-1 items-center pt-6 gap-24 justify-center">
            <div
              className="relative transition-all duration-200
             w-[0px] h-[0px]
              sm:w-[100px] sm:h-[250px]
              md:w-[100px] md:h-[240px]
              lg:w-[150px] lg:h-[300px]
              xl:w-[200px] xl:h-[350px]"
              style={{
                transform: `translateY(${mousePosition.y}px)`,
              }}
            >
              <Image
                src="/banner/banner-center-01.jpg"
                alt="Banner 3"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                className="object-cover"
              />
            </div>
            <div
              className="w-[0px] h-[0px]
              xl:w-[400px] xl:h-[200px]
              relative transition-all duration-200"
              style={{
                transform: `translateY(${-mousePosition.y}px)`,
              }}
            >
              <Image
                src="/banner/banner-center-02.jpg"
                alt="Banner 4"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Phải */}
          <div className="col-span-1 flex flex-col gap-20 items-start justify-center">
            <div
              className="relative transition-all duration-200
              w-[100px] h-[200px]
              sm:w-[170px] sm:h-[100px] 
              md:w-[170px] md:h-[100px] 
              lg:w-[220px] lg:h-[120px] 
              xl:w-[250px] xl:h-[150px] 
              2xl:w-[300px] 2xl:h-[200px]"
              style={{
                transform: `translate(${
                  mousePosition.x
                }px, ${-mousePosition.y}px)`,
              }}
            >
              <Image
                src="/banner/banner-right-01.jpg"
                alt="Banner 5"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                className="object-cover "
              />
            </div>
            <div
              className="relative mr-14 transition-all duration-200
              w-[200px] h-[250px]
              md:w-[340px] md:h-[200px]
              lg:w-[440px] lg:h-[240px]
              xl:w-[500px] xl:h-[300px]"
              style={{
                transform: `translate(${-mousePosition.x}px, ${
                  mousePosition.y
                }px)`,
              }}
            >
              <Image
                src="/banner/banner-right-02.jpg"
                alt="Banner 6"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="w-full flex flex-col lg:flex-row max-w-[1400px] py-12 md:py-[100px] px-4 md:px-6 lg:px-8 gap-8 lg:gap-28">
        {/* About Moyar */}
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center gap-5 w-full ">
            <div className="absolute w-[280px] sm:w-[400px] md:w-[500px] lg:w-[550px] h-[100px] sm:h-[120px] md:h-[150px]">
              <Image
                src="/about/bg-01.png"
                fill
                sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 550px"
                alt="about-bg"
                className="object-contain"
              />
            </div>
            <h1 className="font-gotu text-2xl sm:text-3xl md:text-4xl pt-8 z-10 text-center">
              About Moyar
            </h1>
            <p className="text-center z-10 text-base sm:text-lg">
              Welcome to Moyar, your destination for captivating scents.
              Discover a refined collection of perfumes carefully curated to
              reflect your unique style and personality. Let us guide you on a
              personalized olfactory journey, where each fragrance becomes a
              distinctive signature. Immerse yourself in the world of Moyar and
              awaken your senses.
            </p>
            <Button variant="inverse" className="mt-2 sm:mt-4">
              More About Us
            </Button>
          </div>
        </div>

        {/* About Banner */}
        <div className="lg:flex items-center justify-center w-full mt-8 md:mt-0 hidden">
          <div className="w-full h-[400px] sm:h-[500px] md:h-[550px] max-w-[500px] relative">
            <Image
              src="/about/about-01.png"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 500px, (max-width: 1024px) 500px"
              alt="about-banner"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-20 max-w-[1500px] py-12 md:py-[100px] px-4 sm:px-6 lg:px-8">
        {introItems.map((item) => (
          <div
            key={item.id}
            className="col-span-1 text-center flex flex-col items-center w-full"
          >
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[450px]">
              <Image
                src={item.image}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                alt={`intro_${item.id}`}
                className="object-cover"
                priority={item.id === 1}
              />
            </div>
            {item.title && (
              <h2 className="text-xl md:text-2xl lg:text-xl font-medium pt-6 w-full">
                {item.title}
              </h2>
            )}
            {item.description && (
              <p className="pt-3 py-6 text-sm lg:text-base px-2 md:px-4 w-full">
                {item.description.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < item.description.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* New Launch */}
      <section className="w-full py-12 md:py-[100px] relative">
        {/* Background */}
        <div className="absolute w-full h-[300px] md:h-[500px] opacity-50">
          <Image
            src="/about/bg-01.png"
            fill
            className="object-cover"
            sizes="100vw"
            alt="new_bg"
            priority
          />
        </div>

        {/* Header - Chỉ hiển thị ở desktop */}
        <div className="hidden lg:flex w-full flex-row justify-between px-10 relative z-10">
          <span className="text-lg">Believe in Miracle?</span>
          <Button variant="inverse">See all Fragrances</Button>
        </div>

        {/* Title */}
        <div className="font-gotu w-full text-2xl md:text-3xl lg:text-4xl text-center py-4 md:py-6 md:pb-8 relative z-10">
          New Launch
        </div>

        {/* Products Display - Grid for mobile, Carousel for larger screens */}
        <div className="relative z-10">
          {/* Mobile Grid View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-6">
              {newestProduct.slice(0, 5).map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  imageSize="h-[250px] sm:h-[300px]"
                />
              ))}
            </div>

            {/* See All Button */}
            <div className="flex justify-center mt-8 sm:mt-10 w-full px-10 h-[60px]">
              <Button className="w-full uppercase font-thin">
                See all fragrance
              </Button>
            </div>
          </div>

          {/* Desktop Carousel View */}
          <div className="hidden lg:block px-4 xl:px-8">
            <ConfigProvider
              theme={{
                components: {
                  Carousel: {
                    arrowSize: 24,
                    arrowOffset: 25,
                  },
                },
              }}
            >
              <Carousel
                slidesToShow={5}
                dots={false}
                arrows
                autoplay
                autoplaySpeed={3000}
                responsive={[
                  {
                    breakpoint: 1536,
                    settings: {
                      slidesToShow: 4,
                    },
                  },
                  {
                    breakpoint: 1280,
                    settings: {
                      slidesToShow: 3,
                    },
                  },
                ]}
              >
                {newestProduct.map((product) => (
                  <div key={product.id} className="p-4 px-6 xl:px-8">
                    <Product
                      product={product}
                      imageSize="h-[250px] xl:h-[300px]"
                    />
                  </div>
                ))}
              </Carousel>
            </ConfigProvider>
          </div>
        </div>
      </section>

      {/* Category */}
      <section className="w-full bg-black py-12 md:py-[100px]">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-10 mb-8 md:mb-12">
          <span className="text-base md:text-lg text-white mb-4 sm:mb-0">
            Believe in Miracle?
          </span>
          <Button className="font-normal">See all Fragrances</Button>
        </div>

        {/* Categories Grid/Flex Container */}
        <div className="flex flex-col xl:flex-row px-4 sm:px-6 lg:px-20 gap-12 xl:gap-28 2xl:gap-32">
          {/* Men */}
          <div
            className="w-full flex flex-col items-center justify-center text-white gap-6 md:gap-8 lg:gap-10"
            onMouseEnter={() => setHoveredCategory("men")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-full max-w-[600px] xl:max-w-full h-[250px] sm:h-[300px] md:h-[350px] relative overflow-hidden">
              <Image
                src="/category/men.jpg"
                alt="Men's perfume"
                fill
                sizes="(max-width: 1280px) 90vw, 33vw"
                className={`object-cover transition-transform duration-500 ${
                  hoveredCategory === "men" ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            <h2 className="w-full max-w-[600px] xl:max-w-full flex items-center justify-between">
              <span className="relative font-gotu text-xl sm:text-2xl pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[6px] after:w-full after:transition-all after:duration-300 after:bg-gradient-to-r after:from-ocean after:to-black">
                Men Parfum
              </span>
              <span
                className={`transition-transform duration-300 ${
                  hoveredCategory === "men" ? "translate-x-2" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="size-5 sm:size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </h2>

            <p
              className={`w-full max-w-[600px] xl:max-w-full text-base sm:text-lg  xl:text-left transition-opacity duration-300 ${
                hoveredCategory === "men" ? "opacity-100" : "opacity-80"
              }`}
            >
              An introduction to the layers of fragrance notes, accords, and
              families that make up the symphony of each scent.
            </p>
          </div>

          {/* Women */}
          <div
            className="w-full flex flex-col items-center justify-center text-white gap-6 md:gap-8 lg:gap-10"
            onMouseEnter={() => setHoveredCategory("women")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-full max-w-[600px] xl:max-w-full h-[250px] sm:h-[300px] md:h-[350px] relative overflow-hidden">
              <Image
                src="/category/women.png"
                alt="Women Parfum"
                fill
                sizes="(max-width: 1280px) 90vw, 33vw"
                className={`object-cover transition-transform duration-500 ${
                  hoveredCategory === "women" ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            <h2 className="w-full max-w-[600px] xl:max-w-full flex items-center justify-between">
              <span className="relative font-gotu text-xl sm:text-2xl pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[6px] after:w-full after:transition-all after:duration-300 after:bg-gradient-to-r after:from-rose after:to-black">
                Women Parfum
              </span>
              <span
                className={`transition-transform duration-300 ${
                  hoveredCategory === "women" ? "translate-x-2" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="size-5 sm:size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </h2>

            <p
              className={`w-full max-w-[600px] xl:max-w-full text-base sm:text-lg text-center xl:text-left transition-opacity duration-300 ${
                hoveredCategory === "women" ? "opacity-100" : "opacity-80"
              }`}
            >
              Niche perfumery is the rebellious child of the fragrance world,
              growing in popularity each year. But what sets it apart from
              mainstream brands found in most perfume shops?
            </p>
          </div>

          {/* Unisex */}
          <div
            className="w-full flex flex-col items-center justify-center text-white gap-6 md:gap-8 lg:gap-10"
            onMouseEnter={() => setHoveredCategory("unisex")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-full max-w-[600px] xl:max-w-full h-[250px] sm:h-[300px] md:h-[350px] relative overflow-hidden">
              <Image
                src="/category/unisex.png"
                alt="Unisex Parfum"
                fill
                sizes="(max-width: 1280px) 90vw, 33vw"
                className={`object-cover transition-transform duration-500 ${
                  hoveredCategory === "unisex" ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            <h2 className="w-full max-w-[600px] xl:max-w-full flex items-center justify-between">
              <span className="relative font-gotu text-xl sm:text-2xl pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[6px] after:w-full after:transition-all after:duration-300 after:bg-gradient-to-r after:from-sweet after:to-black">
                Unisex Parfum
              </span>
              <span
                className={`transition-transform duration-300 ${
                  hoveredCategory === "unisex" ? "translate-x-2" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="size-5 sm:size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </h2>

            <p
              className={`w-full max-w-[600px] xl:max-w-full text-base sm:text-lg text-center xl:text-left transition-opacity duration-300 ${
                hoveredCategory === "unisex" ? "opacity-100" : "opacity-80"
              }`}
            >
              An introduction to the layers of fragrance notes, accords, and
              families that make up the symphony of each scent.
            </p>
          </div>
        </div>
      </section>

      {/* Best Seller */}
      <section className="w-full py-12 relative">
        {/* Background */}
        <div className="absolute w-full h-[300px] md:h-[500px] opacity-50">
          <Image
            src="/about/bg-01.png"
            fill
            className="object-cover"
            sizes="100vw"
            alt="best_seller"
            priority
          />
        </div>

        {/* Title */}
        <div className="font-gotu w-full text-2xl md:text-3xl lg:text-4xl text-center py-4 md:py-6 md:pb-8 relative z-10">
          Our Bestseller
        </div>

        {/* Products Display - Grid for mobile, Carousel for larger screens */}
        <div className="relative z-10">
          {/* Mobile Grid View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-6">
              {bestsellerProduct.slice(0, 5).map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  imageSize="h-[250px] sm:h-[300px]"
                />
              ))}
            </div>

            {/* See All Button */}
            <div className="flex justify-center mt-8 sm:mt-10 w-full px-10 h-[60px]">
              <Button className="w-full uppercase font-thin">
                See all fragrance
              </Button>
            </div>
          </div>

          {/* Desktop Carousel View */}
          <div className="hidden lg:block px-4 xl:px-8">
            <ConfigProvider
              theme={{
                components: {
                  Carousel: {
                    arrowSize: 24,
                    arrowOffset: 25,
                  },
                },
              }}
            >
              <Carousel
                slidesToShow={5}
                dots={false}
                arrows
                autoplay
                autoplaySpeed={3000}
                responsive={[
                  {
                    breakpoint: 1536,
                    settings: {
                      slidesToShow: 4,
                    },
                  },
                  {
                    breakpoint: 1280,
                    settings: {
                      slidesToShow: 3,
                    },
                  },
                ]}
              >
                {bestsellerProduct.map((product) => (
                  <div key={product.id} className="p-4 px-6 xl:px-8">
                    <Product
                      product={product}
                      imageSize="h-[250px] xl:h-[300px]"
                    />
                  </div>
                ))}
              </Carousel>
            </ConfigProvider>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="w-full py-12 md:py-[100px]">
        {/* Header */}
        <div className="w-full flex items-end gap-3 sm:gap-5 px-4 md:px-14">
          <hr className="flex-1 border-t-2 border-gray-400" />
          <span className="text-2xl sm:text-3xl md:text-4xl whitespace-nowrap font-gotu">
            Moyar's Blog
          </span>
        </div>

        {/* Blog Content */}
        <div className="w-full pt-10 md:pt-20">
          {/* Mobile/Tablet Grid View */}
          <div className="lg:hidden px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8">
              {blogPost.slice(0, 3).map((blog, index) => (
                <div key={index} className="flex flex-col">
                  {/* Top Image */}
                  <div className="relative w-full h-[140px] sm:h-[160px] border-8 sm:border-[12px] border-white">
                    <Image
                      src={blog.images[0]}
                      fill
                      alt={blog.title}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Main Images */}
                  <div className="flex justify-between items-center w-full pt-4 gap-3">
                    <div className="relative w-[55%] h-[180px] sm:h-[220px]">
                      <Image
                        src={blog.images[1]}
                        fill
                        alt={blog.title}
                        sizes="55vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-[40%] h-[180px] sm:h-[220px]">
                      <Image
                        src={blog.images[2]}
                        fill
                        alt={blog.title}
                        sizes="40vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 sm:pt-6 w-full flex flex-col items-center gap-4">
                    <div className="text-lg sm:text-xl text-center line-clamp-2 font-gotu px-2">
                      {blog.title}
                    </div>
                    <Button variant="onDark">Xem Ngay</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Carousel View */}
          <div className="hidden lg:block">
            <ConfigProvider
              theme={{
                components: {
                  Carousel: {
                    arrowSize: 24,
                    arrowOffset: 25,
                  },
                },
              }}
            >
              <Carousel
                slidesToShow={3}
                dots={false}
                arrows
                autoplay
                autoplaySpeed={3000}
                responsive={[
                  {
                    breakpoint: 1536,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                ]}
              >
                {blogPost.map((blog, index) => (
                  <div
                    className="px-12 xl:px-28 flex relative w-full"
                    key={index}
                  >
                    {/* Container cho ảnh absolute */}
                    <div className="relative w-full">
                      <div className="absolute top-0 right-0 w-[40vw] max-w-[70%] h-[160px] border-[16px] border-white z-10">
                        <Image
                          src={blog.images[0]}
                          fill
                          alt={blog.title}
                          sizes="(max-width: 1536px) 40vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Các ảnh chính bên dưới */}
                    <div className="flex justify-between items-center w-full pt-20 gap-4">
                      <div className="relative w-[55%] h-[250px]">
                        <Image
                          src={blog.images[1]}
                          fill
                          alt={blog.title}
                          sizes="(max-width: 1536px) 25vw, 20vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative w-[40%] h-[250px]">
                        <Image
                          src={blog.images[2]}
                          fill
                          alt={blog.title}
                          sizes="(max-width: 1536px) 20vw, 15vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-6 w-full items-center justify-center flex flex-col gap-4 h-[200px]">
                      <div className="text-xl text-center line-clamp-2 font-gotu w-[80%]">
                        {blog.title}
                      </div>
                      <Button variant="inverse">Xem Ngay</Button>
                    </div>
                  </div>
                ))}
              </Carousel>
            </ConfigProvider>
          </div>
        </div>
      </section>

      {/* Feature Brand */}
      <section className="w-full py-12 md:py-[100px] flex flex-col gap-8 md:gap-16">
        {/* Title */}
        <div className="w-full flex justify-center items-center gap-5 px-4 sm:px-8 md:px-14">
          <span className="text-2xl sm:text-3xl md:text-4xl whitespace-nowrap font-gotu">
            Featured Brands
          </span>
        </div>

        {/* Carousel */}
        <div className="px-4 sm:px-6 md:px-8">
          <ConfigProvider
            theme={{
              components: {
                Carousel: {
                  arrowSize: 24,
                  arrowOffset: 25,
                },
              },
            }}
          >
            <Carousel
              slidesToShow={5}
              dots={false}
              arrows
              autoplay
              autoplaySpeed={3000}
              responsive={[
                {
                  breakpoint: 1536,
                  settings: {
                    slidesToShow: 4,
                    arrows: true,
                  },
                },
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 3,
                    arrows: true,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    arrows: true,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    arrows: true,
                  },
                },
              ]}
            >
              {images.map((src, index) => (
                <div key={index} className="px-2 sm:px-4">
                  <div className="relative w-full aspect-square max-w-[180px] mx-auto">
                    <Image
                      src={src}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
                      className="object-contain"
                      alt={`Logo ${index}`}
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </ConfigProvider>
        </div>

        {/* Description */}
        <div className="w-full flex items-center justify-center px-4 sm:px-6 md:px-8">
          <p className="max-w-[850px] text-center font-gotu text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">
            Explore Moyar Perfume's selection of top fragrance brands, each
            known for their craftsmanship and unique scent profiles. Discover a
            world of captivating aromas designed to leave a lasting impression,
            carefully curated to match your personal style and preferences.
          </p>
        </div>
      </section>

      {/* Feedback */}
      <section className="px-4 sm:px-6 md:px-10 py-12 sm:py-20 md:py-[150px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 w-full bg-gradient-to-t from-floral to-[#fff]">
        {/* Title */}
        <div className="w-full text-2xl sm:text-3xl md:text-4xl font-gotu text-center">
          Please share your feedback with us!
        </div>

        {/* Counter */}
        <div className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 bg-black text-white text-xl sm:text-2xl font-gotu">
          200,000+
        </div>

        {/* Subtitle */}
        <div className="text-xl sm:text-2xl md:text-3xl font-gotu">
          Join the Community
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-auto md:grid-rows-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
          {feedbacks.map((item, cardIndex) => (
            <div
              key={cardIndex}
              className="w-full bg-white flex flex-col gap-6 sm:gap-8 md:gap-10 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Header */}
              <div className="gap-2 flex justify-between items-center">
                {/* Stars */}
                <div className="flex gap-1 sm:gap-2">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px] relative"
                    >
                      <Image
                        src={`/element/flower_${item.color}.svg`}
                        fill
                        sizes="(max-width: 640px) 20px, (max-width: 768px) 25px, 30px"
                        alt={`flower_${item.color} ${index}`}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Date */}
                <div className="text-sm sm:text-base text-gray-600">
                  {item.date}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
