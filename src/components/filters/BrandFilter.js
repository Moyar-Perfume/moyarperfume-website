"use client";

import { useFilter } from "@/contexts/FilterContext";
import useBrands from "@/hooks/useBrands";
// Không cần dùng Spin và Loading nữa
// import { Spin } from "antd";
// import Loading from "../shared/Loading";

export default function BrandFilter() {
  const { selectedBrands, toggleBrand } = useFilter();

  // Giữ lại logic fetch riêng của useBrands
  const { brands, loading: loadingBrand } = useBrands();

  // Hàm render các khung chờ (skeleton)
  const renderSkeletons = () => {
    return (
      <div className="max-h-[200px] overflow-y-auto grid gap-4 custom-scrollbar pr-2">
        {Array(6) // Hiển thị 6 dòng chờ
          .fill(0)
          .map((_, index) => (
            <li key={index} className="flex items-center gap-4 animate-pulse">
              <div className="p-[10px] bg-gray-700/80 rounded"></div>
              <div className="h-4 bg-gray-700/80 rounded w-28"></div>
            </li>
          ))}
      </div>
    );
  };

  return (
    <div className="items-center w-full flex-col flex">
      <div className="flex items-center">
        <span className="whitespace-nowrap bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Brand
        </span>
      </div>

      {/* SỬA LỖI: Hiển thị skeleton UI khi loadingBrand là true */}
      {loadingBrand ? (
        renderSkeletons()
      ) : (
        <div>
          <ul className="max-h-[200px] overflow-y-auto grid gap-4 custom-scrollbar pr-2">
            {brands
              .sort(
                (a, b) =>
                  selectedBrands.includes(b._id) -
                  selectedBrands.includes(a._id)
              )
              .map((brand) => (
                <li
                  key={brand._id}
                  className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity pr-6"
                  onClick={() => toggleBrand(brand._id)}
                >
                  <div
                    className={`p-[10px] border-[1px] rounded ${
                      selectedBrands.includes(brand._id)
                        ? "bg-white bg-opacity-20"
                        : ""
                    }`}
                  ></div>
                  <span>{brand.name}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
