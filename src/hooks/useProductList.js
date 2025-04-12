import { useEffect, useState } from "react";
import api from "@/constants/apiURL";

export function useProductList(
  isAdmin = false,
  page = 1,
  limit = 10,
  searchText = ""
) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false,
  });

  const buildUrl = () => {
    let url = isAdmin
      ? `/product-list?admin=true&page=${page}&limit=${limit}`
      : `/product-list?page=${page}&limit=${limit}`;

    if (searchText) {
      url += `&search=${encodeURIComponent(searchText)}`;
    }
    return url;
  };

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const response = await api.get(buildUrl());

      if (response.status === 200) {
        const { currentPage, totalPages, totalProducts } =
          response.data.pagination;
        setProductList(response.data.products || []);
        setPagination({
          currentPage,
          totalPages,
          totalProducts,
          hasMore: currentPage < totalPages,
        });
      } else {
        setError("Không thể lấy danh sách sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching product list:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Đã xảy ra lỗi khi tải danh sách sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [isAdmin, page, limit, searchText]);

  return { productList, loading, error, pagination, refetch: fetchProductList };
}
