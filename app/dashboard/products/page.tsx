"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { productApi, ProductDto, getApiImageUrl } from "@/lib/api";
import { getProductStatusBadge, formatCurrency } from "@/lib/utils";
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, AlertCircle } from "lucide-react";

export default function MyProductsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, company } = useAuth();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [authLoading, isLoggedIn, router]);

    useEffect(() => {
        if (!authLoading && isLoggedIn && !company) {
            router.push("/setup-company");
        }
    }, [authLoading, isLoggedIn, company, router]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoggedIn) return;
            try {
                const response = await productApi.getMyProducts();
                if (response.success) {
                    setProducts(response.products);
                }
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Ürünler yüklenirken bir hata oluştu.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchProducts();
        }
    }, [isLoggedIn, showToast]);

    const handlePublish = async (productId: number) => {
        setActionLoading(productId);
        try {
            const response = await productApi.publish(productId);
            if (response.success) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === productId ? { ...p, status: 2 } : p))
                );
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Yayınlama hatası.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnpublish = async (productId: number) => {
        setActionLoading(productId);
        try {
            const response = await productApi.unpublish(productId);
            if (response.success) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === productId ? { ...p, status: 4 } : p))
                );
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Yayından kaldırma hatası.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (productId: number) => {
        setActionLoading(productId);
        try {
            const response = await productApi.delete(productId);
            if (response.success) {
                setProducts((prev) => prev.filter((p) => p.id !== productId));
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Silme hatası.", "error");
        } finally {
            setActionLoading(null);
            setDeleteConfirm(null);
        }
    };

    if (authLoading || !isLoggedIn || (!company && isLoggedIn)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
        );
    }

    const canAddProduct = company && company.verificationStatus === 3;

    return (
        <div className=" bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ürünlerim</h1>
                        <p className="mt-1 text-slate-600">{products.length} ürün listelendi</p>
                    </div>

                    {canAddProduct ? (
                        <Link
                            href="/dashboard/products/new"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            <Plus className="h-4 w-4" /> Yeni Ürün Ekle
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-yellow-700">
                            <AlertCircle className="h-4 w-4" />
                            Ürün eklemek için firma onayı gerekli
                        </div>
                    )}
                </div>

                {!company && (
                    <div className="mb-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-yellow-800">Firma Bilgileri Eksik</h3>
                                <p className="mt-1 text-sm text-yellow-700">
                                    Ürün ekleyebilmek için önce firma bilgilerinizi tamamlamanız gerekiyor.
                                </p>
                                <Link
                                    href="/dashboard/company"
                                    className="mt-2 inline-block text-sm font-medium text-yellow-800 hover:underline"
                                >
                                    Firma Bilgilerini Ekle →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {company && company.verificationStatus !== 3 && (
                    <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-800">Firma Onayı Bekliyor</h3>
                                <p className="mt-1 text-sm text-blue-700">
                                    Firma bilgileriniz inceleniyor. Onaylandıktan sonra ürün ekleyebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-pulse">
                            <div className="mx-auto h-8 w-48 rounded bg-slate-200" />
                            <div className="mx-auto mt-4 h-4 w-32 rounded bg-slate-200" />
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <Package className="mx-auto h-16 w-16 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">Henüz Ürün Yok</h3>
                        <p className="mt-2 text-slate-600">İlk ürününüzü ekleyerek satışa başlayın.</p>
                        {canAddProduct && (
                            <Link
                                href="/dashboard/products/new"
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <Plus className="h-4 w-4" /> Yeni Ürün Ekle
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {products.map((product) => {
                                    const statusBadge = getProductStatusBadge(product.status);
                                    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                        <Image
                                                            src={getApiImageUrl(primaryImage?.imageUrl)}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/product/${product.id}`}
                                                            className="font-medium text-slate-900 hover:text-slate-600"
                                                        >
                                                            {product.title}
                                                        </Link>
                                                        <p className="text-sm text-slate-500">{product.categoryName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                                                {formatCurrency(product.unitPrice, product.currency)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                                                {product.quantity} adet
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(product.status === 1 || product.status === 4) ? (
                                                        <button
                                                            onClick={() => handlePublish(product.id)}
                                                            disabled={actionLoading === product.id}
                                                            className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-50"
                                                            title="Yayınla"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                    ) : product.status === 2 ? (
                                                        <button
                                                            onClick={() => handleUnpublish(product.id)}
                                                            disabled={actionLoading === product.id}
                                                            className="rounded p-1 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
                                                            title="Yayından Kaldır"
                                                        >
                                                            <EyeOff className="h-5 w-5" />
                                                        </button>
                                                    ) : null}

                                                    <Link
                                                        href={`/dashboard/products/${product.id}`}
                                                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                                        title="Düzenle"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </Link>

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
                                                            className="rounded p-1 text-red-600 hover:bg-red-50"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
