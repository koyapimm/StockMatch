// Status Badge Helpers - B2B profesyonel palet (slate tonları)
export const getCompanyStatusBadge = (status: number) => {
    switch (status) {
        case 1: return { label: "Bekliyor", color: "bg-slate-200 text-slate-800" };
        case 2: return { label: "İnceleniyor", color: "bg-slate-200 text-slate-700" };
        case 3: return { label: "Onaylı", color: "bg-slate-700 text-white" };
        case 4: return { label: "Reddedildi", color: "bg-slate-100 text-slate-600" };
        default: return { label: "Bilinmiyor", color: "bg-slate-100 text-slate-600" };
    }
};

export const getProductStatusBadge = (status: number) => {
    switch (status) {
        case 1: return { label: "Taslak", color: "bg-slate-200 text-slate-700" };
        case 2: return { label: "Aktif", color: "bg-slate-700 text-white" };
        case 3: return { label: "Satıldı", color: "bg-slate-200 text-slate-800" };
        case 4: return { label: "Pasif", color: "bg-slate-100 text-slate-600" };
        default: return { label: "Bilinmiyor", color: "bg-slate-100 text-slate-600" };
    }
};

export const getRequestStatusBadge = (status: number) => {
    switch (status) {
        case 1: return { label: "Bekliyor", color: "bg-slate-200 text-slate-800" };
        case 2: return { label: "Onaylandı", color: "bg-slate-700 text-white" };
        case 3: return { label: "Reddedildi", color: "bg-slate-100 text-slate-600" };
        case 4: return { label: "Süresi Doldu", color: "bg-slate-100 text-slate-600" };
        default: return { label: "Bilinmiyor", color: "bg-slate-100 text-slate-600" };
    }
};

// Currency formatter
export const formatCurrency = (price: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₺";
    return `${symbol}${price.toLocaleString("tr-TR")}`;
};

// Date formatter
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

// Phone number cleaner (removes non-digits)
export const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, "");
};

// Admin check - NEXT_PUBLIC_ADMIN_EMAILS: virgülle ayrılmış e-posta listesi
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@stockmatch.com,ahmet@test.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminUser = (email?: string) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

// Resim validasyonu - dosya tipi ve boyut
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type ImageValidationResult =
    | { valid: true }
    | { valid: false; error: string };

export const validateImageFile = (file: File): ImageValidationResult => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: "Sadece JPEG, PNG, WebP veya GIF formatında görseller yüklenebilir.",
        };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return {
            valid: false,
            error: "Her görsel en fazla 5 MB olabilir.",
        };
    }
    return { valid: true };
};
