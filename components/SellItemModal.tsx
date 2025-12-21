"use client";

import { useState, useRef } from "react";
import Modal from "./Modal";

type SellItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SellItemModal({ isOpen, onClose }: SellItemModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    condition: "Sıfır (Kapalı Kutu)",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simülasyon: İlan gönderildi
    alert("İlanınız inceleme için gönderildi! Onaylandıktan sonra yayınlanacaktır.");
    // Formu temizle
    setFormData({ productName: "", brand: "", condition: "Sıfır (Kapalı Kutu)" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview oluştur
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Modal kapandığında preview URL'ini temizle
  const handleClose = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Yeni İlan Oluştur">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Örn: Siemens Simatic S7-1200 PLC"
          />
        </div>

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
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Örn: Siemens, ABB, Omron"
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
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Sıfır (Kapalı Kutu)">Sıfır (Kapalı Kutu)</option>
            <option value="Sıfır (Açık Kutu)">Sıfır (Açık Kutu)</option>
            <option value="Yeni Gibi">Yeni Gibi</option>
            <option value="Yenilenmiş">Yenilenmiş</option>
            <option value="İkinci El (Temiz)">İkinci El (Temiz)</option>
            <option value="Yedek Parça / Arızalı">Yedek Parça / Arızalı</option>
          </select>
        </div>

        {/* Image Upload */}
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
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Fotoğraf yükleyin (JPG, PNG, max 5MB)
          </p>

          {/* Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Önizleme:</p>
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

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            İlanı Gönder
          </button>
        </div>
      </form>
    </Modal>
  );
}

