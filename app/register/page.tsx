"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { companyApi } from "@/lib/api";
import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";

type Step = 1 | 2;

// Password validation helper
const validatePassword = (password: string) => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasMinLength: password.length >= 8,
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, refreshCompany } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // setError kullanılmıyor - tüm hatalar toast ile

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    taxNumber: "",
    taxOffice: "",
    mersisNumber: "",
    address: "",
    city: "",
    district: "",
    phoneNumber: "",
    website: "",
  });

  // Real-time password validation
  const passwordValidation = useMemo(() => validatePassword(userData.password), [userData.password]);
  const isPasswordValid = passwordValidation.hasUpperCase && passwordValidation.hasLowerCase &&
    passwordValidation.hasNumber && passwordValidation.hasMinLength;

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (userData.password !== userData.confirmPassword) {
      showToast("Şifreler eşleşmiyor. Lütfen aynı şifreyi tekrar girin.", "error");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      showToast("Şifre en az 8 karakter olmalı, büyük harf, küçük harf ve rakam içermelidir.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(userData);
      setIsLoading(false);

      if (result.success) {
        showToast("Kayıt başarılı! Firma bilgilerinizi tamamlamayı unutmayınız.", "success");
        setTimeout(() => {
          router.push("/setup-company");
        }, 500);
      } else {
        showToast(result.message || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.", "error");
      }
    } catch (err) {
      setIsLoading(false);
      showToast(err instanceof Error ? err.message : "Kayıt sırasında bir hata oluştu.", "error");
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await companyApi.create(companyData);

      if (response.success) {
        await refreshCompany();
        showToast("Firma bilgileriniz kaydedildi.", "success");
        router.push("/dashboard");
      } else {
        showToast(response.message || "Firma bilgileri kaydedilemedi.", "error");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Firma oluşturulurken bir hata oluştu.", "error");
    }

    setIsLoading(false);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const skipCompanySetup = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="flex w-full flex-col bg-white lg:w-[40%]">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-12">
            <Link href="/" className="mb-6 sm:mb-8">
              <Image src="/stockmatch_logo.jpeg" alt="StockMatch" width={160} height={45} className="h-10 w-auto sm:h-12" priority />
            </Link>

            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                {step === 1 ? "Kurumsal Kayıt" : "Firma Bilgileri"}
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                {step === 1 ? "Kullanıcı bilgilerinizi girin" : "Firma bilgilerinizi tamamlayın"}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700">Ad *</label>
                    <input type="text" id="firstName" name="firstName" required value={userData.firstName} onChange={handleUserChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Adınız" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700">Soyad *</label>
                    <input type="text" id="lastName" name="lastName" required value={userData.lastName} onChange={handleUserChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Soyadınız" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-posta *</label>
                  <input type="email" id="email" name="email" required value={userData.email} onChange={handleUserChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="ornek@sirket.com" />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-slate-700">Telefon</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={userData.phoneNumber} onChange={handleUserChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="05XX XXX XX XX" />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Şifre *</label>
                  <input type="password" id="password" name="password" required minLength={8} value={userData.password} onChange={handleUserChange}
                    className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${userData.password.length > 0
                      ? isPasswordValid
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                        : "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                      }`}
                    placeholder="En az 8 karakter" />

                  {/* Password validation indicators */}
                  {userData.password.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      <div className={`flex items-center gap-1 text-xs ${passwordValidation.hasMinLength ? "text-green-600" : "text-red-500"}`}>
                        {passwordValidation.hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        En az 8 karakter
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${passwordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}`}>
                        {passwordValidation.hasUpperCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        Büyük harf
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${passwordValidation.hasLowerCase ? "text-green-600" : "text-red-500"}`}>
                        {passwordValidation.hasLowerCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        Küçük harf
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}`}>
                        {passwordValidation.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        Rakam
                      </div>
                    </div>
                  )}
                  {userData.password.length === 0 && (
                    <p className="mt-1 text-xs text-slate-500">En az 8 karakter, büyük harf, küçük harf ve rakam içermeli</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">Şifre Tekrar *</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required value={userData.confirmPassword} onChange={handleUserChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Şifrenizi tekrar girin" />
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                  <label htmlFor="terms" className="text-sm text-slate-600">
                    <Link href="/terms" className="text-slate-900 hover:underline">Kullanım Şartları</Link> ve{" "}
                    <Link href="/privacy" className="text-slate-900 hover:underline">Gizlilik Politikası</Link>&apos;nı kabul ediyorum
                  </label>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base">
                  {isLoading ? "Kayıt yapılıyor..." : "Devam Et"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleCompanySubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Firma Adı *</label>
                  <input type="text" id="name" name="name" required value={companyData.name} onChange={handleCompanyChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="ABC Endüstriyel A.Ş." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="taxNumber" className="mb-2 block text-sm font-medium text-slate-700">Vergi No *</label>
                    <input type="text" id="taxNumber" name="taxNumber" required maxLength={11} value={companyData.taxNumber} onChange={handleCompanyChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="1234567890" />
                  </div>
                  <div>
                    <label htmlFor="taxOffice" className="mb-2 block text-sm font-medium text-slate-700">Vergi Dairesi *</label>
                    <input type="text" id="taxOffice" name="taxOffice" required value={companyData.taxOffice} onChange={handleCompanyChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Kozyatağı" />
                  </div>
                </div>

                <div>
                  <label htmlFor="mersisNumber" className="mb-2 block text-sm font-medium text-slate-700">MERSIS No *</label>
                  <input type="text" id="mersisNumber" name="mersisNumber" required maxLength={16} value={companyData.mersisNumber} onChange={handleCompanyChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="16 haneli MERSIS numarası" />
                </div>

                <div>
                  <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">Adres *</label>
                  <input type="text" id="address" name="address" required value={companyData.address} onChange={handleCompanyChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Sokak, Bina No, Daire" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-700">İl *</label>
                    <input type="text" id="city" name="city" required value={companyData.city} onChange={handleCompanyChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="İstanbul" />
                  </div>
                  <div>
                    <label htmlFor="district" className="mb-2 block text-sm font-medium text-slate-700">İlçe *</label>
                    <input type="text" id="district" name="district" required value={companyData.district} onChange={handleCompanyChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Kadıköy" />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyPhone" className="mb-2 block text-sm font-medium text-slate-700">Firma Telefonu *</label>
                  <input type="tel" id="companyPhone" name="phoneNumber" required value={companyData.phoneNumber} onChange={handleCompanyChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="0216 XXX XX XX" />
                </div>

                <div>
                  <label htmlFor="website" className="mb-2 block text-sm font-medium text-slate-700">Website</label>
                  <input type="url" id="website" name="website" value={companyData.website} onChange={handleCompanyChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="https://www.sirket.com.tr" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={skipCompanySetup}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    Daha Sonra
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                    {isLoading ? "Kaydediliyor..." : "Tamamla"}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="font-semibold text-slate-900 hover:underline">Giriş Yap</Link>
            </p>
          </div>
        </div>

        <div className="relative hidden bg-slate-900 lg:block lg:w-[60%]">
          <div
            className="flex h-full items-center justify-center bg-cover bg-center bg-no-repeat px-12"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80)" }}
          >
            <div className="absolute inset-0 bg-slate-900/70" />
            <div className="relative z-10 max-w-md px-6 text-center text-white sm:px-0">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                {step === 1 ? "500+ Şirket Ölü Stoklarını Nakit Paraya Çeviriyor" : "Firma Doğrulaması ile Güvenli Ticaret"}
              </h2>
              <p className="text-base text-slate-200 sm:text-lg">
                {step === 1 ? "Güvenli, hızlı ve profesyonel B2B pazar yerine katılın." : "Vergi numarası ve MERSIS doğrulaması ile sadece gerçek firmalar platformumuzda yer alır."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
