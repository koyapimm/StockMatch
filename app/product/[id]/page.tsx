"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import AuthWarningModal from "@/components/AuthWarningModal";
import NDAModal from "@/components/NDAModal";
import ProductCard from "@/components/ProductCard";
import { mockProducts, Product } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Star, ArrowRight } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const productId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "logistics">("description");
  
  // 3-Step Security Flow States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNDAModalOpen, setIsNDAModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  // Find product by ID
  const product = mockProducts.find((p) => p.id === productId);

  // If product not found, show 404
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Ürün Bulunamadı</h1>
          <p className="mb-8 text-slate-600">Aradığınız ürün mevcut değil.</p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Tüm Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  // Masked seller badge helper
  const getMaskedSellerBadge = (sellerName: string): string => {
    const hash = sellerName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `Supplier #${hash.toString().slice(-4)}`;
  };

  const maskedSeller = getMaskedSellerBadge(product.sellerName);
  const supplierId = maskedSeller.replace("Supplier #", "");

  // Generate thumbnail images (using same image for demo, in real app would have multiple)
  const imageUrls = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  // Get similar products (same category, exclude current product)
  const similarProducts = useMemo(() => {
    return mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // 3-Step Security Flow Handler
  const handleContactClick = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    
    // Step 1: Check if user is logged in
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Step 2: User is logged in, show NDA modal
    setIsNDAModalOpen(true);
  };

  // Handle NDA acceptance - proceed to contact form
  const handleNDAAccept = () => {
    setIsNDAModalOpen(false);
    // Step 3: Open contact form immediately after NDA acceptance
    setIsContactModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-slate-900">
            Ürünler
          </Link>
          <span>/</span>
          <span className="text-slate-900">{product.title}</span>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image
                src={imageUrls[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Condition Badge */}
              <div className="absolute left-4 top-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.condition === "Sıfır (Kapalı Kutu)"
                      ? "bg-green-100 text-green-800"
                      : product.condition === "Sıfır (Açık Kutu)"
                      ? "bg-emerald-100 text-emerald-800"
                      : product.condition === "Yeni Gibi"
                      ? "bg-blue-100 text-blue-800"
                      : product.condition === "Yenilenmiş"
                      ? "bg-orange-100 text-orange-800"
                      : product.condition === "İkinci El (Temiz)"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {imageUrls.slice(0, 4).map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-slate-900"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.title} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Sticky Action Card */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                {product.title}
              </h1>

              {/* Brand & Category */}
              <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold">{product.brand}</span>
                <span>•</span>
                <span>{product.subCategory}</span>
                {product.series && (
                  <>
                    <span>•</span>
                    <span>{product.series}</span>
                  </>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6 border-b border-slate-200 pb-6">
                <div className="mb-2 text-sm text-slate-600">Birim Fiyat</div>
                <div className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  {product.currency === "USD" ? "$" : "₺"}
                  {product.price.toLocaleString()}
                </div>
              </div>

              {/* Stock Info */}
              <div className="mb-6 rounded-lg bg-slate-100 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Mevcut Stok:</span>
                  <span className="font-semibold text-slate-900">
                    {product.stock} Adet
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Min Alım:</span>
                  <span className="font-semibold text-slate-900">1 Adet</span>
                </div>
              </div>

              {/* Seller Badge */}
              <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Onaylı Satıcı {maskedSeller.replace("Supplier #", "#")}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                        <span>(127 değerlendirme)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleContactClick(supplierId)}
                className="w-full rounded-lg bg-slate-900 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Satıcıyla İletişime Geç
              </button>

              {/* Part Number */}
              {product.partNumber && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="text-sm text-slate-600">Parça Numarası</div>
                  <div className="mt-1 font-mono text-base font-semibold text-slate-900">
                    {product.partNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className="mb-12">
          {/* Tab Buttons */}
          <div className="border-b border-slate-200">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "description"
                    ? "border-b-2 border-slate-900 text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ürün Açıklaması
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "specs"
                    ? "border-b-2 border-slate-900 text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Teknik Özellikler
              </button>
              <button
                onClick={() => setActiveTab("logistics")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "logistics"
                    ? "border-b-2 border-slate-900 text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lojistik
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-xl border border-slate-200 border-t-0 bg-white p-8">
            {activeTab === "description" && (
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700">
                  {product.title}, endüstriyel otomasyon sistemleri için yüksek
                  kaliteli bir {product.subCategory.toLowerCase()} ürünüdür.{" "}
                  {product.brand} markasının güvenilir ve dayanıklı ekipmanları
                  arasında yer alan bu ürün, profesyonel uygulamalar için
                  tasarlanmıştır.
                </p>
                <p className="mt-4 text-slate-600">
                  Ürün, fabrika ortamında kullanılmaya uygun olup, sertifikalı
                  ve garantilidir. Depolama koşullarına uygun şekilde
                  muhafaza edilmiştir. Detaylı teknik dökümanlar ve kullanım
                  kılavuzu ile birlikte teslim edilecektir.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-slate-600">Marka</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {product.brand}
                    </div>
                  </div>
                  {product.series && (
                    <div>
                      <div className="text-sm font-medium text-slate-600">Seri</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {product.series}
                      </div>
                    </div>
                  )}
                  {product.partNumber && (
                    <div>
                      <div className="text-sm font-medium text-slate-600">Parça Numarası</div>
                      <div className="mt-1 font-mono text-lg font-semibold text-slate-900">
                        {product.partNumber}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-600">Durum</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {product.condition}
                    </div>
                  </div>
                </div>

                {/* Dynamic Specs */}
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Teknik Detaylar
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm font-medium text-slate-600 capitalize">
                          {key}
                        </div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logistics" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Teslimat Bilgileri
                  </h3>
                  <div className="space-y-2 text-slate-600">
                    <p>• Kargo ile gönderim mevcuttur</p>
                    <p>• Stoktan teslim süresi: 1-3 iş günü</p>
                    <p>• Özel kargo sigortası dahildir</p>
                    <p>• Paketleme: Endüstriyel standartlarda korumalı paketleme</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Depolama
                  </h3>
                  <div className="space-y-2 text-slate-600">
                    <p>• Lokasyon: İstanbul, Türkiye</p>
                    <p>• Depo koşulları: Kuru ve güvenli ortam</p>
                    <p>• Sıcaklık kontrolü: 15-25°C</p>
                  </div>
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
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-600"
              >
                Tümünü Gör
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals - 3-Step Security Flow */}
      <AuthWarningModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <NDAModal
        isOpen={isNDAModalOpen}
        onClose={() => setIsNDAModalOpen(false)}
        onAccept={handleNDAAccept}
      />
      
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        supplierId={selectedSupplierId}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

