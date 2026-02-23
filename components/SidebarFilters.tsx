"use client";

import { useState, useEffect } from "react";
import { CategoryDto, categoryApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { ChevronDown } from "lucide-react";

type FilterState = {
  categoryId?: number;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
};

type SidebarFiltersProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableBrands?: string[];
};

const CONDITIONS = [
  "Sıfır",
  "Yeni Gibi",
  "Yenilenmiş",
  "İkinci El",
  "Kullanılmış",
];

export default function SidebarFilters({
  filters,
  onFiltersChange,
  availableBrands = [],
}: SidebarFiltersProps) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        if (response.success) {
          setCategories(response.categories);
          const parentIds = response.categories
            .filter(c => !c.parentCategoryId)
            .map(c => c.id);
          setExpandedCategories(parentIds);
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Kategoriler yüklenirken bir hata oluştu.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    // Kategori API artık önbellekli - tek seferlik yükleme yeterli
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const handleBrandSelect = (brand: string) => {
    onFiltersChange({
      ...filters,
      brand: filters.brand === brand ? undefined : brand,
    });
  };

  const handleConditionSelect = (condition: string) => {
    onFiltersChange({
      ...filters,
      condition: filters.condition === condition ? undefined : condition,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.categoryId || filters.brand || filters.condition || filters.minPrice || filters.maxPrice;

  // Ana kategoriler (parent yok)
  const parentCategories = categories.filter(c => !c.parentCategoryId);

  // Alt kategorileri getir
  const getSubCategories = (parentId: number) => {
    return categories.filter(c => c.parentCategoryId === parentId);
  };

  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:w-64">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Filtreler</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-slate-700">Kategoriler</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {parentCategories.map((category) => {
              const subCategories = getSubCategories(category.id);
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <div key={category.id} className="border-b border-slate-100 last:border-b-0">
                  {/* Main Category */}
                  <button
                    onClick={() => subCategories.length > 0 ? toggleCategory(category.id) : handleCategorySelect(category.id)}
                    className="flex w-full items-center justify-between py-2 text-left text-slate-700 hover:text-slate-900"
                  >
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.categoryId === category.id}
                        onChange={() => handleCategorySelect(category.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="font-medium">{category.name}</span>
                    </label>
                    {subCategories.length > 0 && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Sub-Categories */}
                  {isExpanded && subCategories.length > 0 && (
                    <div className="ml-6 space-y-1 pb-2">
                      {subCategories.map((subCat) => (
                        <label
                          key={subCat.id}
                          className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-600"
                        >
                          <input
                            type="checkbox"
                            checked={filters.categoryId === subCat.id}
                            onChange={() => handleCategorySelect(subCat.id)}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                          <span>{subCat.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-slate-700">Marka</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2 text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={() => handleBrandSelect(brand)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Condition Filter */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-700">Durum</h3>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <label
              key={condition}
              className="flex cursor-pointer items-center gap-2 text-slate-600"
            >
              <input
                type="checkbox"
                checked={filters.condition === condition}
                onChange={() => handleConditionSelect(condition)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
