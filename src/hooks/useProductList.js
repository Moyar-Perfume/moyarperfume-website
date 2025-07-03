"use client";

import { useState, useEffect } from "react";
import api from "@/constants/apiURL";
import { useFilter } from "@/contexts/FilterContext";

export default function useProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  // --- LOGIC ĐÃ SỬA LỖI HOÀN CHỈNH ---
  // 1. Thêm một state "trigger" để buộc fetch lại khi cần
  const [fetchTrigger, setFetchTrigger] = useState(0);

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

  // 2. Effect này chỉ có nhiệm vụ reset trang và kích hoạt trigger khi bộ lọc thay đổi
  useEffect(() => {
    // Không chạy khi context đang tải lần đầu
    if (budgetLoading) return;

    // Khi bộ lọc thay đổi, ta luôn muốn fetch lại từ trang 1
    setCurrentPage(1);
    // Kích hoạt trigger để đảm bảo useEffect fetch sẽ chạy
    setFetchTrigger((c) => c + 1);
  }, [
    // Danh sách dependencies chỉ bao gồm các giá trị của bộ lọc.
    minPrice,
    maxPrice,
    selectedConcents,
    selectedSeasons,
    selectedBrands,
    selectedScent,
    selectedSubScents,
  ]);

  // 3. Effect này là nơi duy nhất gọi API.
  // Nó sẽ chạy khi `currentPage` thay đổi (do người dùng) HOẶC khi `fetchTrigger` thay đổi (do bộ lọc).
  useEffect(() => {
    // Chờ context tải xong và giá hợp lệ mới fetch
    if (budgetLoading || isNaN(minPrice) || isNaN(maxPrice)) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: productsPerPage,
          minPrice: minPrice,
          maxPrice: maxPrice,
        });

        // Thêm các bộ lọc khác vào query
        selectedConcents.forEach((name) => queryParams.append("nongdo", name));
        selectedSeasons.forEach((id) => queryParams.append("mua", id));
        selectedBrands.forEach((id) => queryParams.append("brands", id));
        if (selectedScent) queryParams.append("scent", selectedScent);
        selectedSubScents.forEach((slug) =>
          queryParams.append("subScent", slug)
        );

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

    fetchProducts();
  }, [currentPage, fetchTrigger, budgetLoading]); // Chỉ phụ thuộc vào currentPage, trigger và budgetLoading

  return {
    products,
    loading,
    currentPage,
    totalPages,
    handlePageChange: setCurrentPage,
  };
}
