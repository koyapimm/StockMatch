"use client";

import { useState } from "react";
import Modal from "./Modal";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
};

export default function ContactModal({
  isOpen,
  onClose,
  supplierId,
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simülasyon: Form gönderildi
    alert("Talebiniz tedarikçiye iletildi! En kısa sürede sizinle iletişime geçilecektir.");
    // Formu temizle
    setFormData({ name: "", company: "", email: "", message: "" });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Supplier #${supplierId} ile İletişime Geç`}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Adınız ve soyadınız"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            Şirket Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Şirketinizin adı"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            Mesaj <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none sm:rows-6"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400"
          >
            İptal
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 rounded-lg bg-slate-900 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Talebi Gönder
          </button>
        </div>
      </form>
    </Modal>
  );
}

