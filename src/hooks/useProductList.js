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

  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);
      try {
        let url = isAdmin
          ? `/product-list?admin=true&page=${page}&limit=${limit}`
          : `/product-list?page=${page}&limit=${limit}`;

        if (searchText) {
          url += `&search=${encodeURIComponent(searchText)}`;
        }

        const response = await api.get(url);

        if (response.status === 200) {
          setProductList(response.data.products || []);
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalProducts: response.data.pagination.totalProducts,
            hasMore: response.data.pagination.hasMore,
          });
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching product list:", err);
        setError(err.message || "An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductList();
  }, [isAdmin, page, limit, searchText]);

  return { productList, loading, error, pagination };
}
