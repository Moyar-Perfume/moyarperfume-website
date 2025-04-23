import { useState, useEffect } from "react";
import api from "@/constants/apiURL";

const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await api.get("/brands"); // Địa chỉ API của bạn
        setBrands(response.data);
      } catch (err) {
        setError("Lỗi khi tải thương hiệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
};

export default useBrands;
