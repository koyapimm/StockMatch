"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate API call - in production, this would call the actual API
        // Currently the forgot password API endpoint is not implemented
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <div className="flex w-full flex-col bg-white lg:w-[40%]">
                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-12">
                        <Link href="/" className="mb-6 sm:mb-8">
                            <Image src="/stockmatch_logo.jpeg" alt="StockMatch" width={160} height={45} className="h-10 w-auto sm:h-12" priority />
                        </Link>

                        <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Giriş sayfasına dön
                        </Link>

                        {!isSubmitted ? (
                            <>
                                <div className="mb-6 sm:mb-8">
                                    <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                        Şifremi Unuttum
                                    </h1>
                                    <p className="text-sm text-slate-600 sm:text-base">
                                        E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                            E-posta Adresi
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                placeholder="ornek@sirket.com"
                                            />
                                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                                    >
                                        {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    E-posta Gönderildi!
                                </h1>
                                <p className="mb-6 text-sm text-slate-600 sm:text-base">
                                    <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
                                    Lütfen gelen kutunuzu kontrol edin.
                                </p>
                                <p className="mb-6 text-xs text-slate-500">
                                    E-posta gelmedi mi? Spam klasörünüzü kontrol edin veya birkaç dakika bekleyip tekrar deneyin.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                                >
                                    Giriş Sayfasına Dön
                                </Link>
                            </div>
                        )}
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
                                Şifrenizi Güvenle Sıfırlayın
                            </h2>
                            <p className="text-base text-slate-200 sm:text-lg">
                                Size gönderilen bağlantı ile yeni şifrenizi belirleyebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
