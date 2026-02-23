"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { companyApi } from "@/lib/api";
import { cleanPhoneNumber } from "@/lib/utils";
import { Building2, MapPin, Phone, ArrowRight } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function SetupCompanyPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, company, refreshCompany } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    taxNumber: "",
    taxOffice: "",
    mersisNumber: "",
    naceCode: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    phoneNumber: "",
    website: "",
  });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!authLoading && company) {
      router.push("/dashboard");
    }
  }, [authLoading, company, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        naceCode: formData.naceCode || undefined,
        postalCode: formData.postalCode || undefined,
        website: formData.website || undefined,
        phoneNumber: cleanPhoneNumber(formData.phoneNumber),
      };

      const response = await companyApi.create(dataToSend);

      if (response.success) {
        await refreshCompany();
        showToast("Firma başarıyla oluşturuldu!", "success");
        router.push("/dashboard");
      } else {
        showToast(response.message || "Firma oluşturulurken bir hata oluştu.", "error");
      }
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Firma oluşturulurken bir hata oluştu.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-700">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700">Firma Kaydı</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Firma Bilgilerinizi Girin
          </h1>
          <p className="mt-1 text-slate-600">
            Platformda ürün yayınlayabilmek ve satış yapabilmek için firma kaydınız gereklidir.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          {/* Firma Kimlik Bilgileri */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Firma Kimlik Bilgileri</h2>
                <p className="text-sm text-slate-500">Yasal bilgilerinizi girin</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Firma Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="ABC Endüstriyel A.Ş."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="taxNumber" className={labelClass}>
                    Vergi Numarası *
                  </label>
                  <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    required
                    maxLength={11}
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="10 veya 11 haneli"
                  />
                </div>
                <div>
                  <label htmlFor="taxOffice" className={labelClass}>
                    Vergi Dairesi *
                  </label>
                  <input
                    type="text"
                    id="taxOffice"
                    name="taxOffice"
                    required
                    value={formData.taxOffice}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Kozyatağı"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="mersisNumber" className={labelClass}>
                  MERSİS Numarası *
                </label>
                <input
                  type="text"
                  id="mersisNumber"
                  name="mersisNumber"
                  required
                  maxLength={16}
                  value={formData.mersisNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="16 haneli MERSİS numarası"
                />
              </div>
              <div>
                <label htmlFor="naceCode" className={labelClass}>
                  NACE Kodu <span className="text-slate-400">(opsiyonel)</span>
                </label>
                <input
                  type="text"
                  id="naceCode"
                  name="naceCode"
                  value={formData.naceCode}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Örn: 46.69"
                />
              </div>
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Adres Bilgileri</h2>
                <p className="text-sm text-slate-500">Firmanızın kayıtlı adresi</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className={labelClass}>
                  Açık Adres *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Sokak, Bina No, Daire No"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className={labelClass}>
                    İl *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="İstanbul"
                  />
                </div>
                <div>
                  <label htmlFor="district" className={labelClass}>
                    İlçe *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Kadıköy"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className={labelClass}>
                    Posta Kodu <span className="text-slate-400">(opsiyonel)</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="34710"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Phone className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">İletişim Bilgileri</h2>
                <p className="text-sm text-slate-500">Alıcıların sizinle iletişime geçebilmesi için</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>
                  Firma Telefonu *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="0212 555 00 00"
                />
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>
                  Web Sitesi <span className="text-slate-400">(opsiyonel)</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://www.sirket.com.tr"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-5 sm:flex-row-reverse sm:px-8">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Kaydediliyor..." : "Firmayı Kaydet"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
            >
              Daha Sonra
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Bilgileriniz incelendikten sonra hesabınız aktif edilecektir.
        </p>
      </main>

      <Footer />
    </div>
  );
}
