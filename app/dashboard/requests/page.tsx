"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { contactRequestApi, ContactRequestDto } from "@/lib/api";
import { getRequestStatusBadge, formatDate } from "@/lib/utils";
import { MessageSquare, CheckCircle, XCircle, Clock, Phone, Mail, Building2 } from "lucide-react";

function RequestsContent() {
    const router = useRouter();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");
    const { isLoggedIn, isLoading: authLoading, company } = useAuth();
    const [activeTab, setActiveTab] = useState<"received" | "sent">(
        tabParam === "sent" ? "sent" : "received"
    );
    const [receivedRequests, setReceivedRequests] = useState<ContactRequestDto[]>([]);
    const [sentRequests, setSentRequests] = useState<ContactRequestDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: number; reason: string } | null>(null);

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
        if (tabParam === "sent" || tabParam === "received") {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!isLoggedIn) return;
            try {
                const [receivedRes, sentRes] = await Promise.all([
                    contactRequestApi.getReceived(),
                    contactRequestApi.getSent(),
                ]);
                if (receivedRes.success) setReceivedRequests(receivedRes.contactRequests);
                if (sentRes.success) setSentRequests(sentRes.contactRequests);
            } catch (error) {
                showToast(error instanceof Error ? error.message : "Talepler yüklenirken bir hata oluştu.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchRequests();
        }
    }, [isLoggedIn, showToast]);

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            const response = await contactRequestApi.review(id, { approve: true });
            if (response.success) {
                setReceivedRequests((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: 2 } : r))
                );
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
            const response = await contactRequestApi.review(rejectModal.id, {
                approve: false,
                rejectionReason: rejectModal.reason,
            });
            if (response.success) {
                setReceivedRequests((prev) =>
                    prev.map((r) =>
                        r.id === rejectModal.id
                            ? { ...r, status: 3, rejectionReason: rejectModal.reason }
                            : r
                    )
                );
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Reddetme hatası.", "error");
        } finally {
            setActionLoading(null);
            setRejectModal(null);
        }
    };

    if (authLoading || !isLoggedIn || (!company && isLoggedIn)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
        );
    }

    const pendingCount = receivedRequests.filter(r => r.status === 1).length;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">İletişim Talepleri</h1>
                    <p className="mt-1 text-slate-600">Gelen ve gönderilen iletişim taleplerini yönetin.</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-slate-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("received")}
                            className={`relative pb-3 text-sm font-medium transition-colors ${activeTab === "received"
                                    ? "border-b-2 border-slate-900 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Gelen Talepler
                            {pendingCount > 0 && (
                                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-600 text-xs text-white">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("sent")}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "sent"
                                    ? "border-b-2 border-slate-900 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Gönderilen Talepler
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center">
                        <div className="animate-pulse text-slate-500">Yükleniyor...</div>
                    </div>
                ) : (
                    <>
                        {/* Received Tab */}
                        {activeTab === "received" && (
                            <div className="space-y-4">
                                {receivedRequests.length === 0 ? (
                                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                                        <MessageSquare className="mx-auto h-16 w-16 text-slate-300" />
                                        <h3 className="mt-4 text-lg font-semibold text-slate-900">Henüz Talep Yok</h3>
                                        <p className="mt-2 text-slate-600">Ürünlerinize iletişim talebi geldiğinde burada görünecek.</p>
                                    </div>
                                ) : (
                                    receivedRequests.map((request) => {
                                        const statusBadge = getRequestStatusBadge(request.status);
                                        return (
                                            <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <Link href={`/product/${request.productId}`} className="text-lg font-semibold text-slate-900 hover:text-slate-600">
                                                                {request.productTitle}
                                                            </Link>
                                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge.color}`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                                            <Building2 className="h-4 w-4" />
                                                            {request.buyerCompanyName}
                                                            <span className="text-slate-400">•</span>
                                                            {request.buyerContactName}
                                                        </div>

                                                        <p className="mt-3 text-slate-700">{request.message}</p>

                                                        {request.contactPhone && (
                                                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                                                <Phone className="h-4 w-4" />
                                                                {request.contactPhone}
                                                            </div>
                                                        )}

                                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                                            <Clock className="h-4 w-4" />
                                                            {formatDate(request.createdAt)}
                                                        </div>

                                                        {request.rejectionReason && (
                                                            <div className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">
                                                                <strong>Red Sebebi:</strong> {request.rejectionReason}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {request.status === 1 && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApprove(request.id)}
                                                                disabled={actionLoading === request.id}
                                                                className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                                                            >
                                                                <CheckCircle className="h-4 w-4" /> Onayla
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectModal({ id: request.id, reason: "" })}
                                                                disabled={actionLoading === request.id}
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

                        {/* Sent Tab */}
                        {activeTab === "sent" && (
                            <div className="space-y-4">
                                {sentRequests.length === 0 ? (
                                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                                        <MessageSquare className="mx-auto h-16 w-16 text-slate-300" />
                                        <h3 className="mt-4 text-lg font-semibold text-slate-900">Henüz Talep Göndermediniz</h3>
                                        <p className="mt-2 text-slate-600">Ürünlere iletişim talebi gönderdiğinizde burada görünecek.</p>
                                        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-slate-900 hover:underline">
                                            Ürünleri İncele →
                                        </Link>
                                    </div>
                                ) : (
                                    [...sentRequests]
                                        .sort((a, b) => {
                                            const order = (s: number) => (s === 2 ? 0 : s === 1 ? 1 : s === 3 ? 2 : 3);
                                            return order(a.status) - order(b.status);
                                        })
                                        .map((request) => {
                                        const statusBadge = getRequestStatusBadge(request.status);
                                        return (
                                            <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <Link href={`/product/${request.productId}`} className="text-lg font-semibold text-slate-900 hover:text-slate-600">
                                                                {request.productTitle}
                                                            </Link>
                                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge.color}`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </div>

                                                        <p className="mt-3 text-slate-700">{request.message}</p>

                                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                                            <Clock className="h-4 w-4" />
                                                            {formatDate(request.createdAt)}
                                                        </div>
                                                    </div>

                                                    {/* Seller info if approved */}
                                                    {request.status === 2 && request.sellerCompanyName && (
                                                        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                                                            <h4 className="mb-2 font-semibold text-slate-800">Satıcı İletişim Bilgileri</h4>
                                                            <div className="space-y-2 text-sm text-slate-700">
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="h-4 w-4" />
                                                                    {request.sellerCompanyName}
                                                                </div>
                                                                {request.sellerPhone && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-4 w-4" />
                                                                        <a href={`tel:${request.sellerPhone}`} className="hover:underline">{request.sellerPhone}</a>
                                                                    </div>
                                                                )}
                                                                {request.sellerEmail && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Mail className="h-4 w-4" />
                                                                        <a href={`mailto:${request.sellerEmail}`} className="hover:underline">{request.sellerEmail}</a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {request.rejectionReason && (
                                                        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
                                                            <strong>Red Sebebi:</strong> {request.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Talebi Reddet</h3>
                        <textarea
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                            placeholder="Red sebebini yazın (opsiyonel)"
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

export default function RequestsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
        }>
            <RequestsContent />
        </Suspense>
    );
}
