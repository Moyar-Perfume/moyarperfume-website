import { useFilter } from "@/contexts/FilterContext";
import useBrands from "@/hooks/useBrands";
import { Spin } from "antd";

export default function BrandFilter() {
  const { selectedBrands, toggleBrand } = useFilter();

  const { brands, loading: loadingBrand } = useBrands();

  return (
    <div className="items-center w-full flex-col flex">
      <div className="flex items-center">
        <span className="whitespace-nowrap bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Brand
        </span>
      </div>
      {/* Nếu đang loading thì hiển thị spinner */}
      {loadingBrand ? (
        <div className="flex justify-center items-center h-[200px]">
          <Spin />
        </div>
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
