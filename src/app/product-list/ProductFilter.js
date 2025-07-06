"use client";

import { useState } from "react";
import SeasonFilter from "@/components/filters/SeasonFilter";
import ConcentFilter from "@/components/filters/ConcentFilter";
import BrandFilter from "@/components/filters/BrandFilter";
import BudgetFilter from "@/components/filters/BudgetFilter";
import ScentsFilter from "@/components/filters/ScentsFilter";
import SubScentsFilter from "@/components/filters/SubScentsFilter";

export default function ProductFilter() {
  // Thêm state để quản lý việc ẩn/hiện bộ lọc trên mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="flex flex-col items-center w-full bg-black text-white pb-20 px-4 sm:px-6 lg:px-8">
      <h1 className="font-gotu text-4xl py-12 text-center">
        Our Recommendations
      </h1>

      {/* Nút bấm để ẩn/hiện bộ lọc, chỉ hiển thị trên mobile */}
      <div className="w-full max-w-7xl md:hidden mb-8 text-center">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="border border-gray-600 px-8 py-2 uppercase tracking-wider text-sm flex items-center justify-center mx-auto gap-2 hover:bg-gray-900 transition-colors"
        >
          <span>Filters</span>
          {/* Icon mũi tên để chỉ trạng thái đóng/mở */}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isFilterOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Container cho toàn bộ bộ lọc, có thể thu gọn trên mobile */}
      {/* SỬA LỖI: Chuyển max-w-7xl ra container này để nó được căn giữa bởi section cha */}
      <div
        className={`${
          isFilterOpen ? "block" : "hidden"
        } md:block w-full max-w-[1400px] transition-all duration-500`}
      >
        {/* Top Filter Section */}
        <div className="w-full relative">
          <hr className="absolute top-[12px] border-gray-700 w-full" />
          {/* - Mobile (default): grid-cols-1, mỗi bộ lọc một hàng.
            - Tablet (md): grid-cols-3. BudgetFilter chiếm 3 cột, các bộ lọc khác ở hàng dưới.
            - Desktop (lg): grid-cols-4. Mỗi bộ lọc chiếm 1 cột.
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            <div className="md:col-span-3 lg:col-span-1">
              <BudgetFilter />
            </div>
            <SeasonFilter />
            <ConcentFilter />
            <BrandFilter />
          </div>
        </div>

        {/* Scents Section */}
        <div className="w-full mt-10">
          <h2 className="font-gotu text-3xl pb-10 pt-14 flex items-center">
            <hr className="w-full border-gray-700" />
            <span className="whitespace-nowrap px-6 text-center">
              Find your own Scents
            </span>
            <hr className="w-full border-gray-700" />
          </h2>
          <div className="w-full flex flex-col items-center gap-10">
            <ScentsFilter />
            <SubScentsFilter />
          </div>
        </div>
      </div>
    </section>
  );
}
