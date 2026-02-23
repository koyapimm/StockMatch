"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { authApi } from "@/lib/api";
import { User, Lock } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, user, refreshUser } = useAuth();

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [authLoading, isLoggedIn, router]);

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const response = await authApi.updateProfile(profileData);
            if (response.success) {
                showToast("Profil bilgileri güncellendi!", "success");
                await refreshUser();
            } else {
                showToast(response.message || "Güncelleme başarısız", "error");
            }
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : "Bir hata oluştu", "error");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            showToast("Yeni şifreler eşleşmiyor", "error");
            setPasswordLoading(false);
            return;
        }
        if (passwordData.newPassword.length < 8) {
            showToast("Yeni şifre en az 8 karakter olmalı", "error");
            setPasswordLoading(false);
            return;
        }
        try {
            const response = await authApi.changePassword(passwordData);
            if (response.success) {
                showToast("Şifre başarıyla değiştirildi!", "success");
                setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            } else {
                showToast(response.message || "Şifre değiştirilemedi", "error");
            }
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : "Bir hata oluştu", "error");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Profil Ayarları</h1>
                    <p className="mt-1 text-slate-600">Hesap bilgilerinizi yönetin.</p>
                </div>

                {/* Profile Form */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                            <User className="h-5 w-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Kişisel Bilgiler</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700">Ad</label>
                                <input type="text" id="firstName" name="firstName" required value={profileData.firstName} onChange={handleProfileChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700">Soyad</label>
                                <input type="text" id="lastName" name="lastName" required value={profileData.lastName} onChange={handleProfileChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-posta</label>
                            <input type="email" id="email" value={user?.email || ""} disabled
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" />
                            <p className="mt-1 text-xs text-slate-500">E-posta adresi değiştirilemez.</p>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-slate-700">Telefon</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="05XX XXX XX XX" />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={profileLoading}
                                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                                {profileLoading ? "Kaydediliyor..." : "Kaydet"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                            <Lock className="h-5 w-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Şifre Değiştir</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-slate-700">Mevcut Şifre</label>
                            <input type="password" id="currentPassword" name="currentPassword" required value={passwordData.currentPassword} onChange={handlePasswordChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-slate-700">Yeni Şifre</label>
                            <input type="password" id="newPassword" name="newPassword" required minLength={8} value={passwordData.newPassword} onChange={handlePasswordChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                            <p className="mt-1 text-xs text-slate-500">En az 8 karakter, büyük harf, küçük harf ve rakam içermeli.</p>
                        </div>

                        <div>
                            <label htmlFor="confirmNewPassword" className="mb-2 block text-sm font-medium text-slate-700">Yeni Şifre (Tekrar)</label>
                            <input type="password" id="confirmNewPassword" name="confirmNewPassword" required value={passwordData.confirmNewPassword} onChange={handlePasswordChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={passwordLoading}
                                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                                {passwordLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
