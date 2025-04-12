"use client";

import api from "@/constants/apiURL";
import { useFilter } from "@/contexts/FilterContext";
import { useEffect, useState, useRef, useCallback } from "react";
import Product from "@/components/shared/Product";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filterProducts } = useFilter();

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const productsPerPage = 12;

  // Refs cho infinite scroll
  const observer = useRef();
  const lastProductElementRef = useRef();

  // Hàm tải sản phẩm từ API
  const fetchProducts = async (page = 1, append = false) => {
    try {
      setLoading(true);

      // Tạo query string cho phân trang
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", productsPerPage);

      // Thêm các tham số lọc nếu có
      // Lưu ý: Chúng ta không thể truy cập trực tiếp các tham số lọc từ filterProducts
      // nên sẽ để API xử lý việc lọc dựa trên các tham số được gửi từ client

      const response = await api.get(`/product-list?${queryParams.toString()}`);

      const { products: newProducts, pagination } = response.data;

      // Cập nhật state
      if (append) {
        // Kiểm tra trùng lặp trước khi thêm sản phẩm mới
        const existingSlugs = new Set(products.map((p) => p.slug));
        const uniqueNewProducts = newProducts.filter(
          (p) => !existingSlugs.has(p.slug)
        );

        setProducts((prev) => [...prev, ...uniqueNewProducts]);
      } else {
        setProducts(newProducts);
      }

      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalProducts(pagination.totalProducts);
      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Tải sản phẩm ban đầu
  useEffect(() => {
    fetchProducts(1, false);
  }, [filterProducts]);

  // Hàm load thêm sản phẩm
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    fetchProducts(currentPage + 1, true);
  }, [currentPage, hasMore, isLoadingMore]);

  // Thiết lập Intersection Observer để theo dõi phần tử cuối cùng
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        loadMoreProducts();
      }
    });

    if (lastProductElementRef.current) {
      observer.current.observe(lastProductElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [products, hasMore, isLoadingMore, loadMoreProducts, loading]);

  // Loading skeleton
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
            <div className="w-16 h-0.5 bg-gray-200 my-2"></div>
            <div className="bg-gray-200 w-full h-[150px] rounded-sm mt-2"></div>
          </div>
        </div>
      ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24 w-full items-center justify-around px-20 flex-grow">
        {loading && products.length === 0 ? (
          renderSkeletons()
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={`${product.slug}-${index}`}
              className="p-2"
              ref={index === products.length - 1 ? lastProductElementRef : null}
            >
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

      {/* Loading indicator khi đang tải thêm sản phẩm */}
      {isLoadingMore && (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Hiển thị thông tin số sản phẩm đã tải */}
      {!loading && products.length > 0 && (
        <div className="text-center text-sm text-gray-600 mb-6">
          Hiển thị {products.length} / {totalProducts} sản phẩm
          {hasMore && " | Cuộn xuống để xem thêm"}
        </div>
      )}
    </div>
  );
}
