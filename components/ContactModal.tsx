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
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            // required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Adınız ve soyadınız"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Şirket Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            // required
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Şirketinizin adı"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            // required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Mesaj <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            // required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Talebi Gönder
          </button>
        </div>
      </form>
    </Modal>
  );
}

