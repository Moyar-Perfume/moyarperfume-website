"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/constants/apiURL";
import { useFilter } from "@/contexts/FilterContext";

export default function useProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Chỉ dùng cho lần tải đầu tiên
  const [isAppending, setIsAppending] = useState(false); // Dùng khi tải thêm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
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

  // Effect này chỉ có nhiệm vụ reset trang về 1 khi bộ lọc thay đổi.
  useEffect(() => {
    if (budgetLoading) return;
    setCurrentPage(1);
  }, [
    minPrice,
    maxPrice,
    selectedConcents,
    selectedSeasons,
    selectedBrands,
    selectedScent,
    selectedSubScents,
  ]);

  // Effect này là nơi duy nhất gọi API.
  useEffect(() => {
    if (budgetLoading || isNaN(minPrice) || isNaN(maxPrice)) return;

    const fetchProducts = async () => {
      // Phân biệt trạng thái loading cho lần đầu và các lần tải thêm
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setIsAppending(true);
      }

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

        // Cập nhật URL
        const newUrl = `${pathname}?${queryParams.toString()}`;
        router.replace(newUrl, { scroll: false });

        // Fetch dữ liệu
        const response = await api.get(
          `/product-list?${queryParams.toString()}`
        );
        const { products: newProducts, pagination } = response.data;

        // *** LOGIC LOAD MORE: Nối hoặc thay thế sản phẩm ***
        if (currentPage === 1) {
          setProducts(newProducts); // Thay thế khi ở trang 1
        } else {
          setProducts((prev) => [...prev, ...newProducts]); // Nối vào khi ở trang > 1
        }
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setIsAppending(false);
      }
    };

    fetchProducts();
  }, [currentPage, budgetLoading]);

  return {
    products,
    loading,
    isAppending,
    currentPage,
    totalPages,
    handlePageChange: setCurrentPage,
  };
}
