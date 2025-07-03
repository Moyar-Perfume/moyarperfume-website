"use client";

import api from "@/constants/apiURL";
import { useEffect, useState, useCallback } from "react";
import { useFilter } from "@/contexts/FilterContext";

export default function useProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  // Lấy tất cả các bộ lọc từ context
  const filters = useFilter();
  const {
    budget,
    selectedConcents,
    selectedSeasons,
    budgetRange,
    selectedBrands,
    selectedScent,
    selectedSubScents,
    budgetLoading,
  } = filters;

  const [minRange, maxRange] = budgetRange;
  const [budgetStart, budgetEnd] = budget;

  const minPrice = Math.floor(
    minRange + ((maxRange - minRange) * budgetStart) / 100
  );
  const maxPrice = Math.ceil(
    minRange + ((maxRange - minRange) * budgetEnd) / 100
  );

  // Hàm fetch sản phẩm, được bọc trong useCallback để tối ưu
  const fetchProducts = useCallback(
    async (pageToFetch) => {
      if (budgetLoading || isNaN(minPrice) || isNaN(maxPrice)) return;

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: pageToFetch,
          limit: productsPerPage,
          minPrice: minPrice,
          maxPrice: maxPrice,
        });

        // Thêm các bộ lọc khác vào query
        selectedConcents.forEach((name) => queryParams.append("nongdo", name));
        selectedSeasons.forEach((id) => queryParams.append("mua", id));
        selectedBrands.forEach((id) => queryParams.append("brands", id));
        if (selectedScent) queryParams.append("scent", selectedScent);
        if (selectedSubScents.length) {
          selectedSubScents.forEach((slug) =>
            queryParams.append("subScent", slug)
          );
        }

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
    },
    [
      budgetLoading,
      minPrice,
      maxPrice,
      selectedConcents,
      selectedSeasons,
      selectedBrands,
      selectedScent,
      selectedSubScents,
    ]
  );

  // useEffect này chạy khi các BỘ LỌC thay đổi
  useEffect(() => {
    if (budgetLoading) return;
    if (currentPage !== 1) {
      setCurrentPage(1); // Sẽ trigger useEffect bên dưới
    } else {
      fetchProducts(1); // Nếu đã ở trang 1, tự fetch
    }
  }, [
    budgetLoading,
    selectedConcents,
    selectedSeasons,
    minPrice,
    maxPrice,
    selectedBrands,
    selectedScent,
    selectedSubScents,
    fetchProducts,
  ]);

  // useEffect này chỉ chạy khi SỐ TRANG thay đổi
  useEffect(() => {
    if (budgetLoading) return;
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts, budgetLoading]);

  // Trả về các giá trị và hàm cần thiết cho component
  return {
    products,
    loading,
    currentPage,
    totalPages,
    handlePageChange: setCurrentPage,
  };
}
