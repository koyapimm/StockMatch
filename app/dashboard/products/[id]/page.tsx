"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { productApi, categoryApi, productImageApi, ProductDto, CategoryDto, getApiImageUrl } from "@/lib/api";
import { validateImageFile } from "@/lib/utils";
import { X, ImagePlus, Star } from "lucide-react";

const CONDITIONS = ["Sıfır", "Yeni Gibi", "Yenilenmiş", "İkinci El", "Kullanılmış"];
const CURRENCIES = ["TRY", "USD", "EUR"];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = parseInt(resolvedParams.id);
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, company } = useAuth();

    const [product, setProduct] = useState<ProductDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagesPreviews, setNewImagesPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        categoryId: "",
        title: "",
        description: "",
        brand: "",
        model: "",
        partNumber: "",
        quantity: "1",
        minimumOrderQuantity: "1",
        unitPrice: "",
        currency: "TRY",
        condition: "Sıfır",
        warrantyInfo: "",
    });

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
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    productApi.getById(productId),
                    categoryApi.getAll(),
                ]);

                if (categoryRes.success) {
                    setCategories(categoryRes.categories);
                }

                if (productRes.success && productRes.product) {
                    const p = productRes.product;
                    setProduct(p);
                    setFormData({
                        categoryId: String(p.categoryId),
                        title: p.title,
                        description: p.description,
                        brand: p.brand || "",
                        model: p.model || "",
                        partNumber: p.partNumber || "",
                        quantity: String(p.quantity),
                        minimumOrderQuantity: String(p.minimumOrderQuantity),
                        unitPrice: String(p.unitPrice),
                        currency: p.currency,
                        condition: p.condition,
                        warrantyInfo: p.warrantyInfo || "",
                    });
                }
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Ürün yüklenirken bir hata oluştu", "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn, productId, showToast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentTotal = (product?.images?.length || 0) + newImages.length;
        const remainingSlots = 5 - currentTotal;
        const toAdd: File[] = [];
        for (const file of files.slice(0, remainingSlots)) {
            const result = validateImageFile(file);
            if (result.valid) {
                toAdd.push(file);
            } else {
                showToast(result.error, "error");
                break;
            }
        }
        if (toAdd.length > 0) {
            setNewImages((prev) => [...prev, ...toAdd]);
            setNewImagesPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
        }
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagesPreviews[index]);
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagesPreviews(newImagesPreviews.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = async (imageId: number) => {
        try {
            await productImageApi.delete(imageId);
            setProduct(prev => prev ? {
                ...prev,
                images: prev.images?.filter(img => img.id !== imageId)
            } : null);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Görsel silinirken hata oluştu.", "error");
        }
    };

    const handleSetPrimary = async (imageId: number) => {
        try {
            await productImageApi.setPrimary(imageId);
            setProduct(prev => prev ? {
                ...prev,
                images: prev.images?.map(img => ({
                    ...img,
                    isPrimary: img.id === imageId
                }))
            } : null);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Ana görsel ayarlanırken hata oluştu.", "error");
        }
    };
        setError(null);
        setSuccess(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const productData = {
                categoryId: parseInt(formData.categoryId),
                title: formData.title,
                description: formData.description,
                brand: formData.brand || undefined,
                model: formData.model || undefined,
                partNumber: formData.partNumber || undefined,
                quantity: parseInt(formData.quantity),
                minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
                unitPrice: parseFloat(formData.unitPrice),
                currency: formData.currency,
                condition: formData.condition,
                warrantyInfo: formData.warrantyInfo || undefined,
            };

            const response = await productApi.update(productId, productData);

            if (response.success) {
                for (const file of newImages) {
                    const result = validateImageFile(file);
                    if (!result.valid) {
                        showToast(result.error, "error");
                        return;
                    }
                    await productImageApi.upload(productId, file, false);
                }
                setNewImages([]);
                setNewImagesPreviews([]);

                const refreshed = await productApi.getById(productId);
                if (refreshed.success && refreshed.product) {
                    setProduct(refreshed.product);
                }
                showToast("Ürün başarıyla güncellendi!", "success");
            } else {
                showToast(response.message || "Ürün güncellenirken bir hata oluştu", "error");
            }
        } catch (err: unknown) {
            showToast(
                err instanceof Error ? err.message : "Ürün güncellenirken bir hata oluştu",
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || !isLoggedIn || (!company && isLoggedIn)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <div className="rounded-lg bg-red-50 p-6 text-center">
                        <h2 className="text-lg font-semibold text-red-800">Ürün Bulunamadı</h2>
                        <Link href="/dashboard/products" className="mt-4 inline-block text-sm text-red-600 hover:underline">
                            Ürünlerime Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalImages = (product.images?.length || 0) + newImages.length;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/products" className="hover:text-slate-700">Ürünlerim</Link>
                        <span>/</span>
                        <span className="text-slate-700">Düzenle</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ürün Düzenle</h1>
                    <p className="mt-1 text-slate-600">{product.title}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Images */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Ürün Görselleri</h2>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {/* Existing images */}
                            {product.images?.map((image) => (
                                <div key={image.id} className="relative aspect-square rounded-lg border-2 border-slate-200 overflow-hidden">
                                    <Image
                                        src={getApiImageUrl(image.imageUrl)}
                                        alt="Product image"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute right-1 top-1 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleSetPrimary(image.id)}
                                            className={`rounded-full p-1 ${image.isPrimary ? 'bg-yellow-500 text-white' : 'bg-white text-slate-400 hover:bg-yellow-50 hover:text-yellow-500'}`}
                                            title="Ana görsel yap"
                                        >
                                            <Star className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExistingImage(image.id)}
                                            className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                            title="Sil"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {image.isPrimary && (
                                        <span className="absolute bottom-1 left-1 rounded bg-slate-900 px-2 py-0.5 text-xs text-white">
                                            Ana Görsel
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* New images to upload */}
                            {newImagesPreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="relative aspect-square rounded-lg border-2 border-dashed border-green-300 overflow-hidden">
                                    <img src={preview} alt={`New ${index + 1}`} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <span className="absolute bottom-1 left-1 rounded bg-green-600 px-2 py-0.5 text-xs text-white">
                                        Yeni
                                    </span>
                                </div>
                            ))}

                            {/* Add more button */}
                            {totalImages < 5 && (
                                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100">
                                    <ImagePlus className="h-8 w-8 text-slate-400" />
                                    <span className="mt-2 text-sm text-slate-500">Görsel Ekle</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Temel Bilgiler</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-slate-700">
                                    Kategori *
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="">Kategori Seçin</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                                    Ürün Başlığı *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    minLength={5}
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                                    Açıklama *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    minLength={20}
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="brand" className="mb-2 block text-sm font-medium text-slate-700">Marka</label>
                                    <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                </div>
                                <div>
                                    <label htmlFor="model" className="mb-2 block text-sm font-medium text-slate-700">Model</label>
                                    <input type="text" id="model" name="model" value={formData.model} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                </div>
                                <div>
                                    <label htmlFor="partNumber" className="mb-2 block text-sm font-medium text-slate-700">Parça No</label>
                                    <input type="text" id="partNumber" name="partNumber" value={formData.partNumber} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="condition" className="mb-2 block text-sm font-medium text-slate-700">Durum *</label>
                                    <select id="condition" name="condition" required value={formData.condition} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                                        {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="warrantyInfo" className="mb-2 block text-sm font-medium text-slate-700">Garanti</label>
                                    <input type="text" id="warrantyInfo" name="warrantyInfo" value={formData.warrantyInfo} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Fiyat ve Stok</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="unitPrice" className="mb-2 block text-sm font-medium text-slate-700">Birim Fiyat *</label>
                                <div className="flex">
                                    <input type="number" id="unitPrice" name="unitPrice" required min="1" step="0.01" value={formData.unitPrice} onChange={handleChange}
                                        className="w-full rounded-l-lg border border-r-0 border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                    <select name="currency" value={formData.currency} onChange={handleChange}
                                        className="rounded-r-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                                        {CURRENCIES.map((c) => <option key={c} value={c}>{c === "TRY" ? "₺" : c === "USD" ? "$" : "€"}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700">Stok *</label>
                                <input type="number" id="quantity" name="quantity" required min="1" value={formData.quantity} onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                            <div>
                                <label htmlFor="minimumOrderQuantity" className="mb-2 block text-sm font-medium text-slate-700">Min. Sipariş *</label>
                                <input type="number" id="minimumOrderQuantity" name="minimumOrderQuantity" required min="1" value={formData.minimumOrderQuantity} onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href="/dashboard/products" className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            İptal
                        </Link>
                        <button type="submit" disabled={isSaving}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
