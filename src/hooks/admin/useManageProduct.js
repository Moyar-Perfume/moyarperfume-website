import { useEffect, useState } from "react";
import api from "@/constants/apiURL";

export function useEditManageProduct({ id }) {
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditProduct = async () => {
      try {
        const response = await api.get(`/admin/manage-product/${id}`);
        setEditProduct(response.data);
        console.log("Loaded product data:", response.data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditProduct();
    }
  }, [id]);

  return { editProduct, loading, error };
}
