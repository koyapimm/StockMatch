"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { login, setUserCompany } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    taxNumber: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simülasyon: 1 saniye bekle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock register & login
    login();
    setUserCompany(formData.companyName);
    setIsLoading(false);

    // Dashboard'a yönlendir
    router.push("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left Side - Form (40%) */}
        <div className="flex w-full flex-col bg-white lg:w-[40%]">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-12">
            {/* Logo */}
            <Link href="/" className="mb-6 text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
              StockMatch
            </Link>

            {/* Form Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Kurumsal Hesap Oluştur
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Şirket bilgilerinizi girerek başlayın
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Şirket Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Örn: ABC Endüstriyel A.Ş."
                />
              </div>

              <div>
                <label
                  htmlFor="taxNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Vergi Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taxNumber"
                  name="taxNumber"
                  required
                  value={formData.taxNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Örn: 1234567890"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Güvenlik ve doğrulama için gereklidir
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Kurumsal E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="ornek@sirket.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="En az 8 karakter"
                />
                <p className="mt-1 text-xs text-slate-500">
                  En az 8 karakter, güvenli bir şifre oluşturun
                </p>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  <Link href="#" className="text-slate-900 hover:underline">
                    Kullanım Şartları
                  </Link>{" "}
                  ve{" "}
                  <Link href="#" className="text-slate-900 hover:underline">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                {isLoading ? "Hesap oluşturuluyor..." : "Kurumsal Hesap Oluştur"}
              </button>
            </form>

            {/* Footer Link */}
            <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
              Zaten hesabınız var mı?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-900 hover:underline"
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Visual (60%) */}
        <div className="relative hidden bg-slate-900 lg:block lg:w-[60%]">
          <div
            className="flex h-full items-center justify-center bg-cover bg-center bg-no-repeat px-12"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80)",
            }}
          >
            <div className="absolute inset-0 bg-slate-900/70" />
            <div className="relative z-10 max-w-md px-6 text-center text-white sm:px-0">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                500+ Şirket Ölü Stoklarını Nakit Paraya Çeviriyor
              </h2>
              <p className="text-base text-slate-200 sm:text-lg">
                Güvenli, hızlı ve profesyonel B2B pazar yerine katılın. 
                Şirket doğrulamanız tamamlandıktan sonra satışa başlayın.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

