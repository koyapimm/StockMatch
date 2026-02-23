"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarFilters from "@/components/SidebarFilters";
import ProductGrid from "@/components/ProductGrid";
import { useToast } from "@/contexts/ToastContext";
import { productApi, ProductDto } from "@/lib/api";
import { Search } from "lucide-react";

type FilterState = {
  categoryId?: number;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { showToast } = useToast();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState(keyword);
  const [inputValue, setInputValue] = useState(keyword);

  // URL'deki keyword değiştiğinde arama alanı ve sorguyu güncelle
  useEffect(() => {
    const kw = searchParams.get("keyword") || "";
    setSearchQuery(kw);
    setInputValue(kw);
  }, [searchParams]);

  // Debounce ile ürün araması - rate limit aşımını önler (400ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const response = await productApi.search({
            keyword: searchQuery || undefined,
            categoryId: filters.categoryId,
            brand: filters.brand,
            condition: filters.condition,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            pageSize: 50,
          });
          if (response.success) {
            setProducts(response.products);
          }
        } catch (err) {
          showToast(err instanceof Error ? err.message : "Ürünler yüklenirken bir hata oluştu.", "error");
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }, 400);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showToast stabil, sadece arama/filtre değişince fetch
  }, [searchQuery, filters.categoryId, filters.brand, filters.condition, filters.minPrice, filters.maxPrice]);

  // Sıralama
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.unitPrice - b.unitPrice);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.unitPrice - a.unitPrice);
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [products, sortBy]);

  // Mevcut markalar
  const availableBrands = useMemo(() => {
    const brands = new Set(products.filter(p => p.brand).map(p => p.brand!));
    return Array.from(brands).sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Arama kutusu */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(inputValue.trim() || "");
            }}
            className="relative max-w-xl"
          >
            <input
              type="text"
              name="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ürün, marka veya parça numarası ara..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Ara"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Tüm Endüstriyel İlanlar
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {sortedProducts.length} ürün bulundu
              {searchQuery && ` - "${searchQuery}" için sonuçlar`}
            </p>
          </div>

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
              <option value="newest">En Yeni</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name-asc">İsim: A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3">
            <SidebarFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableBrands={availableBrands}
            />
          </div>

          <div className="col-span-12 lg:col-span-9" id="products">
            <ProductGrid products={sortedProducts} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
              <p className="text-sm text-slate-600">Yükleniyor...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
