"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { productApi, categoryApi, productImageApi, CategoryDto } from "@/lib/api";
import { validateImageFile } from "@/lib/utils";
import { Upload, X, AlertCircle, ImagePlus, Star, GripVertical } from "lucide-react";

const CONDITIONS = ["Sıfır", "Yeni Gibi", "Yenilenmiş", "İkinci El", "Kullanılmış"];
const CURRENCIES = ["TRY", "USD", "EUR"];

export default function NewProductPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, company } = useAuth();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [images, setImages] = useState<File[]>([]);
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
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
        if (!company) return;
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll();
                if (response.success) {
                    setCategories(response.categories);
                }
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Kategoriler yüklenirken bir hata oluştu.", "error");
            }
        };
        fetchCategories();
    }, [company, showToast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = 10 - images.length;
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
            setImages((prev) => [...prev, ...toAdd]);
            setImagesPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagesPreviews[index]);
        setImages(images.filter((_, i) => i !== index));
        setImagesPreviews(imagesPreviews.filter((_, i) => i !== index));

        // Adjust primary index if needed
        if (primaryImageIndex === index) {
            setPrimaryImageIndex(0);
        } else if (primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1);
        }
    };

    const setPrimaryImage = (index: number) => {
        setPrimaryImageIndex(index);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const newPreviews = [...imagesPreviews];

        const draggedImage = newImages[draggedIndex];
        const draggedPreview = newPreviews[draggedIndex];

        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        newPreviews.splice(draggedIndex, 1);
        newPreviews.splice(index, 0, draggedPreview);

        // Adjust primary index
        let newPrimaryIndex = primaryImageIndex;
        if (draggedIndex === primaryImageIndex) {
            newPrimaryIndex = index;
        } else if (draggedIndex < primaryImageIndex && index >= primaryImageIndex) {
            newPrimaryIndex = primaryImageIndex - 1;
        } else if (draggedIndex > primaryImageIndex && index <= primaryImageIndex) {
            newPrimaryIndex = primaryImageIndex + 1;
        }

        setImages(newImages);
        setImagesPreviews(newPreviews);
        setPrimaryImageIndex(newPrimaryIndex);
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
        setIsLoading(true);

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

            const response = await productApi.create(productData);

            if (response.success && response.product) {
                for (let i = 0; i < images.length; i++) {
                    const result = validateImageFile(images[i]);
                    if (!result.valid) {
                        showToast(result.error, "error");
                        return;
                    }
                    await productImageApi.upload(response.product!.id, images[i], i === primaryImageIndex);
                }
                showToast("Ürün başarıyla oluşturuldu!", "success");
                router.push("/dashboard/products");
            } else {
                showToast(response.message || "Ürün oluşturulurken bir hata oluştu.", "error");
            }
        } catch (err: unknown) {
            showToast(
                err instanceof Error ? err.message : "Ürün oluşturulurken bir hata oluştu.",
                "error"
            );
        } finally {
            setIsLoading(false);
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/products" className="hover:text-slate-700">Ürünlerim</Link>
                        <span>/</span>
                        <span className="text-slate-700">Yeni Ürün</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Yeni Ürün Ekle</h1>
                    <p className="mt-1 text-slate-600">
                        Ürün bilgilerini doldurarak ilanınızı oluşturun. Maksimum 10 görsel ekleyebilirsiniz.
                    </p>
                </div>

                {!canAddProduct && (
                    <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                            <div>
                                <h3 className="font-medium text-amber-800">Ürün Ekleyemezsiniz</h3>
                                <p className="mt-1 text-sm text-amber-700">
                                    Firma bilgileriniz henüz onaylanmadı. Onaylandıktan sonra ürün ekleyebilirsiniz.
                                </p>
                                <Link
                                    href="/dashboard/company"
                                    className="mt-2 inline-block text-sm font-medium text-amber-800 hover:underline"
                                >
                                    Firma bilgilerini kontrol et →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Images */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Ürün Görselleri</h2>
                        <p className="mb-4 text-sm text-slate-600">
                            Maksimum 10 görsel yükleyebilirsiniz. Yıldıza tıklayarak ana görseli seçin, sürükleyerek sıralayın.
                        </p>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {imagesPreviews.map((preview, index) => (
                                <div
                                    key={index}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-move transition-all ${index === primaryImageIndex ? "border-yellow-400 ring-2 ring-yellow-400" : "border-slate-200"
                                        } ${draggedIndex === index ? "opacity-50" : ""}`}
                                >
                                    <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />

                                    {/* Drag handle */}
                                    <div className="absolute left-1 top-1 rounded bg-black/50 p-1 text-white">
                                        <GripVertical className="h-3 w-3" />
                                    </div>

                                    {/* Primary star button */}
                                    <button
                                        type="button"
                                        onClick={() => setPrimaryImage(index)}
                                        className={`absolute left-1 bottom-1 rounded-full p-1.5 transition-colors ${index === primaryImageIndex
                                                ? "bg-yellow-400 text-yellow-900"
                                                : "bg-black/50 text-white hover:bg-yellow-400 hover:text-yellow-900"
                                            }`}
                                        title="Ana görsel yap"
                                    >
                                        <Star className={`h-3 w-3 ${index === primaryImageIndex ? "fill-current" : ""}`} />
                                    </button>

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {index === primaryImageIndex && (
                                        <span className="absolute bottom-1 right-1 rounded bg-yellow-400 px-1.5 py-0.5 text-xs font-medium text-yellow-900">
                                            Ana
                                        </span>
                                    )}
                                </div>
                            ))}

                            {images.length < 10 && (
                                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100">
                                    <ImagePlus className="h-8 w-8 text-slate-400" />
                                    <span className="mt-2 text-sm text-slate-500">Görsel Ekle</span>
                                    <span className="text-xs text-slate-400">{images.length}/10</span>
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
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                                    placeholder="Örn: Siemens S7-1200 PLC"
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
                                    placeholder="Ürün hakkında detaylı bilgi verin..."
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="brand" className="mb-2 block text-sm font-medium text-slate-700">
                                        Marka
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Siemens"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="model" className="mb-2 block text-sm font-medium text-slate-700">
                                        Model
                                    </label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="S7-1200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="partNumber" className="mb-2 block text-sm font-medium text-slate-700">
                                        Parça Numarası
                                    </label>
                                    <input
                                        type="text"
                                        id="partNumber"
                                        name="partNumber"
                                        value={formData.partNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="6ES7214-1AG40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="condition" className="mb-2 block text-sm font-medium text-slate-700">
                                    Durum *
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    required
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    {CONDITIONS.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="warrantyInfo" className="mb-2 block text-sm font-medium text-slate-700">
                                    Garanti Bilgisi
                                </label>
                                <input
                                    type="text"
                                    id="warrantyInfo"
                                    name="warrantyInfo"
                                    value={formData.warrantyInfo}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="2 yıl garanti"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Fiyat ve Stok</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="unitPrice" className="mb-2 block text-sm font-medium text-slate-700">
                                    Birim Fiyat *
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        id="unitPrice"
                                        name="unitPrice"
                                        required
                                        min="1"
                                        step="0.01"
                                        value={formData.unitPrice}
                                        onChange={handleChange}
                                        className="w-full rounded-l-lg border border-r-0 border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="15000"
                                    />
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="rounded-r-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        {CURRENCIES.map((c) => (
                                            <option key={c} value={c}>{c === "TRY" ? "₺" : c === "USD" ? "$" : "€"}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700">
                                    Stok Adedi *
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="10"
                                />
                            </div>

                            <div>
                                <label htmlFor="minimumOrderQuantity" className="mb-2 block text-sm font-medium text-slate-700">
                                    Minimum Sipariş Adedi *
                                </label>
                                <input
                                    type="number"
                                    id="minimumOrderQuantity"
                                    name="minimumOrderQuantity"
                                    required
                                    min="1"
                                    value={formData.minimumOrderQuantity}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/products"
                            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            İptal
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading || !canAddProduct}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Oluşturuluyor..." : "Ürün Oluştur"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
