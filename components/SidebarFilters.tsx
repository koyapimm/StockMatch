"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/mockData";

type FilterState = {
  brands: string[];
  categories: string[];
  subCategories: string[];
  conditions: string[];
  specs: {
    [key: string]: string[];
  };
};

type SidebarFiltersProps = {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

// Hiyerarşik kategori yapısı
const categoryStructure = {
  "Automation Systems": ["PLC CPU", "HMI", "Sensors"],
  "Motor & Motion": ["Servo Motors"],
  "Energy & Power": ["AC Drives (VFD)", "Circuit Breakers", "Safety Relays"],
};

export default function SidebarFilters({
  products,
  filters,
  onFiltersChange,
}: SidebarFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Automation Systems",
    "Motor & Motion",
    "Energy & Power",
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Dinamik attribute'ları çıkar (mevcut kategori/subCategory filtrelerine göre)
  const relevantProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.subCategories.length > 0) {
      result = result.filter((p) =>
        filters.subCategories.includes(p.subCategory)
      );
    }

    return result;
  }, [products, filters.categories, filters.subCategories]);

  // Dinamik attribute'ları çıkar (kategori/subCategory'ye göre ilgili ürünlerden)
  const dynamicAttributes = useMemo(() => {
    const attributes: { [key: string]: Set<string> } = {};

    relevantProducts.forEach((product) => {
      Object.keys(product.specs).forEach((specKey) => {
        const specValue = product.specs[specKey];
        if (specValue) {
          if (!attributes[specKey]) {
            attributes[specKey] = new Set();
          }
          attributes[specKey].add(specValue);
        }
      });
    });

    return attributes;
  }, [relevantProducts]);

  // Hangi attribute'ları göstereceğimize karar ver
  const shouldShowAttribute = (attrKey: string): boolean => {
    // Eğer kategori veya subCategory seçilmişse ve ilgili attribute'ları göster
    if (filters.categories.length === 0 && filters.subCategories.length === 0) {
      return false;
    }

    const selectedSubCategories = filters.subCategories.length > 0
      ? filters.subCategories
      : Array.from(new Set(relevantProducts.map((p) => p.subCategory)));

    // Motor & Motion veya Servo Motors seçilmişse Power ve RPM göster
    if (
      selectedSubCategories.some((sc) =>
        ["Servo Motors"].includes(sc)
      ) ||
      filters.categories.includes("Motor & Motion")
    ) {
      return ["power", "voltage", "rpm"].includes(attrKey.toLowerCase());
    }

    // Automation Systems veya PLC seçilmişse Communication göster
    if (
      selectedSubCategories.some((sc) => ["PLC CPU"].includes(sc)) ||
      filters.categories.includes("Automation Systems")
    ) {
      return ["communication", "inputs", "outputs"].includes(attrKey.toLowerCase());
    }

    // AC Drives seçilmişse Power ve Frequency göster
    if (
      selectedSubCategories.some((sc) =>
        ["AC Drives (VFD)"].includes(sc)
      )
    ) {
      return ["power", "voltage", "frequency"].includes(attrKey.toLowerCase());
    }

    return false;
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    if (type === "specs") return; // Specs için özel işlem yapılacak

    const current = filters[type] as string[];
    const newFilters = {
      ...filters,
      [type]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    };
    onFiltersChange(newFilters);
  };

  const toggleSpecFilter = (specKey: string, specValue: string) => {
    const currentSpecs = filters.specs[specKey] || [];
    const newSpecs = {
      ...filters.specs,
      [specKey]: currentSpecs.includes(specValue)
        ? currentSpecs.filter((v) => v !== specValue)
        : [...currentSpecs, specValue],
    };
    onFiltersChange({ ...filters, specs: newSpecs });
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      categories: [],
      subCategories: [],
      conditions: [],
      specs: {},
    });
  };

  const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const allConditions = Array.from(
    new Set(products.map((p) => p.condition))
  ).sort();

  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:w-64">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Filtreler</h2>
        {(filters.brands.length > 0 ||
          filters.categories.length > 0 ||
          filters.subCategories.length > 0 ||
          filters.conditions.length > 0 ||
          Object.keys(filters.specs).some((k) => filters.specs[k].length > 0)) && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Category Accordion */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-slate-700">Kategoriler</h3>
        <div className="space-y-1">
          {Object.keys(categoryStructure).map((category) => {
            const isExpanded = expandedCategories.includes(category);
            const subCategories = categoryStructure[category as keyof typeof categoryStructure];

            return (
              <div key={category} className="border-b border-slate-100 last:border-b-0">
                {/* Main Category */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between py-2 text-left text-slate-700 hover:text-slate-900"
                >
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleFilter("categories", category);
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="font-medium">{category}</span>
                  </label>
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sub-Categories */}
                {isExpanded && (
                  <div className="ml-6 space-y-1 pb-2">
                    {subCategories.map((subCat) => (
                      <label
                        key={subCat}
                        className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={filters.subCategories.includes(subCat)}
                          onChange={() => toggleFilter("subCategories", subCat)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <span>{subCat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dynamic Attribute Filters */}
      {Object.keys(dynamicAttributes).map((attrKey) => {
        if (!shouldShowAttribute(attrKey)) return null;

        const attrValues = Array.from(dynamicAttributes[attrKey]).sort();
        const displayName = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);

        return (
          <div key={attrKey} className="mb-6">
            <h3 className="mb-3 font-semibold text-slate-700">{displayName}</h3>
            <div className="space-y-2">
              {attrValues.map((attrValue) => (
                <label
                  key={attrValue}
                  className="flex cursor-pointer items-center gap-2 text-slate-600"
                >
                    <input
                      type="checkbox"
                      checked={
                        filters.specs[attrKey]?.includes(attrValue) || false
                      }
                      onChange={() => toggleSpecFilter(attrKey, attrValue)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                  <span className="text-sm">{attrValue}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

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
