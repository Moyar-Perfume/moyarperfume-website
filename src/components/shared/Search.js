import { useState, useEffect } from "react";
import Image from "next/image";
import Product from "./Product";

// Danh sách từ khóa gợi ý
const suggestedKeywords = [
  // Thương hiệu nước hoa
  "Dior",
  "Chanel",
  "Versace",
  "Gucci",
  "Tom Ford",
  "Prada",
  "Yves Saint Laurent",
  "Jo Malone",
  "Byredo",
  "Maison Francis Kurkdjian",
  "Creed",
  "Amouage",

  // Phân loại theo giới tính
  "Dior Nam",
  "Dior Nữ",
  "Chanel Nam",
  "Chanel Nữ",
  "Versace Nam",
  "Versace Nữ",
  "Nước hoa Nam",
  "Nước hoa Nữ",
  "Nước hoa Unisex",

  // Phân loại theo mùi hương
  "Hương hoa",
  "Hương gỗ",
  "Hương trái cây",
  "Hương phương Đông",
  "Hương biển",
  "Hương cam quýt",

  // Phân loại theo nồng độ/loại
  "Eau de Parfum",
  "Eau de Toilette",
  "Parfum",
  "Nước hoa mini",
  "Gift set",
  "Bộ quà tặng",

  // Phân loại theo mùa/thời gian
  "Nước hoa mùa hè",
  "Nước hoa mùa đông",
  "Nước hoa ngày",
  "Nước hoa đêm",
];

// Danh sách kết quả tìm kiếm mẫu
const sampleResults = [
  {
    id: 1,
    name: "Sauvage",
    brand: "Dior",
    description: "Eau de Parfum dành cho nam giới",
    images: ["/product/product-01.jpg"],
    price: 140,
    formulation: "Hương gỗ phương Đông",
    volumes: [
      { size: "50ml", price: 90 },
      { size: "100ml", price: 140 },
      { size: "200ml", price: 190 },
    ],
  },
  {
    id: 2,
    name: "No.5",
    brand: "Chanel",
    description: "Eau de Parfum biểu tượng cho phái nữ",
    images: ["/product/product-02.jpg"],
    price: 160,
    formulation: "Hương hoa cổ điển",
    volumes: [
      { size: "50ml", price: 110 },
      { size: "100ml", price: 160 },
    ],
  },
  {
    id: 3,
    name: "Bleu",
    brand: "Chanel",
    description: "Eau de Parfum dành cho nam giới hiện đại",
    images: ["/product/product-03.jpg"],
    price: 130,
    formulation: "Hương gỗ thơm",
    volumes: [
      { size: "50ml", price: 80 },
      { size: "100ml", price: 130 },
      { size: "150ml", price: 170 },
    ],
  },
];

export default function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Shampoo");

  // Kiểm soát overflow của body khi mở/đóng search
  useEffect(() => {
    if (isOpen) {
      // Ngăn scroll trang
      document.body.style.overflow = "hidden";
    } else {
      // Cho phép scroll trang
      document.body.style.overflow = "auto";
    }

    // Cleanup function khi component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Lọc từ khóa gợi ý dựa trên searchTerm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredKeywords(suggestedKeywords);
      setResults([]);
    } else {
      const filtered = suggestedKeywords.filter((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKeywords(filtered);

      // Giả lập kết quả tìm kiếm
      setResults(
        sampleResults.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  // Mặc định hiển thị tất cả từ khóa gợi ý ban đầu
  useEffect(() => {
    if (isOpen) {
      setFilteredKeywords(suggestedKeywords);
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm với searchTerm
    console.log("Searching for:", searchTerm);
    // Giả lập kết quả tìm kiếm
    setResults(sampleResults);
  };

  const handleSelectKeyword = (keyword) => {
    setSearchTerm(keyword);
    setSelectedCategory(keyword);
    // Giả lập kết quả tìm kiếm khi chọn keyword
    setResults(
      sampleResults.filter(
        (item) => item.name.includes(keyword) || keyword.includes(item.name)
      )
    );
  };

  const resultCount = results.length;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-white ${
        !isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      } transition-opacity duration-300 overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        {/* Top search bar */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <div className="w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nước hoa nam"
                className="w-full py-2 px-2 text-lg focus:outline-none"
                autoFocus={isOpen}
              />
            </form>
            <button
              className="text-black hover:text-gray-600 transition-colors p-2"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area - Responsive layout: column on mobile, row on desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Suggested keywords - Full width on mobile, 1/4 width on desktop */}
          <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto py-4 px-4">
            <h3 className="text-base font-medium mb-3">Suggested</h3>
            {/* On mobile: horizontal scrolling buttons */}
            <div className="flex md:hidden overflow-x-auto pb-2 gap-2 hide-scrollbar">
              {filteredKeywords.map((keyword, index) => (
                <button
                  key={index}
                  className={`text-sm whitespace-nowrap px-3 py-1.5 rounded-full border flex-shrink-0 transition-colors ${
                    selectedCategory === keyword
                      ? "bg-black text-white border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleSelectKeyword(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* On desktop: vertical list */}
            <ul className="hidden md:block space-y-3">
              {filteredKeywords.map((keyword, index) => (
                <li key={index}>
                  <button
                    className={`text-left w-full py-1 text-sm hover:text-gray-600 transition-colors ${
                      selectedCategory === keyword ? "font-medium" : ""
                    }`}
                    onClick={() => handleSelectKeyword(keyword)}
                  >
                    {keyword}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search results - Full width on mobile, 3/4 width on desktop */}
          <div className="md:w-3/4 flex-1 overflow-y-auto">
            {/* Results count */}
            {resultCount > 0 && (
              <div className="px-6 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-500">{resultCount} results</p>
              </div>
            )}

            {/* Results grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <div key={product.id} className="p-2">
                    <Product
                      product={product}
                      imageSize="h-[200px]"
                      showLikeButton={true}
                    />
                  </div>
                ))}
              </div>

              {/* Show message when no results */}
              {searchTerm && results.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    No results found for "{searchTerm}"
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Please try another search term or browse our categories
                  </p>
                </div>
              )}

              {/* Show initial state when no search term */}
              {!searchTerm && results.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    Enter a search term or select a category
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add scrollbar hiding style */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
