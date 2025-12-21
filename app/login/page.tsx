"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simülasyon: 1 saniye bekle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock login
    login();
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
    <div className="flex  flex-col">
      <div className="flex min-h-screen flex-1">
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
                Hoş Geldiniz
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Kurumsal hesabınıza giriş yapın
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Kurumsal E-posta
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
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Şifrenizi girin"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm text-slate-600">Beni hatırla</span>
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-slate-900 hover:underline"
                >
                  Şifremi unuttum
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                {isLoading ? "Giriş yapılıyor..." : "Dashboard'a Giriş Yap"}
              </button>
            </form>

            {/* Footer Link */}
            <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-900 hover:underline"
              >
                Kayıt Ol
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
                "url(https://images.unsplash.com/photo-1581092334651-ddf26d661331?auto=format&fit=crop&w=1200&q=80)",
            }}
          >
            <div className="absolute inset-0 bg-slate-900/70" />
            <div className="relative z-10 max-w-md px-6 text-center text-white sm:px-0">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                500+ Şirket Ölü Stoklarını Nakit Paraya Çeviriyor
              </h2>
              <p className="text-base text-slate-200 sm:text-lg">
                Endüstriyel ekipmanlarınızı güvenli ve hızlı bir şekilde satın. 
                B2B pazar yerimizde yerinizi alın.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

