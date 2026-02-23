"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { productApi, ProductDto, getApiImageUrl } from "@/lib/api";
import { Cpu, Activity, Monitor, Zap, Scan, Bot, ArrowRight, TrendingUp, Leaf, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.search({ pageSize: 4 });
        if (response.success) {
          setFeaturedProducts(response.products);
        }
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Ürünler yüklenirken bir hata oluştu.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  const categories = [
    { name: "PLC & CPU", icon: Cpu, color: "bg-blue-100 text-blue-600" },
    { name: "Motor & Motion", icon: Activity, color: "bg-purple-100 text-purple-600" },
    { name: "HMI Panels", icon: Monitor, color: "bg-green-100 text-green-600" },
    { name: "Drivers (Sürücüler)", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
    { name: "Sensors", icon: Scan, color: "bg-pink-100 text-pink-600" },
    { name: "Robotics", icon: Bot, color: "bg-indigo-100 text-indigo-600" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/products");
    }
  };

  const getConditionBadge = (condition: string) => {
    const isNew = condition.toLowerCase().includes("sıfır");
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${isNew ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
      >
        {isNew ? "Sıfır" : "İkinci El"}
      </span>
    );
  };

  const getProductImage = (product: ProductDto) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return getApiImageUrl(primaryImage.imageUrl);
    }
    return "/placeholder-product.jpg";
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₺";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
              Endüstriyel Atıl Stoklarınızı Nakde Çevirin
            </h1>
            <p className="mb-8 text-lg text-slate-600 sm:text-xl">
              Deponuzda bekleyen otomasyon ekipmanlarını ekonomiye kazandırın.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative mx-auto max-w-2xl">
                <input
                  type="text"
                  placeholder="Ürün, marka veya parça numarası ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-lg text-slate-900 shadow-lg placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white transition-colors hover:bg-slate-800"
                  aria-label="Ara"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-center sm:gap-8">
              <div>
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">10k+</div>
                <div className="mt-1 text-xs text-slate-600 sm:text-sm">Parça</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">500+</div>
                <div className="mt-1 text-xs text-slate-600 sm:text-sm">Firma</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">₺25M+</div>
                <div className="mt-1 text-xs text-slate-600 sm:text-sm">Hacim</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Kategorilere Göz Atın
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href="/products"
                  className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:shadow-md"
                >
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16 ${category.color} transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 sm:text-sm md:text-base">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-left sm:text-4xl">
              Öne Çıkan Ürünler
            </h2>
            <Link
              href="/products"
              className="hidden text-sm font-semibold text-slate-900 hover:text-slate-600 sm:block"
            >
              Tümünü Gör →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-5">
                    <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
                    <div className="h-8 w-1/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Henüz ürün bulunmuyor.</p>
              <Link href="/register" className="mt-4 inline-block text-slate-900 font-semibold hover:underline">
                İlk ürününüzü ekleyin →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <Image
                      src={getProductImage(product)}
                      alt={product.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute left-3 top-3">
                      {getConditionBadge(product.condition)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="mb-4 text-xs text-slate-500">
                      {product.brand || "Marka Belirtilmemiş"} • {product.categoryName}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-900">
                        {getCurrencySymbol(product.currency)}
                        {product.unitPrice.toLocaleString()}
                      </span>
                      <Link
                        href={`/product/${product.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-800"
                        aria-label="Detay"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Neden StockMatch?
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 sm:h-20 sm:w-20">
                <TrendingUp className="h-8 w-8 text-slate-900 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
                Maliyetten Kazanç
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">
                Ölü stoklarınızı nakite çevirin.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 sm:h-20 sm:w-20">
                <Leaf className="h-8 w-8 text-slate-900 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
                Sürdürülebilirlik
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">
                Atık yönetimini optimize edin.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 sm:h-20 sm:w-20">
                <Shield className="h-8 w-8 text-slate-900 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
                Güvenli Ticaret
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">
                Onaylı kurumsal satıcılar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - only show when not logged in */}
      {!isLoggedIn && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-slate-900 px-4 py-12 text-center text-white sm:px-8 sm:py-16 md:px-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
                Platformumuza Katılın
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base text-slate-300 sm:text-lg md:text-xl">
                Kurumsal üyelik oluşturarak stoklarınızı değerlendirmeye başlayın.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/register"
                  className="w-full rounded-lg bg-orange-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-700 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Üye Ol
                </Link>
                <Link
                  href="/products"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Ürünleri Gör
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
