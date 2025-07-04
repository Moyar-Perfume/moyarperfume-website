import ScrollToTopButton from "@/components/shared/ScrollToTopButton";
import Product from "@/components/product/Product";
import useProductList from "@/hooks/useProductList";

export default function ProductList() {
  const { products, loading, currentPage, totalPages, handlePageChange } =
    useProductList();

  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="p-2 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 w-full h-[300px] rounded-sm"></div>
            <div className="mt-5 w-full flex items-center gap-2">
              <div className="h-0.5 bg-gray-200 flex-1"></div>
              <div className="bg-gray-200 h-6 w-24 rounded"></div>
              <div className="h-0.5 bg-gray-200 flex-1"></div>
            </div>
            <div className="bg-gray-200 h-8 w-3/4 mt-2 rounded"></div>
          </div>
        </div>
      ));
  };

  const getPaginationNumbers = (current, total) => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push("...");
      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <ScrollToTopButton />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full items-center justify-around px-20 flex-grow">
        {loading ? (
          renderSkeletons()
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={`${product.slug}`}>
              <Product product={product} imageSize="h-[300px]" />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl">
              Không tìm thấy sản phẩm phù hợp với bộ lọc.
            </p>
            <p className="mt-2">Vui lòng thử lại với bộ lọc khác.</p>
          </div>
        )}
      </section>

      {/* Phân trang */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 text-sm flex-wrap my-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trước
          </button>

          {getPaginationNumbers(currentPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-3 py-2">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
