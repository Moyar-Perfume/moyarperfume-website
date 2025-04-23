import { useEffect, useState } from "react";
import api from "@/constants/apiURL";

export default function useManageBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBrands: 0,
    hasMore: false,
  });

  const getAllBrand = async (page = 1, limit = 20, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });

      if (search) {
        params.append("search", search);
      }
      const response = await api.get(
        `/admin/manage-brand?${params.toString()}`
      );
      const brandData = response.data.brands;

      setBrands(
        brandData.map((brand) => ({
          id: brand._id,
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.description,
          updatedAt: brand.updatedAt,
        }))
      );
      setPagination(response.data.pagination);
      return response.data;
    } catch (err) {
      setError(err.message);
      setBrands([]);
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
    pagination,
    createBrand,
    getAllBrand,
    deleteBrand,
    setBrands,
    setLoading,
    getNextPage: () => getAllBrand(page + 1),
  };
}
