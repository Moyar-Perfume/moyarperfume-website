"use client";

import useProductList from "@/hooks/useProductList";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";
import Product from "@/components/product/Product"; // Sử dụng lại component Product cũ

export default function ProductList() {
  const {
    products,
    loading,
    isAppending, // State mới để biết khi nào đang tải thêm
    currentPage,
    totalPages,
    handlePageChange,
  } = useProductList();

  // Skeleton loader cho giao diện tối, không thay đổi
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="p-2 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 w-full h-[300px] rounded-sm"></div>
            <div className="mt-5 w-full flex items-center gap-2">
              <div className="h-0.5 bg-gray-800 flex-1"></div>
              <div className="bg-gray-800 h-6 w-24 rounded"></div>
              <div className="h-0.5 bg-gray-800 flex-1"></div>
            </div>
            <div className="bg-gray-800 h-8 w-3/4 mt-2 rounded"></div>
          </div>
        </div>
      ));
  };

  // Hàm getPaginationNumbers không còn cần thiết nữa
  // const getPaginationNumbers = (current, total) => { ... };

  return (
    // Áp dụng nền tối và chữ trắng
    <div className="bg-white text-black flex flex-col min-h-screen pt-10">
      <ScrollToTopButton />
      {/* Giữ nguyên bố cục lưới sản phẩm */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Chỉ hiển thị skeleton khi tải lần đầu */}
        {loading ? (
          renderSkeletons()
        ) : products.length > 0 ? (
          // Sử dụng lại component Product cũ của bạn
          products.map((product) => (
            <div key={`${product.slug}-${product._id}`}>
              <Product product={product} imageSize="h-[300px]" />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl font-serif">No products found</p>
            <p className="mt-2 text-gray-400">
              Please try adjusting your filters.
            </p>
          </div>
        )}
      </section>

      {/* THAY THẾ PHÂN TRANG BẰNG NÚT "LOAD MORE" */}
      <div className="text-center my-16 h-10">
        {/* Hiển thị spinner khi đang tải thêm sản phẩm */}
        {isAppending && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        {/* Hiển thị nút khi có thể tải thêm và không đang loading */}
        {!loading && !isAppending && currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="border border-gray-600 text-black text-sm uppercase tracking-wider py-3 px-12 hover:bg-black hover:text-white transition-colors"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
