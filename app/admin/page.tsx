"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { adminApi, AdminDashboardData, AdminCompanyDto } from "@/lib/api";
import { isAdminUser, getCompanyStatusBadge, formatDate } from "@/lib/utils";
import { Users, Building2, Package, MessageSquare, CheckCircle, XCircle, Clock, Shield } from "lucide-react";

export default function AdminPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoggedIn, isLoading: authLoading, user } = useAuth();
    const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
    const [pendingCompanies, setPendingCompanies] = useState<AdminCompanyDto[]>([]);
    const [allCompanies, setAllCompanies] = useState<AdminCompanyDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: number; reason: string } | null>(null);

    const isAdmin = isAdminUser(user?.email);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
            return;
        }
        if (!authLoading && isLoggedIn && !isAdmin) {
            router.push("/dashboard");
        }
    }, [authLoading, isLoggedIn, isAdmin, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn || !isAdmin) return;
            try {
                const [dashboardRes, pendingRes, allRes] = await Promise.all([
                    adminApi.getDashboard(),
                    adminApi.getPendingCompanies(),
                    adminApi.getAllCompanies(),
                ]);

                if (dashboardRes.success) setDashboardData(dashboardRes.data);
                if (pendingRes.success) setPendingCompanies(pendingRes.companies);
                if (allRes.success) setAllCompanies(allRes.companies);
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Admin verileri yüklenirken bir hata oluştu.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn && isAdmin) {
            fetchData();
        }
    }, [isLoggedIn, isAdmin, showToast]);

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            const response = await adminApi.verifyCompany(id, { approve: true });
            if (response.success) {
                setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
                setAllCompanies((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, verificationStatus: 3 } : c))
                );
                if (dashboardData) {
                    setDashboardData({
                        ...dashboardData,
                        pendingCompanies: dashboardData.pendingCompanies - 1,
                        approvedCompanies: dashboardData.approvedCompanies + 1,
                    });
                }
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Onaylama hatası.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        setActionLoading(rejectModal.id);
        try {
            const response = await adminApi.verifyCompany(rejectModal.id, {
                approve: false,
                rejectionReason: rejectModal.reason,
            });
            if (response.success) {
                setPendingCompanies((prev) => prev.filter((c) => c.id !== rejectModal.id));
                setAllCompanies((prev) =>
                    prev.map((c) =>
                        c.id === rejectModal.id
                            ? { ...c, verificationStatus: 4, verificationRejectionReason: rejectModal.reason }
                            : c
                    )
                );
                if (dashboardData) {
                    setDashboardData({
                        ...dashboardData,
                        pendingCompanies: dashboardData.pendingCompanies - 1,
                    });
                }
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Reddetme hatası.", "error");
        } finally {
            setActionLoading(null);
            setRejectModal(null);
        }
    };

    if (authLoading || !isLoggedIn || !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-lg bg-slate-900 p-2">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Paneli</h1>
                        <p className="text-slate-600">Platform yönetimi ve firma onayları</p>
                    </div>
                </div>

                {/* Stats */}
                {isLoading ? (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
                                <div className="h-8 w-24 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                ) : dashboardData && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-3">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Toplam Kullanıcı</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData.totalUsers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-orange-100 p-3">
                                    <Building2 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Onay Bekleyen</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData.pendingCompanies}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-green-100 p-3">
                                    <Package className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Aktif Ürün</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData.activeProducts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-purple-100 p-3">
                                    <MessageSquare className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">İletişim Talebi</p>
                                    <p className="text-2xl font-bold text-slate-900">{dashboardData.totalContactRequests}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-slate-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`relative pb-3 text-sm font-medium transition-colors ${activeTab === "pending"
                                    ? "border-b-2 border-slate-900 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Onay Bekleyen Firmalar
                            {pendingCompanies.length > 0 && (
                                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                                    {pendingCompanies.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "all"
                                    ? "border-b-2 border-slate-900 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Tüm Firmalar ({allCompanies.length})
                        </button>
                    </div>
                </div>

                {/* Company List */}
                {isLoading ? (
                    <div className="py-12 text-center text-slate-500">Yükleniyor...</div>
                ) : (
                    <div className="space-y-4">
                        {(activeTab === "pending" ? pendingCompanies : allCompanies).length === 0 ? (
                            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                                <Building2 className="mx-auto h-16 w-16 text-slate-300" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                    {activeTab === "pending" ? "Onay Bekleyen Firma Yok" : "Henüz Firma Yok"}
                                </h3>
                            </div>
                        ) : (
                            (activeTab === "pending" ? pendingCompanies : allCompanies).map((company) => {
                                const statusBadge = getCompanyStatusBadge(company.verificationStatus);
                                return (
                                    <div key={company.id} className="rounded-lg bg-white p-6 shadow-sm">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge.color}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </div>

                                                <div className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                                    <div><strong>Vergi No:</strong> {company.taxNumber}</div>
                                                    <div><strong>MERSIS:</strong> {company.mersisNumber}</div>
                                                    <div><strong>Şehir:</strong> {company.city}, {company.district}</div>
                                                    <div><strong>Telefon:</strong> {company.phoneNumber}</div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDate(company.createdAt)}
                                                    <span className="text-slate-400">•</span>
                                                    {company.userFirstName} {company.userLastName} ({company.userEmail})
                                                </div>

                                                {company.verificationRejectionReason && (
                                                    <div className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">
                                                        <strong>Red Sebebi:</strong> {company.verificationRejectionReason}
                                                    </div>
                                                )}
                                            </div>

                                            {company.verificationStatus === 1 && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(company.id)}
                                                        disabled={actionLoading === company.id}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="h-4 w-4" /> Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal({ id: company.id, reason: "" })}
                                                        disabled={actionLoading === company.id}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-4 w-4" /> Reddet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Firmayı Reddet</h3>
                        <textarea
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                            placeholder="Red sebebini yazın"
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading === rejectModal.id}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading === rejectModal.id ? "..." : "Reddet"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
