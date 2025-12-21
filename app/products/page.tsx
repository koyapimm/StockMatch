"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarFilters from "@/components/SidebarFilters";
import ProductGrid from "@/components/ProductGrid";
import { mockProducts, Product } from "@/lib/mockData";

type FilterState = {
  brands: string[];
  categories: string[];
  subCategories: string[];
  conditions: string[];
  specs: {
    [key: string]: string[];
  };
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    categories: [],
    subCategories: [],
    conditions: [],
    specs: {},
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Filtreleme ve arama mantığı
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Marka filtresi
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Kategori filtresi
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Alt kategori filtresi
    if (filters.subCategories.length > 0) {
      result = result.filter((p) =>
        filters.subCategories.includes(p.subCategory)
      );
    }

    // Durum filtresi
    if (filters.conditions.length > 0) {
      result = result.filter((p) => filters.conditions.includes(p.condition));
    }

    // Specs filtresi (dinamik özellikler)
    Object.keys(filters.specs).forEach((specKey) => {
      if (filters.specs[specKey].length > 0) {
        result = result.filter((p) => {
          const specValue = p.specs[specKey];
          return specValue && filters.specs[specKey].includes(specValue);
        });
      }
    });

    // Arama sorgusu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.partNumber?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.subCategory.toLowerCase().includes(query) ||
          p.series?.toLowerCase().includes(query)
      );
    }

    // Sıralama
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [filters, searchQuery, sortBy]);


  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Tüm Endüstriyel İlanlar
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {filteredProducts.length} ürün bulundu
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-slate-700">
              Sırala:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name-asc">İsim: A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid Layout - 12 columns */}
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - 3 columns on large screens */}
          <div className="col-span-12 lg:col-span-3">
            <SidebarFilters
              products={mockProducts}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Product Grid - 9 columns on large screens */}
          <div className="col-span-12 lg:col-span-9" id="products">
            <ProductGrid
              products={filteredProducts}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

