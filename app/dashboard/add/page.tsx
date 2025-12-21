"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "",
    subCategory: "",
    condition: "Sıfır (Kapalı Kutu)",
    price: "",
    stock: "",
    partNumber: "",
    series: "",
    specs: {
      power: "",
      voltage: "",
      communication: "",
    },
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ürününüz başarıyla eklendi! İnceleme sonrası yayınlanacaktır.");
    router.push("/dashboard/inventory");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("specs.")) {
      const specKey = name.split(".")[1];
      setFormData({
        ...formData,
        specs: {
          ...formData.specs,
          [specKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Yeni Ürün Ekle</h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Ürün bilgilerini eksiksiz doldurun
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-6 sm:text-lg">
            Temel Bilgiler
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="productName"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                // required
                value={formData.productName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Örn: Siemens Simatic S7-1200 PLC"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="brand"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Marka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  // required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Örn: Siemens"
                />
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Durum <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  // required
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Sıfır (Kapalı Kutu)">Sıfır (Kapalı Kutu)</option>
                  <option value="Sıfır (Açık Kutu)">Sıfır (Açık Kutu)</option>
                  <option value="Yeni Gibi">Yeni Gibi</option>
                  <option value="Yenilenmiş">Yenilenmiş</option>
                  <option value="İkinci El (Temiz)">İkinci El (Temiz)</option>
                  <option value="Yedek Parça / Arızalı">Yedek Parça / Arızalı</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Fiyat <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  // required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Stok Miktarı <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  // required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Teknik Özellikler */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-6 sm:text-lg">
            Teknik Özellikler
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="partNumber"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Parça Numarası
              </label>
              <input
                type="text"
                id="partNumber"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Örn: 6ES7214-1AG40-0XB0"
              />
            </div>

            <div>
              <label
                htmlFor="series"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Seri
              </label>
              <input
                type="text"
                id="series"
                name="series"
                value={formData.series}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Örn: S7-1200"
              />
            </div>
          </div>
        </div>

        {/* Görseller */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-6 sm:text-lg">
            Görseller
          </h2>
          <div>
            <label
              htmlFor="imageFile"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Ürün Fotoğrafı <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              // required={!imagePreview}
              onChange={handleFileChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            <p className="mt-1 text-xs text-slate-500">
              Fotoğraf yükleyin (JPG, PNG, max 5MB)
            </p>

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Önizleme:
                </p>
                <div className="relative h-48 w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
                  <img
                    src={imagePreview}
                    alt="Ürün önizlemesi"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                      }
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                    aria-label="Görseli kaldır"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:text-base"
          >
            Ürünü Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

