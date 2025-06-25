"use client";

import { useState } from "react";
import Image from "next/image";
import { ConfigProvider, Slider } from "antd";
import { useFilter } from "@/contexts/FilterContext";

export default function BudgetFilter() {
  const { budget, setBudget, budgetRange, formatPrice, budgetLoading } =
    useFilter();
  const [tempBudget, setTempBudget] = useState(budget);
  const [editingField, setEditingField] = useState(null); // 'min' | 'max' | null
  const [inputValue, setInputValue] = useState(null);

  const percentToPrice = (percent) => {
    const [min, max] = budgetRange;
    return min + ((max - min) * percent) / 100;
  };

  const formatCurrency = (number) => {
    if (isNaN(number)) return "";
    return number.toLocaleString("vi-VN");
  };

  const unformatCurrency = (string) => {
    return Number(string.replace(/[.,₫\s]/g, ""));
  };

  return (
    <div className="flex-col flex w-full items-center">
      <div className="flex w-full justify-center">
        <span className="bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Budget
        </span>
      </div>

      <div className="w-[60%] h-[120px] relative overflow-hidden">
        <Image
          src="/element/budget.png"
          alt="Budget image showing perfume price range"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
          fill
          className="object-cover"
        />

        {budgetLoading === false && (
          <>
            <div
              className="absolute top-0 left-0 h-full bg-black opacity-60"
              style={{ width: `${tempBudget[0]}%` }}
            />
            <div
              className="absolute top-0 right-0 h-full bg-black opacity-60"
              style={{ width: `${100 - tempBudget[1]}%` }}
            />
          </>
        )}
      </div>

      <div className="w-[60%] mt-2 flex justify-between text-white gap-2">
        {["min", "max"].map((type, index) => {
          if (budgetLoading) {
            return (
              <div
                key={type}
                className="w-[48%] h-7 rounded bg-gray-700 animate-pulse"
              />
            );
          }

          const value = Math.round(percentToPrice(tempBudget[index]));

          return editingField === type ? (
            <input
              key={type}
              type="text"
              className="w-[48%] rounded bg-black text-white text-sm px-2 py-1 outline-none border border-gray-600 focus:border-white"
              value={inputValue !== null ? formatCurrency(inputValue) : ""}
              autoFocus
              onChange={(e) => {
                const raw = unformatCurrency(e.target.value);
                setInputValue(raw);
              }}
              onBlur={() => {
                const [min, max] = budgetRange;
                const percent = Math.min(
                  Math.max(((inputValue - min) / (max - min)) * 100, 0),
                  100
                );

                const newBudget =
                  type === "min"
                    ? [percent, tempBudget[1]]
                    : [tempBudget[0], percent];

                setTempBudget(newBudget);
                setBudget(newBudget);
                setEditingField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                }
              }}
            />
          ) : (
            <span
              key={type}
              className="w-[48%] rounded bg-black text-white text-sm px-2 py-1 border border-transparent cursor-text"
              onClick={() => {
                setEditingField(type);
                setInputValue(value);
              }}
            >
              {formatPrice(value)}
            </span>
          );
        })}
      </div>

      <div className="w-[60%] mt-4">
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                railBg: "#000",
                railHoverBg: "#000",
                handleActiveColor: "#414954",
                handleColor: "var(--white)",
                trackBg: "#414954",
                trackHoverBg: "var(--white)",
                handleActiveOutlineColor: "#d4d3d2",
                handleSize: 7,
                railSize: 3,
              },
            },
          }}
        >
          <Slider
            range
            min={0}
            max={100}
            value={tempBudget}
            onChange={(val) => setTempBudget(val)}
            onChangeComplete={(val) => setBudget(val)}
            tooltip={{ open: false }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
