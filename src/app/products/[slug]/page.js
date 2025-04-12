"use client";

import Product from "@/components/shared/Product";
import Button from "@/components/ui/Button";
import useDetailProduct from "@/hooks/useDetailProduct";
import { Carousel, ConfigProvider } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import RelatedProducts from "@/components/shared/RelatedProducts";

export default function DetailProduct() {
  const { slug } = useParams();
  const { detailProduct, loading, error } = useDetailProduct({ slug });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const retention = {};

  // Set default selected variant when product data loads
  useEffect(() => {
    if (
      detailProduct &&
      detailProduct.variants &&
      detailProduct.variants.length > 0
    ) {
      // Lọc các variant có available=true
      const availableVariants = detailProduct.variants.filter(
        (variant) => variant.available
      );

      // Nếu có variant khả dụng, chọn variant đầu tiên
      if (availableVariants.length > 0) {
        setSelectedVariant(availableVariants[0]);
      } else {
        // Nếu không có variant nào khả dụng, giữ nguyên selectedVariant là null
        setSelectedVariant(null);
      }
    }

    if (detailProduct?.tags) {
      const retentionTag = detailProduct.tags.find((tag) =>
        tag.startsWith("doluumui_")
      );
      if (retentionTag) {
        const retentionValue = retentionTag.split("_")[1];
        retention.value = retentionValue;

        const retentionMap = {
          3: "Light",
          6: "Moderate",
          8: "Strong",
          10: "Very Strong",
        };
        retention.label = retentionMap[retentionValue] || retentionValue;
      }
    }
  }, [detailProduct]);

  // Handle quantity changes
  const handleQuantityChange = (change) => {
    if (selectedVariant) {
      const newQuantity = quantity + change;
      if (newQuantity >= 1 && newQuantity <= selectedVariant.quantity) {
        setQuantity(newQuantity);
      }
    }
  };

  // Tạo helper function để lấy hình ảnh theo type
  const getImageByType = (images, type) => {
    if (!images || !Array.isArray(images)) return null;

    const image = images.find((img) => img.type === type);
    return image ? image.url : null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );

  if (!detailProduct)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl">Không tìm thấy sản phẩm</div>
      </div>
    );

  // Safely access brand information
  const brand = detailProduct.brandID || {};

  // Handle tags safely
  const tags = detailProduct.tags || []; // Default to empty array if undefined

  // Function to translate tag keys from Vietnamese to English
  const translateTagKey = (key) => {
    const translations = {
      phathanh: "Release",
      gioitinh: "Gender",
      dotuoi: "Age",
      doluumui: "Retention",
      toahuong: "Radiance",
      phongcach: "Style",
    };
    return translations[key] || key;
  };

  // Function to get tag order
  const getTagOrder = (key) => {
    const order = {
      phathanh: 1, // Release
      gioitinh: 2, // Gender
      dotuoi: 3, // Age
      doluumui: 4, // Retention
      toahuong: 5, // Radiance
      phongcach: 6, // Style
    };
    return order[key] || 999; // Default to end if not in order
  };

  // Separate characteristics tags from other tags
  const characteristicsTags = tags.reduce((acc, tag) => {
    if (!tag) return acc;

    const [prefix, value] = tag.split("_");
    if (!value) return acc;

    // Only include the characteristics tags we want to display
    const allowedTags = [
      "phathanh",
      "gioitinh",
      "dotuoi",
      "doluumui",
      "toahuong",
      "phongcach",
    ];
    if (!allowedTags.includes(prefix)) return acc;

    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(value);

    return acc;
  }, {});

  // Sort the characteristics tags by order
  const sortedCharacteristicsTags = Object.fromEntries(
    Object.entries(characteristicsTags).sort(
      ([keyA], [keyB]) => getTagOrder(keyA) - getTagOrder(keyB)
    )
  );

  // Group all other tags
  const otherTags = tags.reduce((acc, tag) => {
    if (!tag) return acc;

    const [prefix, value] = tag.split("_");
    if (!value) return acc;

    // Exclude the characteristics tags
    const characteristicsTags = [
      "phathanh",
      "gioitinh",
      "dotuoi",
      "doluumui",
      "toahuong",
      "phongcach",
    ];
    if (characteristicsTags.includes(prefix)) return acc;

    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(value);

    return acc;
  }, {});

  // Default empty arrays for tags we'll use
  const gender = characteristicsTags.gioitinh?.[0] || "Unisex";
  const concentration = otherTags.nongdo?.[0] || "";
  const release = characteristicsTags.phathanh?.[0] || "";

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <main>
      <section className="bg-gradient-to-b from-floral to-white">
        <div className="w-full flex px-10 justify-end py-8">
          <div className="flex gap-1 font-gotu p-3 px-4 bg-white">
            <span>Home</span>/<span>{gender}</span>/<span>{brand.name}</span>
          </div>
        </div>
        <div className="w-full grid items-center justify-center text-center gap-2 mb-14">
          <h1 className="font-gotu text-6xl">{detailProduct.name}</h1>
          <p className="text-3xl flex items-center justify-center text-[#6D6D6D]">
            / {brand.name}
          </p>
        </div>

        <div className="flex w-full px-14 gap-32">
          <div className="w-1/2 flex items-center justify-center ">
            <div
              className="w-[500px] h-[500px] relative"
              style={{
                filter:
                  "drop-shadow(30px -10px 30px rgba(128, 128, 128, 0.60))",
              }}
            >
              <Image
                src={
                  getImageByType(detailProduct.images, "main") ||
                  "/product/placeholder-product-01.png"
                }
                fill
                className="object-cover"
                alt={`${detailProduct.name || "Product"} image`}
              />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className=" text-[#6D6D6D]">#Product</span>
              <div className="flex gap-4">
                <span className="p-1 px-2 border-[1px] border-black">
                  {concentration}
                </span>
                <span className="p-1 px-2 border-[1px] border-black">
                  {gender}
                </span>
                <span className="p-1 px-2 border-[1px] border-black">
                  {release}
                </span>
              </div>
            </div>

            {/* Price display */}
            <div className="mt-4 mb-2">
              {selectedVariant?.quantity <= 5 &&
                selectedVariant?.quantity > 0 && (
                  <p className="text-orange-500 text-sm mt-1">Sắp hết hàng</p>
                )}
              {selectedVariant?.quantity === 0 && (
                <p className="text-red-500 text-sm mt-1">Hết hàng</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-2xl">Volume</span>

              <div className="flex gap-4">
                {detailProduct.variants
                  .filter((variant) => variant.available) // Chỉ hiển thị variant có available=true
                  .map((variant, index) => (
                    <button
                      key={index}
                      className={`px-6 py-2 transition-all duration-500 text-sm font-medium ${
                        selectedVariant?._id === variant._id
                          ? "bg-black text-white shadow-md hover:bg-gray-800"
                          : "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50"
                      }`}
                      onClick={() => handleVariantSelect(variant)}
                    >
                      {variant.capacity}
                    </button>
                  ))}
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-[60px] h-[60px] relative">
                  <Image
                    src={
                      getImageByType(detailProduct.images, "main") ||
                      "/product/placeholder-product-01.png"
                    }
                    fill
                    className="object-cover"
                    alt={`${detailProduct.name || "Product"} image`}
                  />
                </div>
                <h2 className="text-2xl font-gotu">
                  {selectedVariant
                    ? `₫${selectedVariant.price.toLocaleString()}`
                    : "Chọn dung tích"}
                </h2>
              </div>

              {/* Add to cart button with quantity controls */}
              {selectedVariant && selectedVariant.quantity > 0 && (
                <div className="flex items-center gap-4">
                  <button className="py-4 px-10 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-gotu shadow-md hover:shadow-lg uppercase ">
                    Add to cart
                  </button>

                  <div className="flex items-center border border-black  h-full">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-4 text-gray-600 hover:bg-gray-100 border-r-0"
                      disabled={quantity <= 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                    <span className="px-4 py-2 border-x border-gray-200 border-r-0 border-l-0">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 border-l-0"
                      disabled={quantity >= selectedVariant.quantity}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="text-lg py-2">
                Contact to order directly via{" "}
                <span className="font-medium">0829.697.779</span>
                <br />
                <span className="font-medium">(9.00AM - 22.00PM)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 flex gap-20 px-14">
        <div className="w-1/2 flex-col flex gap-8 px-14">
          <div className="flex items-center w-full">
            <hr className="flex-grow border-t-[1px] border-black" />
            <span className="px-6 whitespace-nowrap text-2xl font-gotu">
              Describe
            </span>
            <hr className="flex-grow border-t-[1px] border-black" />
          </div>

          <div className="text-base leading-10 h-full">
            {detailProduct.description}
          </div>
        </div>
        <div className="w-1/2 h-[500px] sticky top-40 bg-red-300">
          <Image
            src={
              getImageByType(detailProduct.images, "description") ||
              "/product/placeholder-product-02.png"
            }
            fill
            alt={`${detailProduct.name || "Product"} image 2`}
            className="object-cover"
          />
        </div>
      </section>

      <section className="mt-24 flex gap-24 px-14">
        <div className="w-1/2 h-[900px] sticky top-12">
          <Image
            src={
              getImageByType(detailProduct.images, "feature") ||
              "/product/placeholder-product-03.png"
            }
            fill
            alt={`${detailProduct.name || "Product"} image 3`}
            className="object-cover"
          />
        </div>
        <div className="w-1/2 h-fit relative px-8">
          <div className="flex items-center w-full">
            <hr className="flex-grow border-t-[1px] border-black" />
            <span className="px-6 whitespace-nowrap text-2xl font-gotu">
              Characteristic
            </span>
            <hr className="flex-grow border-t-[1px] border-black" />
          </div>

          <div className="mt-10 flex flex-col gap-12">
            {Object.entries(sortedCharacteristicsTags).map(([key, values]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="font-medium min-w-[120px] capitalize">
                  {translateTagKey(key)}
                </span>
                <div className="flex w-full">
                  {key === "doluumui" ? (
                    <div className="w-full flex items-center gap-4">
                      <div className="flex w-full gap-6">
                        {["3", "6", "8", "10"].map((level) => {
                          return (
                            <span
                              key={level}
                              className={`w-1/4 py-2 text-center ${
                                level === values[0]
                                  ? "bg-black text-white"
                                  : "bg-[#EDEDED] text-[#C0C0C0]"
                              }`}
                            >
                              {level}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : key === "toahuong" ? (
                    <div className="w-full flex items-center gap-4">
                      <div className="flex w-full gap-6">
                        {["Gần", "Vừa", "Xa"].map((level) => {
                          return (
                            <span
                              key={level}
                              className={`w-1/3 py-2 text-center ${
                                level === values[0]
                                  ? "bg-black text-white"
                                  : "bg-[#EDEDED] text-[#C0C0C0]"
                              }`}
                            >
                              {level}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      {values.map((value, index) => (
                        <span key={index} className="px-3 py-1 text-base">
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className=" flex justify-center w-full">
              {(() => {
                // Lấy tất cả các tag muihuong_
                const fragranceTags = tags.filter((tag) =>
                  tag?.startsWith("muihuong_")
                );

                if (fragranceTags.length === 0) {
                  return (
                    <div className="text-gray-400 text-center">
                      No fragrance family information available
                    </div>
                  );
                }

                // Định nghĩa family và subfamily dựa trên tag đầu tiên và thứ hai
                let family = "";
                let subfamily = "";

                if (fragranceTags.length > 0) {
                  const familyMatch = fragranceTags[0].match(
                    /muihuong_([^(]+)\s*\(([^)]+)\)/
                  );
                  if (familyMatch && familyMatch.length >= 3) {
                    family = familyMatch[1].trim().toUpperCase(); // WOODY
                    // Không hiển thị phần trong ngoặc ở đây
                  }
                }

                if (fragranceTags.length > 1) {
                  const subfamilyMatch = fragranceTags[1].match(
                    /muihuong_([^(]+)\s*\(([^)]+)\)/
                  );
                  if (subfamilyMatch && subfamilyMatch.length >= 3) {
                    subfamily = subfamilyMatch[1].trim().toUpperCase(); // FLORAL
                    // Không hiển thị phần trong ngoặc ở đây
                  }
                }

                return (
                  <div className="grid grid-cols-2 w-full">
                    <div className="border border-gray-200 p-4 flex flex-col items-center justify-center border-r-0">
                      <div className="text-gray-400 text-sm uppercase">
                        Scents
                      </div>
                      <div className="font-medium text-center mt-1">
                        {family || "N/A"}
                      </div>
                    </div>
                    <div className="border border-gray-200 p-4 flex flex-col items-center justify-center">
                      <div className="text-gray-400 text-sm uppercase">
                        Subscents
                      </div>
                      <div className="font-medium text-center mt-1">
                        {subfamily || "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-12 flex items-center w-full">
            <hr className="flex-grow border-t-[1px] border-black" />
            <span className="px-6 whitespace-nowrap text-2xl font-gotu">
              Seasonal
            </span>
            <hr className="flex-grow border-t-[1px] border-black" />
          </div>

          {/* Thêm phần hiển thị thời gian (Ngày/Đêm) */}
          {tags.find((tag) => tag?.startsWith("thoigian_")) && (
            <div className="mt-12 flex justify-center">
              {(() => {
                const thoigianTag = tags.find((tag) =>
                  tag?.startsWith("thoigian_")
                );
                const values = thoigianTag.split("_").slice(1);
                const day = parseInt(values[0]) || 0;
                const night = parseInt(values[1]) || 0;

                return (
                  <div className="flex gap-20 items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-[100px] h-[100px]">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#EEEEEE"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={day > 0 ? "url(#dayGradient)" : "#EEEEEE"}
                            strokeWidth="3"
                            strokeDasharray={`${day}, 100`}
                            strokeLinecap="round"
                            className="rotate-[-90deg] origin-center"
                          />
                          <defs>
                            <linearGradient
                              id="dayGradient"
                              gradientUnits="userSpaceOnUse"
                              x1="0"
                              y1="2.0845"
                              x2="0"
                              y2={`${2.0845 + (31.831 * day) / 100}`}
                            >
                              <stop offset="0%" stopColor="#333333" />
                              <stop offset="100%" stopColor="#888888" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-medium">
                          <div className="font-gotu text-base">Day</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-[100px] h-[100px]">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#EEEEEE"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={
                              night > 0 ? "url(#nightGradient)" : "#EEEEEE"
                            }
                            strokeWidth="3"
                            strokeDasharray={`${night}, 100`}
                            strokeLinecap="round"
                            className="rotate-[-90deg] origin-center"
                          />
                          <defs>
                            <linearGradient
                              id="nightGradient"
                              gradientUnits="userSpaceOnUse"
                              x1="0"
                              y1="2.0845"
                              x2="0"
                              y2={`${2.0845 + (31.831 * night) / 100}`}
                            >
                              <stop offset="0%" stopColor="#333333" />
                              <stop offset="100%" stopColor="#888888" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-medium">
                          <div className="font-gotu text-base">Night</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="mt-12">
            {tags.find((tag) => tag?.startsWith("khuyendung_")) ? (
              <div className="flex flex-col gap-12">
                {(() => {
                  const khuyendungTag = tags.find((tag) =>
                    tag?.startsWith("khuyendung_")
                  );
                  const values = khuyendungTag.split("_").slice(1);
                  const seasons = ["Spring", "Summer", "Autumn", "Winter"];

                  return seasons.map((season, index) => {
                    const percentage = values[index] || "0";
                    return (
                      <div key={season} className="flex items-center gap-4">
                        <span className="font-medium min-w-[120px]">
                          {season}
                        </span>
                        <div className="w-full flex items-center gap-4">
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                background:
                                  percentage > 0
                                    ? `linear-gradient(90deg, #999999 0%, #666666 50%, #333333 100%)`
                                    : "#EEEEEE",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="text-gray-400 text-center mt-4">
                No seasonal data available
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-32 w-full">
        {/* Hiển thị hình ảnh 4 mùa */}
        <div className="my-16 w-full flex justify-center">
          <div className="flex w-full max-w-[1600px] gap-24">
            {(() => {
              // Lấy tất cả các tag mùa
              const seasonTags = tags.filter((tag) => tag?.startsWith("mua_"));
              let selectedSeasons = [];

              // Xử lý tất cả các tag mùa tìm thấy
              if (seasonTags && seasonTags.length > 0) {
                // Map từ tên mùa tiếng Việt sang tiếng Anh
                const seasonMap = {
                  "Mùa Thu": "Autumn",
                  "Mùa Hè": "Summer",
                  "Mùa Xuân": "Spring",
                  "Mùa Đông": "Winter",
                };

                // Lấy tất cả các mùa từ tags
                selectedSeasons = seasonTags
                  .map((tag) => {
                    const seasonValue = tag.split("_")[1];
                    return seasonMap[seasonValue] || "";
                  })
                  .filter((season) => season !== ""); // Loại bỏ các giá trị không hợp lệ

                console.log("Selected seasons:", selectedSeasons);
              }

              const seasons = [
                {
                  name: "Spring",
                  display: "Mùa Xuân",
                  image:
                    "https://res.cloudinary.com/moyar-perfume/image/upload/v1743611075/spring_olneqx.png",
                },
                {
                  name: "Summer",
                  display: "Mùa Hè",
                  image:
                    "https://res.cloudinary.com/moyar-perfume/image/upload/v1743611075/summer_mffdpk.png",
                },
                {
                  name: "Autumn",
                  display: "Mùa Thu",
                  image:
                    "https://res.cloudinary.com/moyar-perfume/image/upload/v1743611074/autumn_zcafom.png",
                },
                {
                  name: "Winter",
                  display: "Mùa Đông",
                  image:
                    "https://res.cloudinary.com/moyar-perfume/image/upload/v1743611074/winter_ozzabo.png",
                },
              ];

              return seasons.map((season) => {
                const isSelected = selectedSeasons.includes(season.name);

                return (
                  <div key={season.name} className="w-1/4 relative">
                    <div className="h-[600px] relative">
                      <Image
                        src={season.image}
                        alt={season.name}
                        fill
                        className={`object-cover ${
                          !isSelected ? "grayscale" : ""
                        }`}
                        priority
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center `}
                      >
                        <div
                          className={`px-6 pt-3 pb-2 text-center font-medium text-xl font-gotu ${
                            !isSelected
                              ? "bg-gradient-to-t from-gray-400 to-white bg-white"
                              : season.name === "Spring"
                              ? "bg-gradient-to-t from-rose to-white bg-white"
                              : season.name === "Summer"
                              ? "bg-gradient-to-t from-green to-white bg-white"
                              : season.name === "Autumn"
                              ? "bg-gradient-to-t from-floral to-white bg-white"
                              : season.name === "Winter"
                              ? "bg-gradient-to-t from-ocean to-white bg-white"
                              : ""
                          }`}
                        >
                          {season.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      <section className="mt-20 flex flex-col px-20">
        <div className="flex items-center w-full">
          <hr className="flex-grow border-t-[1px] border-black" />
          <span className="px-6 whitespace-nowrap text-2xl font-gotu">
            About the Brand
          </span>
          <hr className="flex-grow border-t-[1px] border-black" />
        </div>
        <div className="flex  mt-20">
          <div className="w-1/2 flex flex-col gap-6">
            <div className="flex w-full justify-between items-center">
              <div className="text-[#6D6D6D]">#Introduction</div>
              <div className="p-1 px-2 border-[1px] border-black text-sm">
                More Product from {brand.name}
              </div>
            </div>
            <div className="text-4xl font-gotu">{brand.name}</div>
            <p
              dangerouslySetInnerHTML={{ __html: brand.description }}
              className=" leading-8"
            ></p>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-[300px] h-[300px] relative">
              <Image
                src={brand.logo}
                fill
                className="object-cover"
                alt="brand-logo"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-20 flex flex-col px-20">
        <div className="flex items-center w-full">
          <hr className="flex-grow border-t-[1px] border-black" />
          <span className="px-6 whitespace-nowrap text-2xl font-gotu">
            Question?
          </span>
          <hr className="flex-grow border-t-[1px] border-black" />
        </div>

        <div className="w-full mt-10 flex gap-28">
          <div className="w-1/2 flex flex-col gap-4">
            <h1 className="font-gotu text-2xl">
              Why does perfume smell different on everyone?
            </h1>
            <span className="leading-7">
              Perfume smells different on everyone because of individual body
              chemistry, skin type, hormones, and even diet. Our natural skin
              oils and pH levels interact with fragrance ingredients, changing
              how certain notes appear. Oily skin holds scent longer, while dry
              skin may make it fade faster. Diet and lifestyle factors, like
              what we eat or hormonal changes, also impact how a fragrance
              smells on us. This unique interaction means a scent can smell
              different from person to person.
            </span>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <h1 className="font-gotu text-2xl">
              Why does perfume smell different on everyone?
            </h1>
            <span className="leading-7">
              Perfume smells different on everyone because of individual body
              chemistry, skin type, hormones, and even diet. Our natural skin
              oils and pH levels interact with fragrance ingredients, changing
              how certain notes appear. Oily skin holds scent longer, while dry
              skin may make it fade faster. Diet and lifestyle factors, like
              what we eat or hormonal changes, also impact how a fragrance
              smells on us. This unique interaction means a scent can smell
              different from person to person.
            </span>
          </div>
        </div>
      </section>
      <section className="w-full mt-20 flex flex-col px-20">
        <div className="flex justify-between w-full items-center">
          <div className="text-xl font-medium">Belive in Miracle?</div>
          <Button variant="inverse">See all Fragrances</Button>
        </div>
        <div className=" font-gotu w-full text-4xl items-center justify-center flex py-12">
          Fragrance House
        </div>
        <RelatedProducts
          brandId={brand._id}
          excludeSlug={slug}
          productId={detailProduct._id}
        />
      </section>
    </main>
  );
}
