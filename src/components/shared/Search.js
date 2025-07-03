import { useState, useEffect, useRef, useCallback } from "react";
import Product from "../product/Product";
import Loading from "./Loading";

export default function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({
    products: { items: [], pagination: {} },
    brands: { items: [] },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);

  // Hàm gọi API, xử lý cả lần tải đầu và các lần tải thêm
  const fetchResults = useCallback(async (term, page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?q=${term}&page=${page}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setResults((prev) => ({
        // Giữ lại kết quả brand từ lần tìm kiếm đầu tiên
        brands: page === 1 ? data.results.brands : prev.brands,
        // Nếu là trang 1, thay thế sản phẩm. Nếu không, nối vào danh sách cũ.
        products: {
          items:
            page === 1
              ? data.results.products.items
              : [...prev.products.items, ...data.results.products.items],
          pagination: data.results.products.pagination,
        },
      }));
      setHasMore(data.results.products.pagination.hasMore);
      setCurrentPage(page);
    } catch (err) {
      setError("Không thể tải kết quả. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect để tìm kiếm khi người dùng ngừng gõ
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        // Reset tất cả state khi ô tìm kiếm trống
        setResults({
          products: { items: [], pagination: {} },
          brands: { items: [] },
        });
        setIsLoading(false);
        setCurrentPage(1);
        setHasMore(false);
        setError(null);
        return;
      }

      // Khi có từ khóa tìm kiếm mới, reset state và bắt đầu lại từ trang 1
      setCurrentPage(1);
      setHasMore(false);
      setResults({
        products: { items: [], pagination: {} },
        brands: { items: [] },
      });
      fetchResults(searchTerm, 1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchResults]);

  // Xử lý khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      searchInputRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Logic cho Intersection Observer để cuộn vô hạn
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchResults(searchTerm, currentPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchResults, searchTerm, currentPage]
  );

  const handleSelectKeyword = (keyword) => {
    setSearchTerm(keyword);
  };

  const productResults = results.products?.items || [];

  console.log("Search results:", productResults);

  const brandResults = results.brands?.items || [];

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
            <form onSubmit={(e) => e.preventDefault()} className="flex-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full py-2 px-2 text-lg focus:outline-none"
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

        {/* Content area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Suggested brands - Cột bên trái */}
          <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto py-4 px-4">
            {brandResults.length > 0 && (
              <>
                <h3 className="text-base font-medium mb-3">Thương hiệu</h3>
                <ul className="space-y-3">
                  {brandResults.map((brand) => (
                    <li key={brand._id}>
                      <button
                        className="text-left w-full py-1 text-sm hover:text-gray-600 transition-colors"
                        onClick={() => handleSelectKeyword(brand.name)}
                      >
                        {brand.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {searchTerm &&
              !isLoading &&
              brandResults.length === 0 &&
              productResults.length > 0 && (
                <p className="text-sm text-gray-400">
                  Không có thương hiệu nào.
                </p>
              )}
          </div>

          {/* Search results - Khu vực chính */}
          <div className="md:w-3/4 flex-1 overflow-y-auto">
            {/* Cấu trúc hiển thị được tổ chức lại */}
            {isLoading && productResults.length === 0 ? (
              // Case 1: Đang tải cho lần tìm kiếm mới (toàn khu vực)
              <div className="p-6 text-center relative flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : error ? (
              // Case 2: Xảy ra lỗi
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              // Case 3: Hiển thị nội dung (kết quả, không có kết quả, hoặc trạng thái ban đầu)
              <>
                {productResults.length > 0 && (
                  <div className="px-6 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">
                      {results.products.pagination.totalProducts} kết quả sản
                      phẩm
                    </p>
                  </div>
                )}
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productResults.map((product, index) => {
                      // Gán ref cho phần tử cuối cùng để kích hoạt infinite scroll
                      if (productResults.length === index + 1) {
                        return (
                          <div
                            ref={lastProductElementRef}
                            key={product._id}
                            className="p-2"
                          >
                            <Product product={product} />
                          </div>
                        );
                      } else {
                        return (
                          <div key={product._id} className="p-2">
                            <Product product={product} />
                          </div>
                        );
                      }
                    })}
                  </div>

                  {/* Spinner khi tải thêm sản phẩm (chỉ hiện ở cuối) */}
                  {isLoading && productResults.length > 0 && (
                    <div className="flex py-6 relative w-full">
                      <Loading />
                    </div>
                  )}

                  {/* Thông báo khi không có kết quả */}
                  {searchTerm &&
                    !isLoading &&
                    productResults.length === 0 &&
                    brandResults.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">
                          Không tìm thấy kết quả cho "{searchTerm}"
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Vui lòng thử một từ khóa khác.
                        </p>
                      </div>
                    )}
                  {/* Thông báo ban đầu */}
                  {!searchTerm && (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">
                        Nhập từ khóa để bắt đầu tìm kiếm.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
