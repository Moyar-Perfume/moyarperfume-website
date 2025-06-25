import api from "@/constants/apiURL";
import { responsiveArray } from "antd/es/_util/responsiveObserver";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const DataContext = createContext();

export function useFilter() {
  return useContext(DataContext);
}

export function FilterContext({ children }) {
  // Budget
  const [budgetRange, setBudgetRange] = useState([0, 10000000]); // Default range from 0 to 10,000,000 VND
  const [budget, setBudget] = useState([0, 100]); // Default budget range from 0% to 100%

  const [budgetLoading, setBudgetLoading] = useState(true);

  useEffect(() => {
    const fetchPriceRange = async () => {
      setBudgetLoading(true);
      try {
        const res = await api.get("/product-list/price-range");

        setBudgetRange([res.data.minPrice, res.data.maxPrice]);
      } catch (err) {
        console.error("Failed to fetch price range", err);
      } finally {
        setBudgetLoading(false);
      }
    };

    fetchPriceRange();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Seasons

  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const toggleSeason = (id) => {
    setSelectedSeasons((prev) => {
      if (prev.includes(id)) {
        return prev.filter((seasonId) => seasonId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Concentrations

  const [selectedConcents, setSelectedConcents] = useState([]);
  const toggleConcent = (name) => {
    setSelectedConcents((prev) => {
      if (prev.includes(name)) {
        return prev.filter((concentName) => concentName !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  // Brands

  const [selectedBrands, setSelectedBrands] = useState([]);
  const toggleBrand = (id) => {
    setSelectedBrands((prev) => {
      if (prev.includes(id)) {
        return prev.filter((brandId) => brandId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Scent

  const [selectedScent, setSelectedScent] = useState();

  const handleScentClick = (slug) => {
    setSelectedScent(slug);
  };

  const handleScentRemove = () => {
    setSelectedScent();
  };

  console.log("Selected Scent:", selectedScent);

  // Sub-Scents
  const [selectedSubScents, setSelectedSubScents] = useState([]);

  const toggleSubScent = (slug) => {
    setSelectedSubScents((prev) =>
      prev.includes(slug)
        ? prev.filter((scentSlug) => scentSlug !== slug)
        : [...prev, slug]
    );
  };

  console.log("Selected Sub-Scents:", selectedSubScents);

  return (
    <DataContext.Provider
      value={{
        //Budget
        budget,
        setBudget,
        budgetRange,
        formatPrice,
        budgetLoading,

        //Season
        selectedSeasons,
        toggleSeason,

        //Concent
        selectedConcents,
        toggleConcent,

        //Brand
        selectedBrands,
        toggleBrand,

        //Scent
        selectedScent,
        handleScentRemove,
        handleScentClick,

        //Sub-Scent
        selectedSubScents,
        setSelectedSubScents,
        toggleSubScent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
