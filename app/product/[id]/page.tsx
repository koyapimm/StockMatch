"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import AuthWarningModal from "@/components/AuthWarningModal";
import NDAModal from "@/components/NDAModal";
import ProductCard from "@/components/ProductCard";
import { productApi, ProductDto, getApiImageUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ArrowRight } from "lucide-react";

const COMPANY_APPROVED = 3; // verificationStatus değeri

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id, 10);
  const { isLoggedIn, company } = useAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "logistics">("description");
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNDAModalOpen, setIsNDAModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (isNaN(productId) || productId < 1) {
      setIsLoading(false);
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getById(productId);
        if (response.success && response.product) {
          setProduct(response.product);

          const similarResponse = await productApi.search({
            categoryId: response.product.categoryId,
            pageSize: 4,
          });
          if (similarResponse.success) {
            setSimilarProducts(
              similarResponse.products.filter((p) => p.id !== productId).slice(0, 4)
            );
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Ürün yüklenirken bir hata oluştu.", "error");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, showToast]);

  const handleContactClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!company) {
      setIsAuthModalOpen(true);
      return;
    }
    if (company.verificationStatus !== COMPANY_APPROVED) {
      showToast("İletişim talebi göndermek için firmanızın onaylanmış olması gerekiyor.", "error");
      return;
    }
    setIsNDAModalOpen(true);
  };

  const handleNDAAccept = () => {
    setIsNDAModalOpen(false);
    setIsContactModalOpen(true);
  };

  const getConditionBadgeClass = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("sıfır") && c.includes("kapalı")) return "bg-green-100 text-green-800";
    if (c.includes("sıfır") && c.includes("açık")) return "bg-emerald-100 text-emerald-800";
    if (c.includes("yeni gibi")) return "bg-blue-100 text-blue-800";
    if (c.includes("yenilenmiş")) return "bg-orange-100 text-orange-800";
    if (c.includes("ikinci el")) return "bg-gray-100 text-gray-800";
    return "bg-red-100 text-red-800";
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₺";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            <p className="text-sm text-slate-600">Ürün yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
          <h1 className="mb-4 text-2xl font-bold text-slate-900 sm:text-4xl">Ürün Bulunamadı</h1>
          <p className="mb-8 text-slate-600">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Tüm Ürünlere Dön
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrls = product.images && product.images.length > 0
    ? [...product.images]
        .sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : (a.displayOrder || 0) - (b.displayOrder || 0)))
        .map((img) => getApiImageUrl(img.imageUrl))
    : ["/placeholder-product.jpg"];

  const hasMultipleImages = imageUrls.length > 1;
  const goToPrev = () => setSelectedImageIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
  const goToNext = () => setSelectedImageIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-slate-900">Ürünler</Link>
          <span>/</span>
          <span className="text-slate-900">{product.title}</span>
        </div>

        {/* Main Content */}
        <div className="mb-12 grid min-w-0 gap-8 lg:grid-cols-2">
          {/* Left - Görsel Galerisi (10 fotoğrafa kadar) */}
          <div className="min-w-0 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image
                src={imageUrls[selectedImageIndex]}
                alt={`${product.title} - Görsel ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-4 top-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getConditionBadgeClass(product.condition)}`}>
                  {product.condition}
                </span>
              </div>
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
                    aria-label="Önceki görsel"
                  >
                    <ArrowRight className="h-5 w-5 -rotate-180 text-slate-900" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
                    aria-label="Sonraki görsel"
                  >
                    <ArrowRight className="h-5 w-5 text-slate-900" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                    {selectedImageIndex + 1} / {imageUrls.length}
                  </div>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-2">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index ? "border-slate-900 ring-2 ring-slate-900/30" : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.title} - Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Info Card */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="mb-4 break-words text-3xl font-bold text-slate-900 sm:text-4xl">{product.title}</h1>

              <div className="mb-6 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold">{product.brand || "Marka Belirtilmemiş"}</span>
                <span>•</span>
                <span>{product.categoryName}</span>
                {product.model && (
                  <>
                    <span>•</span>
                    <span>{product.model}</span>
                  </>
                )}
              </div>

              <div className="mb-6 border-b border-slate-200 pb-6">
                <div className="mb-2 text-sm text-slate-600">Birim Fiyat</div>
                <div className="break-words text-4xl font-bold text-slate-900 sm:text-5xl">
                  {getCurrencySymbol(product.currency)}
                  {product.unitPrice.toLocaleString()}
                </div>
              </div>

              <div className="mb-6 rounded-lg bg-slate-100 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Mevcut Stok:</span>
                  <span className="font-semibold text-slate-900">{product.quantity} Adet</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-600">Min Alım:</span>
                  <span className="font-semibold text-slate-900">{product.minimumOrderQuantity} Adet</span>
                </div>
              </div>

              <button
                onClick={handleContactClick}
                className="mb-4 w-full rounded-lg bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Satıcıyla İletişime Geç
              </button>

              {product.partNumber && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="text-sm text-slate-600">Parça Numarası</div>
                  <div className="mt-1 font-mono text-base font-semibold text-slate-900">{product.partNumber}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12 min-w-0">
          <div className="min-w-0 overflow-hidden border-b border-slate-200">
            <div className="flex min-w-0 gap-1">
              {[
                { key: "description", label: "Ürün Açıklaması" },
                { key: "specs", label: "Teknik Özellikler" },
                { key: "logistics", label: "Lojistik" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 border-slate-900 text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 border-t-0 bg-white p-6 sm:p-8">
            {activeTab === "description" && (
              <div className="prose prose-slate max-w-none break-words">
                <p className="text-lg text-slate-700">{product.description}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-slate-600">Marka</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{product.brand || "-"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600">Model</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{product.model || "-"}</div>
                  </div>
                  {product.partNumber && (
                    <div>
                      <div className="text-sm font-medium text-slate-600">Parça Numarası</div>
                      <div className="mt-1 font-mono text-lg font-semibold text-slate-900">{product.partNumber}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-600">Durum</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{product.condition}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logistics" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Teslimat Bilgileri</h3>
                  <div className="space-y-2 text-slate-600">
                    <p>• Kargo ile gönderim mevcuttur</p>
                    <p>• Stoktan teslim süresi: 1-3 iş günü</p>
                    <p>• Özel kargo sigortası dahildir</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Lokasyon</h3>
                  <p className="text-slate-600">{product.region}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Benzer İlanlar</h2>
              <Link href="/products" className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-600">
                Tümünü Gör <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthWarningModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        needsLogin={!isLoggedIn}
      />
      <NDAModal isOpen={isNDAModalOpen} onClose={() => setIsNDAModalOpen(false)} onAccept={handleNDAAccept} />
      {product && (
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          productId={product.id}
          productTitle={product.title}
        />
      )}

      <Footer />
    </div>
  );
}
