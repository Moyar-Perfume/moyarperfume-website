import { useFilter } from "@/contexts/FilterContext";

const brands = [
  { id: 1, name: "Chanel" },
  { id: 2, name: "Dior" },
  { id: 3, name: "Gucci" },
  { id: 4, name: "Tom Ford" },
  { id: 5, name: "Hermès" },
  { id: 6, name: "Yves Saint Laurent" },
  { id: 7, name: "Creed" },
  { id: 8, name: "Jo Malone" },
  { id: 9, name: "Versace" },
  { id: 10, name: "Prada" },
  { id: 11, name: "Dolce & Gabbana" },
  { id: 12, name: "Givenchy" },
  { id: 13, name: "Burberry" },
  { id: 14, name: "Armani" },
  { id: 15, name: "Byredo" },
  { id: 16, name: "Maison Francis Kurkdjian" },
  { id: 17, name: "Penhaligon's" },
  { id: 18, name: "Bvlgari" },
  { id: 19, name: "Kilian" },
  { id: 20, name: "Diptyque" },
];

export default function BrandFilter() {
  const { selectedBrands, toggleBrand } = useFilter();

  return (
    <div className="items-center w-full flex-col flex">
      <div className="flex items-center">
        <span className="whitespace-nowrap bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Brand
        </span>
      </div>
      <div>
        <ul className="max-h-[200px] overflow-y-auto grid gap-4 custom-scrollbar pr-2">
          {brands
            .sort(
              (a, b) =>
                selectedBrands.includes(b.id) - selectedBrands.includes(a.id)
            )

            .map((brand) => (
              <li
                key={brand.id}
                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity pr-6"
                onClick={() => toggleBrand(brand.id)}
              >
                <div
                  className={`p-[10px] border-[1px] rounded ${
                    selectedBrands.includes(brand.id)
                      ? "bg-white bg-opacity-20"
                      : ""
                  }`}
                ></div>
                <span>{brand.name}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
