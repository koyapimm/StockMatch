"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { companyApi } from "@/lib/api";
import { getCompanyStatusBadge, cleanPhoneNumber } from "@/lib/utils";
import { Building2, MapPin, Phone, AlertCircle, CheckCircle } from "lucide-react";

export default function CompanySettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, company, refreshCompany } = useAuth();
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
        if (!authLoading && isLoggedIn && !company) {
            router.push("/setup-company");
        }
    }, [authLoading, isLoggedIn, company, router]);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                taxNumber: company.taxNumber || "",
                taxOffice: company.taxOffice || "",
                mersisNumber: company.mersisNumber || "",
                naceCode: company.naceCode || "",
                address: company.address || "",
                city: company.city || "",
                district: company.district || "",
                postalCode: company.postalCode || "",
                phoneNumber: company.phoneNumber || "",
                website: company.website || "",
            });
        }
    }, [company]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dataToSend = {
                name: company!.name,
                taxNumber: company!.taxNumber,
                taxOffice: company!.taxOffice,
                mersisNumber: company!.mersisNumber,
                naceCode: company!.naceCode || undefined,
                address: formData.address,
                city: formData.city,
                district: formData.district,
                postalCode: formData.postalCode || undefined,
                phoneNumber: cleanPhoneNumber(formData.phoneNumber),
                website: formData.website || undefined,
            };

            const response = await companyApi.update(dataToSend);

            if (response.success) {
                await refreshCompany();
                showToast("Firma bilgileri güncellendi!", "success");
            } else {
                showToast(response.message || "Bir hata oluştu", "error");
            }
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : "Bir hata oluştu", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || !isLoggedIn || (!company && isLoggedIn)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
        );
    }

    const statusBadge = getCompanyStatusBadge(company!.verificationStatus);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
                        <span>/</span>
                        <span className="text-slate-700">Firma Ayarları</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Firma Ayarları</h1>
                    <p className="mt-1 text-slate-600">
                        Adres ve iletişim bilgilerinizi güncelleyebilirsiniz. Yasal bilgiler değiştirilemez.
                    </p>
                </div>

                {/* Status Banner */}
                {company && (
                    <div className={`mb-6 rounded-lg p-4 ${company.verificationStatus === 3 ? "bg-green-50 border border-green-200" :
                        company.verificationStatus === 4 ? "bg-red-50 border border-red-200" :
                            "bg-yellow-50 border border-yellow-200"
                        }`}>
                        <div className="flex items-center gap-3">
                            {company.verificationStatus === 3 ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertCircle className={`h-5 w-5 ${company.verificationStatus === 4 ? "text-red-600" : "text-yellow-600"}`} />
                            )}
                            <div>
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge?.color}`}>
                                    {statusBadge?.label}
                                </span>
                                {company.verificationStatus === 4 && (
                                    <>
                                        {company.verificationRejectionReason && (
                                            <p className="mt-2 text-sm text-red-700">
                                                <strong>Red Sebebi:</strong> {company.verificationRejectionReason}
                                            </p>
                                        )}
                                        <p className="mt-2 text-sm text-red-600">
                                            Aşağıdaki bilgileri güncelleyip tekrar gönderebilirsiniz.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    {/* Company Info - Read Only */}
                    <div className="border-b border-slate-200 p-6 sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                <Building2 className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900">Firma Kimlik Bilgileri</h2>
                                <p className="text-sm text-slate-500">Yasal bilgiler değiştirilemez</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-500">Firma Adı</label>
                                <p className="rounded-lg bg-slate-50 px-4 py-2.5 text-slate-900">{company?.name || "—"}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Vergi No</label>
                                    <p className="rounded-lg bg-slate-50 px-4 py-2.5 text-slate-900">{company?.taxNumber || "—"}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Vergi Dairesi</label>
                                    <p className="rounded-lg bg-slate-50 px-4 py-2.5 text-slate-900">{company?.taxOffice || "—"}</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-500">MERSİS No</label>
                                <p className="rounded-lg bg-slate-50 px-4 py-2.5 text-slate-900">{company?.mersisNumber || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
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
                                <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">Adres *</label>
                                <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="Sokak, Bina No, Daire" />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-700">İl *</label>
                                    <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="İstanbul" />
                                </div>
                                <div>
                                    <label htmlFor="district" className="mb-2 block text-sm font-medium text-slate-700">İlçe *</label>
                                    <input type="text" id="district" name="district" required value={formData.district} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Kadıköy" />
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-slate-700">Posta Kodu <span className="text-slate-400">(opsiyonel)</span></label>
                                    <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="34700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-slate-700">Telefon *</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="0216 XXX XX XX" />
                            </div>
                            <div>
                                <label htmlFor="website" className="mb-2 block text-sm font-medium text-slate-700">Website <span className="text-slate-400">(opsiyonel)</span></label>
                                <input type="url" id="website" name="website" value={formData.website} onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="https://www.sirket.com.tr" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 p-6 sm:flex-row-reverse sm:p-8">
                        <button type="submit" disabled={isLoading}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </button>
                        <Link
                            href="/dashboard"
                            className="rounded-lg border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            İptal
                        </Link>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
