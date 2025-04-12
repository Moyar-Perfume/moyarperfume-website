import { useEffect, useState } from "react";
import api from "@/constants/apiURL";

export default function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllBrand = async () => {
    setLoading(true);
    try {
      const response = await api.get("/brands");
      setBrands(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData) => {
    setLoading(true);
    try {
      const response = await api.post("/admin/manage-brand", brandData);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/admin/manage-brand/${id}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBrand();
  }, []);

  return {
    brands,
    loading,
    error,
    createBrand,
    getAllBrand,
    deleteBrand,
    setBrands,
  };
}
