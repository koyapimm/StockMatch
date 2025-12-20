"use client";

import { Product } from "@/lib/mockData";

type FilterState = {
  brands: string[];
  categories: string[];
  conditions: string[];
};

type SidebarFiltersProps = {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

export default function SidebarFilters({
  products,
  filters,
  onFiltersChange,
}: SidebarFiltersProps) {
  // Tüm benzersiz değerleri çıkar
  const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const allCategories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort();
  const allConditions = Array.from(
    new Set(products.map((p) => p.condition))
  ).sort();

  const toggleFilter = (
    type: keyof FilterState,
    value: string
  ) => {
    const current = filters[type];
    const newFilters = {
      ...filters,
      [type]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      categories: [],
      conditions: [],
    });
  };

  return (
    <aside className="w-full rounded-lg bg-white p-6 shadow-md lg:w-64">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Filtreler</h2>
        {(filters.brands.length > 0 ||
          filters.categories.length > 0 ||
          filters.conditions.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-slate-700">Marka</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 text-slate-600"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleFilter("brands", brand)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-slate-700">Kategori</h3>
        <div className="space-y-2">
          {allCategories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 text-slate-600"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleFilter("categories", category)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-700">Durum</h3>
        <div className="space-y-2">
          {allConditions.map((condition) => (
            <label
              key={condition}
              className="flex cursor-pointer items-center gap-2 text-slate-600"
            >
              <input
                type="checkbox"
                checked={filters.conditions.includes(condition)}
                onChange={() => toggleFilter("conditions", condition)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

