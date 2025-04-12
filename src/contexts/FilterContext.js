import { createContext, useContext, useState, useEffect, useRef } from "react";

const DataContext = createContext();

export function useFilter() {
  return useContext(DataContext);
}

const subScents = [
  { id: 1, name: "Citrus", img: "/scents/sub/citrus.webp" },
  { id: 2, name: "Green", img: "/scents/sub/green.webp" },
  { id: 3, name: "Watery", img: "/scents/sub/watery.webp" },
  { id: 4, name: "Aromatic Fougere", img: "/scents/sub/aromatic-fougere.webp" },
  { id: 5, name: "Aldehydic", img: "/scents/sub/aldehyde.webp" },
  { id: 6, name: "Floral", img: "/scents/sub/floral.webp" },
  { id: 7, name: "Fruity", img: "/scents/sub/fruity.webp" },
  { id: 8, name: "Spicy", img: "/scents/sub/spicy.webp" },
  { id: 9, name: "Chypre", img: "/scents/sub/chypre.webp" },
  { id: 10, name: "Tobacco", img: "/scents/sub/tobacco.webp" },
  { id: 11, name: "Gourmand", img: "/scents/sub/gourmand.webp" },
  { id: 12, name: "Ambery (Oriental)", img: "/scents/sub/ambery.webp" },
  { id: 13, name: "Leather", img: "/scents/sub/leather.webp" },
  { id: 14, name: "Musk Skin", img: "/scents/sub/musk-skin.webp" },
];

const concentrations = [
  { id: 1, name: "Eau de Cologne (EDC)" },
  { id: 2, name: "Eau de Toilette (EDT)" },
  { id: 3, name: "Eau de Parfum (EDP)" },
  { id: 4, name: "Parfum (Extrait de Parfum)" },
];

const scents = [
  { id: 1, name: "Ambery", img: "/scents/ambery.webp" },
  { id: 2, name: "Aromatic Fougere", img: "/scents/aromatic-fougere.webp" },
  { id: 3, name: "Chypre", img: "/scents/chypre.webp" },
  { id: 4, name: "Citrus", img: "/scents/citrus.webp" },
  { id: 5, name: "Floral", img: "/scents/floral.webp" },
  { id: 6, name: "Leather", img: "/scents/leather.webp" },
  { id: 7, name: "Woody", img: "/scents/woody.webp" },
];

const seasons = [
  { id: 1, name: "Spring", icon: "/element/spring.svg" },
  { id: 2, name: "Summer", icon: "/element/summer.svg" },
  { id: 3, name: "Autumn", icon: "/element/autumn.svg" },
  { id: 4, name: "Winter", icon: "/element/winter.svg" },
];

export function FilterContext({ children }) {
  // Budget
  const minPrice = 0;
  const maxPrice = 10000000;

  const [budget, setBudget] = useState([0, 100]);
  const [budgetRange, setBudgetRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    const minVal = Math.round((budget[0] / 100) * maxPrice);
    const maxVal = Math.round((budget[1] / 100) * maxPrice);
    setBudgetRange([minVal, maxVal]);
  }, [budget]);

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
  const toggleConcent = (id) => {
    setSelectedConcents((prev) => {
      if (prev.includes(id)) {
        return prev.filter((concentId) => concentId !== id);
      } else {
        return [...prev, id];
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

  const [selectedScent, setSelectedScent] = useState(-1);
  const scentRef = useRef(null);

  const handleScentClick = (id) => {
    setSelectedScent(id);
  };

  const handleScentRemove = () => {
    setSelectedScent(-1);
  };

  useEffect(() => {
    if (selectedScent !== -1 && scentRef.current) {
      const element = scentRef.current;
      const windowHeight = window.innerHeight;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const elementHeight = element.offsetHeight;
      const offset = (windowHeight - elementHeight) / 2 - 150;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  }, [selectedScent]);

  // Sub-Scents
  const [selectedSubScents, setSelectedSubScents] = useState([]);

  const toggleSubScent = (id) => {
    setSelectedSubScents((prev) =>
      prev.includes(id)
        ? prev.filter((scentId) => scentId !== id)
        : [...prev, id]
    );
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      const productTags = product.tag || []; // Handle case where tag might be undefined

      // Filter by concentration (nongdo)
      if (selectedConcents.length > 0) {
        const concentMatch = selectedConcents.some((id) => {
          const concentName = concentrations.find((c) => c.id === id)?.name;
          console.log(concentName);
          return (
            concentName &&
            productTags.some(
              (tag) => tag.startsWith("nongdo_") && tag.includes(concentName)
            )
          );
        });
        if (!concentMatch) return false;
      }

      // Filter by seasons (mua)
      if (selectedSeasons.length > 0) {
        const seasonMatch = selectedSeasons.some((id) => {
          const seasonName = seasons.find((s) => s.id === id)?.name;
          const seasonNameVN = {
            Spring: "Mùa Xuân",
            Summer: "Mùa Hè",
            Autumn: "Mùa Thu",
            Winter: "Mùa Đông",
          }[seasonName];

          return (
            seasonNameVN &&
            productTags.some(
              (tag) => tag.startsWith("mua_") && tag.includes(seasonNameVN)
            )
          );
        });
        if (!seasonMatch) return false;
      }

      // Filter by scent and subScent
      // Filter by scent and subScent
      if (selectedScent !== -1 || selectedSubScents.length > 0) {
        const scentTags = new Set(); // Dùng Set để tránh trùng lặp

        if (selectedScent !== -1) {
          const scentItem = scents.find((s) => s.id === selectedScent);
          if (scentItem) {
            const scentNameMap =
              {
                Citrus: "Citrus (Hương Cam Chanh)",
                Floral: "Floral (Hương Hoa Cỏ)",
                Woody: "Woody (Hương Gỗ)",
                Ambery: "Oriental (Hương Phương Đông)",
                "Aromatic Fougere": "Aromatic (Hương Thơm Ngát)",
                Leather: "Leather (Hương Da Thuộc)",
                Chypre: "Chypre",
              }[scentItem.name] || scentItem.name;

            scentTags.add(scentNameMap); // Chỉ thêm một giá trị
          }
        }

        if (selectedSubScents.length > 0) {
          selectedSubScents.forEach((id) => {
            const subScentItem = subScents.find((n) => n.id === id);
            if (subScentItem) {
              const subScentNameMap =
                {
                  Green: "Green",
                  Fruity: "Fruity (Trái Cây)",
                  Spicy: "Spicy (Hương Gia Vị)",
                  Watery: "Aquatic (Biển)",
                  Gourmand: "Sweet (Ngọt)",
                }[subScentItem.name] || subScentItem.name;

              scentTags.add(subScentNameMap);
            }
          });
        }

        console.log("Scent Tags cần tìm:", [...scentTags]);

        // Kiểm tra sản phẩm có đủ các muihuong_
        const scentMatch = [...scentTags].every((scent) =>
          productTags.some(
            (tag) => tag.startsWith("muihuong_") && tag.includes(scent)
          )
        );

        console.log("Scent Match:", scentMatch);

        if (!scentMatch) return false;
      }

      return true;
    });
  };

  return (
    <DataContext.Provider
      value={{
        //Budget
        budget,
        setBudget,
        budgetRange,
        formatPrice,

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
        scentRef,
        selectedScent,
        handleScentRemove,
        handleScentClick,

        //Sub-Scent
        selectedSubScents,
        setSelectedSubScents,
        toggleSubScent,

        //Filter Product
        filterProducts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
