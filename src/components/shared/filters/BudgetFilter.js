import Image from "next/image";
import { ConfigProvider, Slider } from "antd";
import { useFilter } from "@/contexts/FilterContext";

export default function BudgetFilter() {
  const { budget, setBudget, budgetRange, formatPrice } = useFilter();

  return (
    <div className="flex-col flex w-full items-center ">
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

        <div
          className="absolute top-0 left-0 h-full bg-black opacity-60"
          style={{ width: `${budget[0]}%` }}
        />

        <div
          className="absolute top-0 right-0 h-full bg-black opacity-60"
          style={{ width: `${100 - budget[1]}%` }}
        />
      </div>

      <div className="w-[60%] mt-2 flex justify-between text-white">
        <span className="font-gotu text-sm">{formatPrice(budgetRange[0])}</span>
        <span className="font-gotu text-sm">{formatPrice(budgetRange[1])}</span>
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
            value={budget}
            onChange={setBudget}
            tooltip={{ open: false }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
