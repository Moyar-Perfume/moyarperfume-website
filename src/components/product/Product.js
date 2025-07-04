"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/constants/apiURL";
import { useCart } from "@/contexts/CartContext";

const Product = ({
  product,
  onClick,
  showPrice = true,
  imageSize = "h-[300px]",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(null);

  if (!product) return null;

  const { name, slug, tags, price, mainImage, variants, brandID } = product;

  // Lấy shadow từ tag (nếu có)
  const shadowTag = tags?.find((tag) => tag?.startsWith("shadow_"));
  let shadowRGB = null;
  let shadowValues = { r: 0, g: 0, b: 0 };

  if (shadowTag) {
    // Trích xuất phần sau prefix 'shadow_'
    const rgbValues = shadowTag.replace("shadow_", "").trim();
    // Nếu có giá trị RGB, sử dụng chúng
    if (rgbValues) {
      shadowRGB = rgbValues;

      // Tách giá trị RGB thành các thành phần riêng biệt
      const rgbArray = rgbValues.split(" ");
      if (rgbArray.length >= 3) {
        shadowValues = {
          r: parseInt(rgbArray[0]) || 0,
          g: parseInt(rgbArray[1]) || 0,
          b: parseInt(rgbArray[2]) || 0,
        };
      }
    }
  }

  // URL của sản phẩm
  const productUrl = `/products/${slug}`;

  // const productUrl = `${slug}`;

  // Lọc các variants có available=true
  const availableVariants =
    variants?.filter((variant) => variant.available) || [];

  if (availableVariants.length > 0 && !selectedVariants) {
    setSelectedVariants(availableVariants[0]);
  }

  // Tìm giá thấp nhất trong các volumes có available=true
  const lowestPrice =
    availableVariants.length > 0
      ? availableVariants.reduce(
          (min, vol) => (vol.price < min ? vol.price : min),
          availableVariants[0].price
        )
      : price;

  // Số lượng volume có sẵn
  const volumeCount = availableVariants.length;

  const { setCartChanged } = useCart();

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariants || !selectedVariants._id) {
      console.warn("No variant selected.");
      return;
    }

    try {
      const response = await api.post("/cart/add", {
        slug,
        variant: {
          id: selectedVariants._id,
        },
        quantity: 1,
      });

      setCartChanged((prev) => !prev);
    } catch (error) {
      console.error(
        "Lỗi khi thêm vào giỏ hàng:",
        error.response?.data || error.message
      );
    }
  };

  // Xử lý chọn volume
  const handleSelectVariants = (e, variants) => {
    e.stopPropagation();
    setSelectedVariants(variants);
  };

  const brandName = brandID?.name;

  const filteredTags = product.tags?.filter(
    (tag) =>
      tag.startsWith("notehuong_") ||
      tag.startsWith("muihuong_") ||
      tag.startsWith("nongdo_")
  );

  return (
    <div
      className={`flex flex-col items-center justify-center relative max-w-[400px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Product Image with subtle shadow */}
      <Link href={productUrl} className="w-full block relative" legacyBehavior>
        <a className="w-full flex items-center justify-center overflow-hidden">
          <div
            className={`relative w-full ${imageSize} max-w-[400px] overflow-hidden transition-all duration-300 `}
          >
            <Image
              src={mainImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className={`transition-all duration-500 p-10`}
              style={{
                objectFit: "contain",
                filter:
                  isHovered && shadowRGB
                    ? ` drop-shadow(0 0 10px rgba(${shadowValues.r}, ${shadowValues.g}, ${shadowValues.b}, 0.5))
                        drop-shadow(0 0 20px rgba(${shadowValues.r}, ${shadowValues.g}, ${shadowValues.b}, 0.3))
                        drop-shadow(0 0 30px rgba(${shadowValues.r}, ${shadowValues.g}, ${shadowValues.b}, 0.2))`
                    : "none",
              }}
            />
          </div>
        </a>
      </Link>

      <div className="text-center flex items-center gap-2 w-full mt-5">
        <hr className="flex-1 border-t border-gray-200" />
        <span className="px-3 py-1 text-sm text-gray-500 tracking-wide uppercase font-gotu">
          {brandName}
        </span>
        <hr className="flex-1 border-t border-gray-200" />
      </div>

      {/* Product Name - Always visible - MOVED ABOVE VOLUME/PRICE */}
      <Link href={productUrl} className="w-full block">
        <p className="text-center mt-1 text-xl sm:text-2xl px-2 transition-colors hover:text-gray-700 text-black">
          {name}
        </p>

        <div className="flex relative  w-full space-x-1 items-center justify-center  mt-2">
          <span className="text-xs text-grey uppercase">|</span>
          {filteredTags?.map((tag, index) => (
            <span key={index} className="text-grey uppercase text-xs">
              {tag.split("_")[1]} |
            </span>
          ))}
        </div>
      </Link>

      {/* Conditional content based on hover state - MOVED TO BOTTOM */}
      <div className="w-full relative h-[130px]">
        {/* Always visible non-hover state */}
        <div
          className={`w-full absolute flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-0 transform -translate-y-2" : "opacity-100"
          }`}
        >
          <div className="bg-gray-50 px-5 rounded-md w-full text-center">
            <div className="text-center font-medium text-gray-800 flex gap-1 items-center justify-center  mt-2 ">
              <span className="text-sm font-light">
                {volumeCount > 0 ? `${volumeCount} Sizes` : ""}
              </span>
              /
              <span className="font-semibold text-black text-base flex items-center gap-1">
                <span className="text-sm font-normal">From</span>
                <span className="text-sm font-light">
                  {lowestPrice ? " " + lowestPrice.toLocaleString() : 0} VNĐ
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Hover state content - absolutely positioned */}
        <div
          className={`w-full absolute inset-0 z-10 flex flex-col px-3 transition-all duration-300 pt-2 ${
            isHovered
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-2 pointer-events-none"
          }`}
        >
          {/* Volume options - made more compact */}
          {availableVariants.length > 0 && (
            <div className="flex items-center gap-2 mb-2 justify-center flex-wrap">
              {availableVariants.map((variant, index) => (
                <div
                  key={variant._id}
                  className="flex items-center justify-center"
                >
                  <input
                    type="radio"
                    id={`variants-${slug}-${index}`}
                    name={`variants-${slug}`}
                    className="hidden"
                    checked={
                      selectedVariants &&
                      selectedVariants.capacity === variant.capacity
                    }
                    onChange={(e) => handleSelectVariants(e, variant)}
                  />
                  <label
                    htmlFor={`variants-${slug}-${index}`}
                    className={`px-2.5 py-0.5 rounded-full text-xs cursor-pointer transition-colors ${
                      selectedVariants &&
                      selectedVariants.capacity === variant.capacity
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {variant.capacity}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Price - more compact */}
          <div className="text-center mb-2 text-black">
            <span className="text-base">
              {selectedVariants && selectedVariants.price
                ? selectedVariants.price.toLocaleString()
                : price
                ? price.toLocaleString()
                : 0}{" "}
              VNĐ
            </span>
          </div>

          {/* Add to cart button - more compact */}
          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-sm flex items-center justify-center gap-1.5"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
