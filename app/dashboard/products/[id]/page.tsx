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
import { X, ImagePlus, Star, GripVertical } from "lucide-react";

const CONDITIONS = ["Sıfır", "Yeni Gibi", "Yenilenmiş", "İkinci El", "Kullanılmış"];
const CURRENCIES = ["TRY", "USD", "EUR"];
const MAX_IMAGES = 10;

type ImageItemExisting = { type: "existing"; id: number; imageUrl: string };
type ImageItemNew = { type: "new"; file: File; preview: string };
type ImageItem = ImageItemExisting | ImageItemNew;

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = parseInt(resolvedParams?.id ?? "", 10);
    const isInvalidId = Number.isNaN(productId) || productId < 1;
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, company } = useAuth();

    const [product, setProduct] = useState<ProductDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [orderedItems, setOrderedItems] = useState<ImageItem[]>([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
                    const existing = (p.images ?? []).map((img) => ({
                        type: "existing" as const,
                        id: img.id,
                        imageUrl: img.imageUrl,
                    }));
                    setOrderedItems(existing);
                    const primaryIdx = p.images?.findIndex((i) => i.isPrimary) ?? 0;
                    setPrimaryIndex(primaryIdx >= 0 ? primaryIdx : 0);
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

        if (isLoggedIn && !isInvalidId) {
            fetchData();
        } else if (isInvalidId) {
            setIsLoading(false);
        }
    }, [isLoggedIn, productId, isInvalidId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = MAX_IMAGES - orderedItems.length;
        const toAdd: ImageItemNew[] = [];
        for (const file of files.slice(0, remainingSlots)) {
            const result = validateImageFile(file);
            if (result.valid) {
                toAdd.push({ type: "new", file, preview: URL.createObjectURL(file) });
            } else {
                showToast(result.error, "error");
                break;
            }
        }
        if (toAdd.length > 0) {
            setOrderedItems((prev) => [...prev, ...toAdd]);
        }
    };

    const removeImage = (index: number) => {
        const item = orderedItems[index];
        if (item.type === "new") {
            URL.revokeObjectURL(item.preview);
        }
        setOrderedItems((prev) => prev.filter((_, i) => i !== index));
        if (primaryIndex === index) {
            setPrimaryIndex(0);
        } else if (primaryIndex > index) {
            setPrimaryIndex(primaryIndex - 1);
        }
    };

    const handleDeleteExistingImage = async (index: number) => {
        const item = orderedItems[index];
        if (item.type !== "existing") return;
        try {
            await productImageApi.delete(item.id);
            setProduct((prev) =>
                prev
                    ? { ...prev, images: prev.images?.filter((img) => img.id !== item.id) ?? [] }
                    : null
            );
            setOrderedItems((prev) => prev.filter((_, i) => i !== index));
            if (primaryIndex === index) {
                setPrimaryIndex(0);
            } else if (primaryIndex > index) {
                setPrimaryIndex(primaryIndex - 1);
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Görsel silinirken hata oluştu.", "error");
        }
    };

    const setPrimaryImage = (index: number) => {
        setPrimaryIndex(index);
    };

    const handleSetPrimaryExisting = async (index: number) => {
        const item = orderedItems[index];
        if (item.type !== "existing") return;
        try {
            await productImageApi.setPrimary(item.id);
            setProduct((prev) =>
                prev
                    ? {
                          ...prev,
                          images: prev.images?.map((img) => ({
                              ...img,
                              isPrimary: img.id === item.id,
                          })),
                      }
                    : null
            );
            setPrimaryIndex(index);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Ana görsel ayarlanırken hata oluştu.", "error");
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const newItems = [...orderedItems];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, removed);
        let newPrimary = primaryIndex;
        if (draggedIndex === primaryIndex) {
            newPrimary = index;
        } else if (draggedIndex < primaryIndex && index >= primaryIndex) {
            newPrimary = primaryIndex - 1;
        } else if (draggedIndex > primaryIndex && index <= primaryIndex) {
            newPrimary = primaryIndex + 1;
        }
        setOrderedItems(newItems);
        setPrimaryIndex(newPrimary);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

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
                const primaryItem = orderedItems[primaryIndex];
                if (primaryItem?.type === "existing") {
                    const currentPrimary = product?.images?.find((i) => i.isPrimary);
                    if (currentPrimary?.id !== primaryItem.id) {
                        await productImageApi.setPrimary(primaryItem.id);
                    }
                }
                for (let index = 0; index < orderedItems.length; index++) {
                    const item = orderedItems[index];
                    if (item.type !== "new") continue;
                    const result = validateImageFile(item.file);
                    if (!result.valid) {
                        showToast(result.error, "error");
                        return;
                    }
                    await productImageApi.upload(productId, item.file, index === primaryIndex);
                }

                const refreshed = await productApi.getById(productId);
                if (refreshed.success && refreshed.product) {
                    const p = refreshed.product;
                    setProduct(p);
                    const existing = (p.images ?? []).map((img) => ({
                        type: "existing" as const,
                        id: img.id,
                        imageUrl: img.imageUrl,
                    }));
                    setOrderedItems(existing);
                    const primaryIdx = p.images?.findIndex((i) => i.isPrimary) ?? 0;
                    setPrimaryIndex(primaryIdx >= 0 ? primaryIdx : 0);
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

    if (isInvalidId) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="mx-auto max-w-4xl px-4 py-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                        <h2 className="text-lg font-semibold text-red-800">Geçersiz ürün</h2>
                        <Link href="/dashboard/products" className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline">
                            Ürünlerime Dön
                        </Link>
                    </div>
                </main>
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

    const totalImages = orderedItems.length;

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
                        <p className="mb-4 text-sm text-slate-600">
                            Maksimum {MAX_IMAGES} görsel. Yıldıza tıklayarak ana görseli seçin, sürükleyerek sıralayın.
                        </p>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {orderedItems.map((item, index) => (
                                <div
                                    key={item.type === "existing" ? item.id : item.preview}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-move transition-all ${
                                        index === primaryIndex ? "border-yellow-400 ring-2 ring-yellow-400" : "border-slate-200"
                                    } ${draggedIndex === index ? "opacity-50" : ""}`}
                                >
                                    {item.type === "existing" ? (
                                        <Image
                                            src={getApiImageUrl(item.imageUrl)}
                                            alt="Ürün"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <img src={item.preview} alt={`Yeni ${index + 1}`} className="h-full w-full object-cover" />
                                    )}
                                    <div className="absolute left-1 top-1 rounded bg-black/50 p-1 text-white">
                                        <GripVertical className="h-3 w-3" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            item.type === "existing" ? handleSetPrimaryExisting(index) : setPrimaryImage(index)
                                        }
                                        className={`absolute left-1 bottom-1 rounded-full p-1.5 transition-colors ${
                                            index === primaryIndex
                                                ? "bg-yellow-400 text-yellow-900"
                                                : "bg-black/50 text-white hover:bg-yellow-400 hover:text-yellow-900"
                                        }`}
                                        title="Ana görsel yap"
                                    >
                                        <Star className={`h-3 w-3 ${index === primaryIndex ? "fill-current" : ""}`} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            item.type === "existing" ? handleDeleteExistingImage(index) : removeImage(index)
                                        }
                                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                        title="Sil"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    {index === primaryIndex && (
                                        <span className="absolute bottom-1 right-1 rounded bg-yellow-400 px-1.5 py-0.5 text-xs font-medium text-yellow-900">
                                            Ana
                                        </span>
                                    )}
                                    {item.type === "new" && (
                                        <span className="absolute top-1 right-8 rounded bg-green-600 px-1.5 py-0.5 text-xs text-white">
                                            Yeni
                                        </span>
                                    )}
                                </div>
                            ))}

                            {totalImages < MAX_IMAGES && (
                                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100">
                                    <ImagePlus className="h-8 w-8 text-slate-400" />
                                    <span className="mt-2 text-sm text-slate-500">Görsel Ekle</span>
                                    <span className="text-xs text-slate-400">{totalImages}/{MAX_IMAGES}</span>
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
