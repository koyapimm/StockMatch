"use client";

import { useState } from "react";
import Modal from "./Modal";
import { contactRequestApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
};

export default function ContactModal({
  isOpen,
  onClose,
  productId,
  productTitle,
}: ContactModalProps) {
  const { company } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    message: "",
    contactPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await contactRequestApi.create({
        productId,
        message: formData.message,
        contactPhone: formData.contactPhone || undefined,
        ndaAccepted: true,
      });

      if (response.success) {
        setSuccess(true);
        showToast("Talep başarıyla gönderildi. Satıcı size dönüş yapacaktır.", "success");
        setTimeout(() => {
          setFormData({ message: "", contactPhone: "" });
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        showToast(response.message || "Talep gönderilemedi.", "error");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Bir hata oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setFormData({ message: "", contactPhone: "" });
    setSuccess(false);
    onClose();
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Talep Gönderildi" size="small">
        <div className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Talebiniz İletildi!</h3>
          <p className="text-slate-600">
            Satıcı talebinizi inceleyecek ve size en kısa sürede dönüş yapacaktır.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Satıcıyla İletişime Geç"
      size="large"
    >
      <div className="mb-4 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Ürün:</span> {productTitle}
        </p>
        {company && (
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-semibold">Gönderen Firma:</span> {company.name}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            Mesajınız <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            placeholder="Ürün hakkında sorularınızı veya teklif talebinizi yazın..."
          />
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="mb-2 block text-sm sm:text-base font-semibold text-slate-900"
          >
            İletişim Telefonu (Opsiyonel)
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="05XX XXX XX XX"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:flex-1 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 rounded-lg bg-slate-900 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Gönderiliyor..." : "Talebi Gönder"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
