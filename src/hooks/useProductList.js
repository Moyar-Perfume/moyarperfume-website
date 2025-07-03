"use client";

import { useState, useEffect } from "react";
// 1. Import các hook cần thiết từ next/navigation
import { useRouter, usePathname } from "next/navigation";
import api from "@/constants/apiURL";
import { useFilter } from "@/contexts/FilterContext";

export default function useProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // 2. Khởi tạo router và pathname
  const router = useRouter();
  const pathname = usePathname();

  const {
    budget,
    selectedConcents,
    selectedSeasons,
    budgetRange,
    selectedBrands,
    selectedScent,
    selectedSubScents,
    budgetLoading,
  } = useFilter();

  const [minRange, maxRange] = budgetRange;
  const [budgetStart, budgetEnd] = budget;

  const minPrice = Math.floor(
    minRange + ((maxRange - minRange) * budgetStart) / 100
  );
  const maxPrice = Math.ceil(
    minRange + ((maxRange - minRange) * budgetEnd) / 100
  );

  // Effect này chỉ có nhiệm vụ reset trang và kích hoạt trigger khi bộ lọc thay đổi
  useEffect(() => {
    if (budgetLoading) return;
    setCurrentPage(1);
    setFetchTrigger((c) => c + 1);
  }, [
    minPrice,
    maxPrice,
    selectedConcents,
    selectedSeasons,
    selectedBrands,
    selectedScent,
    selectedSubScents,
  ]);

  // Effect này là nơi duy nhất gọi API và cập nhật URL
  useEffect(() => {
    if (budgetLoading || isNaN(minPrice) || isNaN(maxPrice)) {
      return;
    }

    const fetchProductsAndUpdateURL = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: productsPerPage.toString(),
          minPrice: minPrice.toString(),
          maxPrice: maxPrice.toString(),
        });

        // Thêm các bộ lọc khác vào query
        selectedConcents.forEach((name) => queryParams.append("nongdo", name));
        selectedSeasons.forEach((id) => queryParams.append("mua", id));
        selectedBrands.forEach((id) => queryParams.append("brands", id));
        if (selectedScent) queryParams.append("scent", selectedScent);
        selectedSubScents.forEach((slug) =>
          queryParams.append("subScent", slug)
        );

        // 3. Cập nhật URL trên thanh địa chỉ mà không tải lại trang
        // Dùng `replace` để không tạo thêm lịch sử trình duyệt cho mỗi lần lọc
        const newUrl = `${pathname}?${queryParams.toString()}`;
        router.replace(newUrl, { scroll: false });

        // 4. Fetch dữ liệu sản phẩm từ API như bình thường
        const response = await api.get(
          `/product-list?${queryParams.toString()}`
        );
        const { products: newProducts, pagination } = response.data;
        setProducts(newProducts);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndUpdateURL();
  }, [currentPage, fetchTrigger, budgetLoading]);

  return {
    products,
    loading,
    currentPage,
    totalPages,
    handlePageChange: setCurrentPage,
  };
}
