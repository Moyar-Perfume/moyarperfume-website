"use client";

import ComingSoon from "@/components/shared/ComingSoon";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

import { FilterContext } from "@/contexts/FilterContext";

export default function ProductListPage() {
  return (
    <FilterContext>
      <ProductFilter />
      <ProductList />
    </FilterContext>

    // <ComingSoon />
  );
}
