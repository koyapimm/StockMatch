"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Footer from "@/components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Kayıt başarılı olduysa toast göster
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      showToast("Kayıt işlemi başarıyla tamamlandı. Giriş yapabilirsiniz.", "info");
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      showToast("Giriş başarılı. Yönlendiriliyorsunuz...", "success");
      router.push("/dashboard");
    } else {
      showToast(result.message, "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/" className="mb-6 sm:mb-8">
        <Image
          src="/stockmatch_logo.jpeg"
          alt="StockMatch"
          width={160}
          height={45}
          className="h-10 w-auto sm:h-12"
          priority
        />
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Hoş Geldiniz
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Kurumsal hesabınıza giriş yapın
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
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
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
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
          <Link href="/forgot-password" className="text-sm font-medium text-slate-900 hover:underline">
            Şifremi unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
        Hesabınız yok mu?{" "}
        <Link href="/register" className="font-semibold text-slate-900 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <div className="flex min-h-screen flex-1">
        <div className="flex w-full flex-col bg-white lg:w-[40%]">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div></div>}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="relative hidden bg-slate-900 lg:block lg:w-[60%]">
          <div
            className="flex h-full items-center justify-center bg-cover bg-center bg-no-repeat px-12"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80)",
            }}
          >
            <div className="absolute inset-0 bg-slate-900/70" />
            <div className="relative z-10 max-w-md px-6 text-center text-white sm:px-0">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                500+ Şirket Ölü Stoklarını Nakit Paraya Çeviriyor
              </h2>
              <p className="text-base text-slate-200 sm:text-lg">
                Endüstriyel ekipmanlarınızı güvenli ve hızlı bir şekilde satın.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
