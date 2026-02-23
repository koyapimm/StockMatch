"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { productApi, contactRequestApi, ProductDto, ContactRequestDto } from "@/lib/api";
import { getCompanyStatusBadge, getProductStatusBadge, getRequestStatusBadge, formatCurrency } from "@/lib/utils";
import { Package, MessageSquare, Building2, Plus, ArrowRight, Eye, EyeOff, Edit2, Trash2, Send, Phone, Mail, Settings } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn, isLoading: authLoading, user, company } = useAuth();
  const [myProducts, setMyProducts] = useState<ProductDto[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ContactRequestDto[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return;

      try {
        const [productsRes, receivedRes, sentRes] = await Promise.all([
          productApi.getMyProducts(),
          contactRequestApi.getReceived(),
          contactRequestApi.getSent(),
        ]);

        if (productsRes.success) setMyProducts(productsRes.products);
        if (receivedRes.success) setReceivedRequests(receivedRes.contactRequests);
        if (sentRes.success) setSentRequests(sentRes.contactRequests);
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Veriler yüklenirken bir hata oluştu.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && company) {
      fetchData();
    } else if (isLoggedIn && !company) {
      setIsLoading(false);
    }
  }, [isLoggedIn, company, showToast]);

  const handlePublish = async (productId: number) => {
    setActionLoading(productId);
    try {
      const response = await productApi.publish(productId);
      if (response.success) {
        setMyProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: 2 } : p))
        );
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Yayınlama hatası.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (productId: number) => {
    setActionLoading(productId);
    try {
      const response = await productApi.unpublish(productId);
      if (response.success) {
        setMyProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: 4 } : p))
        );
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Yayından kaldırma hatası.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (productId: number) => {
    setActionLoading(productId);
    try {
      const response = await productApi.delete(productId);
      if (response.success) {
        setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Silme hatası.", "error");
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  if (authLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
        <p className="mt-4 text-slate-600">Yükleniyor...</p>
      </div>
    );
  }

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 1).length;
  const activeProductsCount = myProducts.filter((p) => p.status === 2).length;
  const companyStatus = company ? getCompanyStatusBadge(company.verificationStatus) : null;

  // Firma bilgisi yoksa sadece bunu göster
  if (!company) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Building2 className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-amber-900 sm:text-2xl">
              Firma Bilgileri Eksik
            </h2>
            <p className="mt-3 text-amber-800">
              Platformu kullanabilmek için önce firma bilgilerinizi tamamlamanız gerekmektedir.
              Ürün ekleme, iletişim talebi gönderme ve diğer tüm işlemler firma kaydı ile mümkündür.
            </p>
            <Link
              href="/setup-company"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Firma Bilgilerini Tamamla <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="mt-1 text-slate-600">{company.name}</p>
        </div>

        {company.verificationStatus === 4 && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">Firma Başvurusu Reddedildi</h3>
                <p className="mt-1 text-sm text-red-700">
                  {company.verificationRejectionReason || "Firma başvurunuz incelendikten sonra reddedilmiştir."}
                </p>
                <Link
                  href="/dashboard/company"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-800 hover:underline"
                >
                  Firma Bilgilerini Güncelle <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-slate-900">{myProducts.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Aktif İlan</p>
                <p className="text-2xl font-bold text-slate-900">{activeProductsCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-3">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Gelen Talepler</p>
                <p className="text-2xl font-bold text-slate-900">
                  {receivedRequests.length}
                  {pendingReceivedCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-orange-600">({pendingReceivedCount} yeni)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Firma Durumu</p>
                <span
                  className={`inline-block mt-1 rounded-full px-3 py-1 text-sm font-semibold ${
                    companyStatus ? companyStatus.color : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {companyStatus?.label ?? "Tamamlanmadı"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> Yeni Ürün Ekle
            </Link>
            <Link
              href="/dashboard/requests"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <MessageSquare className="h-4 w-4" /> Taleplerim
            </Link>
            <Link
              href="/dashboard/company"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Building2 className="h-4 w-4" /> Firma Bilgileri
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" /> Profil & Şifre
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Son Ürünlerim</h2>
              {myProducts.length > 0 && (
                <Link
                  href="/dashboard/products"
                  className="text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  Tümünü Gör →
                </Link>
              )}
            </div>
            {isLoading ? (
              <p className="text-slate-500">Yükleniyor...</p>
            ) : myProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-500">Henüz ürün eklemediniz</p>
                <Link
                  href="/dashboard/products/new"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
                >
                  <Plus className="h-4 w-4" /> İlk ürününüzü ekleyin
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myProducts.slice(0, 5).map((product) => {
                  const badge = getProductStatusBadge(product.status);
                  const canPublish = product.status === 1 || product.status === 4;
                  const canUnpublish = product.status === 2;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                    >
                      <Link
                        href={`/product/${product.id}`}
                        className="min-w-0 flex-1"
                      >
                        <p className="truncate font-medium text-slate-900 hover:text-slate-600">{product.title}</p>
                        <p className="text-sm text-slate-500">
                          {formatCurrency(product.unitPrice, product.currency)} • {product.quantity} adet
                        </p>
                      </Link>
                      <span className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        {canPublish && (
                          <button
                            onClick={() => handlePublish(product.id)}
                            disabled={actionLoading === product.id}
                            className="rounded p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            title="Yayınla"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {canUnpublish && (
                          <button
                            onClick={() => handleUnpublish(product.id)}
                            disabled={actionLoading === product.id}
                            className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
                            title="Yayından Kaldır"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        )}
                        {product.status !== 3 && (
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                            title="Düzenle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        )}
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={actionLoading === product.id}
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Sil
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-300"
                            >
                              İptal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Gelen Talepler</h2>
              {receivedRequests.length > 0 && (
                <Link
                  href="/dashboard/requests?tab=received"
                  className="text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  Tümünü Gör →
                </Link>
              )}
            </div>
            {isLoading ? (
              <p className="text-slate-500">Yükleniyor...</p>
            ) : receivedRequests.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-500">Henüz iletişim talebi almadınız</p>
              </div>
            ) : (
              <div className="space-y-3">
                {receivedRequests.slice(0, 5).map((request) => {
                  const badge = getRequestStatusBadge(request.status);
                  return (
                    <Link
                      key={request.id}
                      href="/dashboard/requests?tab=received"
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{request.buyerCompanyName}</p>
                        <p className="truncate text-sm text-slate-500">{request.productTitle}</p>
                      </div>
                      <span className={`ml-3 flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Gönderilen Talepler</h2>
              {sentRequests.length > 0 && (
                <Link
                  href="/dashboard/requests?tab=sent"
                  className="text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  Tümünü Gör →
                </Link>
              )}
            </div>
            {isLoading ? (
              <p className="text-slate-500">Yükleniyor...</p>
            ) : sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Send className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-500">Henüz talep göndermediniz</p>
                <Link
                  href="/products"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
                >
                  Ürünleri İncele →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {[...sentRequests]
                  .sort((a, b) => {
                    const order = (s: number) => (s === 2 ? 0 : s === 1 ? 1 : s === 3 ? 2 : 3);
                    return order(a.status) - order(b.status);
                  })
                  .slice(0, 5)
                  .map((request) => {
                  const badge = getRequestStatusBadge(request.status);
                  const isApproved = request.status === 2;
                  return (
                    <div
                      key={request.id}
                      className={`rounded-lg border p-3 transition-colors ${
                        isApproved ? "border-green-200 bg-green-50/50" : "border-slate-100"
                      }`}
                    >
                      <Link
                        href="/dashboard/requests?tab=sent"
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900 hover:text-slate-600">{request.productTitle}</p>
                          <p className="text-sm text-slate-500">{request.sellerCompanyName || "—"}</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </Link>
                      {isApproved && (request.sellerPhone || request.sellerEmail) && (
                        <div className="mt-3 space-y-1 border-t border-green-200 pt-3">
                          <p className="text-xs font-medium text-green-800">Satıcı ile iletişime geçin:</p>
                          {request.sellerPhone && (
                            <a
                              href={`tel:${request.sellerPhone}`}
                              className="flex items-center gap-1.5 text-sm text-green-700 hover:underline"
                            >
                              <Phone className="h-3.5 w-3.5" /> {request.sellerPhone}
                            </a>
                          )}
                          {request.sellerEmail && (
                            <a
                              href={`mailto:${request.sellerEmail}`}
                              className="flex items-center gap-1.5 text-sm text-green-700 hover:underline"
                            >
                              <Mail className="h-3.5 w-3.5" /> {request.sellerEmail}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
