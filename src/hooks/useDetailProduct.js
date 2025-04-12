import { useEffect, useState } from "react";
import api from "@/constants/apiURL";

export default function useDetailProduct({ slug }) {
  const [detailProduct, setDetailProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        setDetailProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailProduct();
  }, [slug]);

  return { detailProduct, loading, error };
}
