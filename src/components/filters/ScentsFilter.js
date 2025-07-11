"use client";

import { useFilter } from "@/contexts/FilterContext";

import Image from "next/image";

const scents = [
  { id: 1, name: "Ambery", img: "/scents/ambery.webp", slug: "ambery" },
  {
    id: 2,
    name: "Aromatic Fougere",
    img: "/scents/aromatic-fougere.webp",
    slug: "aromatic-fougere",
  },
  { id: 3, name: "Chypre", img: "/scents/chypre.webp", slug: "chypre" },
  { id: 4, name: "Citrus", img: "/scents/citrus.webp", slug: "citrus" },
  { id: 5, name: "Floral", img: "/scents/floral.webp", slug: "floral" },
  { id: 6, name: "Leather", img: "/scents/leather.webp", slug: "leather" },
  { id: 7, name: "Woody", img: "/scents/woody.webp", slug: "woody" },
];

export default function ScentsFilter() {
  const {
    selectedScent,
    handleScentClick,
    handleScentRemove,
    setSelectedSubScents,
  } = useFilter();

  return (
    <div className="w-full flex gap-10 items-center justify-center">
      {scents.map((scent) => (
        <div
          key={scent.name}
          className="w-[200px] h-[200px] relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => handleScentClick(scent.slug)}
        >
          <Image
            src={scent.img}
            alt={`Logo ${scent.slug}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
            className={`object-cover transition-all duration-500 ${
              selectedScent === scent.slug
                ? "grayscale-0 opacity-100"
                : "grayscale opacity-60"
            }`}
          />

          {selectedScent === scent.slug && (
            <div
              className="absolute p-2 z-20 right-0 top-0 translate-x-1/2 -translate-y-1/2 
                  rounded-full border-[1px] bg-black text-white cursor-pointer transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleScentRemove();
                setSelectedSubScents([]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}

          {selectedScent !== scent.slug && (
            <div className="absolute inset-0 bg-black opacity-60 group-hover:opacity-0 transition-opacity duration-500"></div>
          )}

          <p
            className="text-sm absolute bottom-[-10%] left-1/2 transform -translate-x-1/2 
                text-white font-gotu z-10 whitespace-nowrap bg-black p-[6px] px-4"
          >
            {scent.name}
          </p>
        </div>
      ))}
    </div>
  );
}
