"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SidebarFilters from "@/components/SidebarFilters";
import ProductGrid from "@/components/ProductGrid";
import { mockProducts, Product } from "@/lib/mockData";

type FilterState = {
  brands: string[];
  categories: string[];
  conditions: string[];
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    categories: [],
    conditions: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

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

    // Durum filtresi
    if (filters.conditions.length > 0) {
      result = result.filter((p) => filters.conditions.includes(p.condition));
    }

    // Arama sorgusu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.partNumber?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64">
            <SidebarFilters
              products={mockProducts}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Ürünler ({filteredProducts.length})
              </h2>
            </div>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
