# StockMatch Frontend Geliştirme Talimatları

## Proje Hakkında
StockMatch, firmaların ellerindeki atıl endüstriyel stokları (PLC, motor, sensör, yedek parça vb.) diğer firmalara satabildikleri B2B pazar yeridir.

## Teknoloji Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React (`npm install lucide-react`)
- **State Management:** React Context API

## Backend API Bilgileri
- **Base URL:** `https://localhost:7001/api`
- **Authentication:** JWT Bearer Token
- **Token Storage:** localStorage'da "token" key'i ile

---

## KRİTİK ENUM DEĞERLERİ (ÇOK ÖNEMLİ!)

Frontend'de status kontrolü yaparken bu değerleri kullan:

### CompanyVerificationStatus (Firma Onay Durumu)
```
1 = Pending (Bekliyor)
2 = UnderReview (İnceleniyor)  
3 = Approved (Onaylandı) ✅
4 = Rejected (Reddedildi) ❌
```

### ProductStatus (Ürün Durumu)
```
1 = Draft (Taslak)
2 = Active (Aktif/Yayında) ✅
3 = Sold (Satıldı)
4 = Inactive (Pasif)
```

### ContactRequestStatus (İletişim Talebi Durumu)
```
1 = Pending (Bekliyor)
2 = Approved (Onaylandı) ✅
3 = Rejected (Reddedildi) ❌
4 = Expired (Süresi Doldu)
```

---

## API ENDPOİNTLERİ

### Authentication

#### POST /api/Auth/register
Yeni kullanıcı kaydı.
```json
// Request
{
  "firstName": "string (min 2)",
  "lastName": "string (min 2)",
  "email": "string (valid email, unique)",
  "password": "string (min 8, 1 büyük, 1 küçük, 1 rakam)",
  "confirmPassword": "string",
  "phoneNumber": "string (opsiyonel, sadece rakam)"
}

// Response 201
{
  "success": true,
  "message": "Kayıt başarılı",
  "token": "eyJhbG...",
  "user": {
    "id": 1,
    "firstName": "Kerem",
    "lastName": "Aktürkoğlu",
    "email": "kerem@firma.com",
    "phoneNumber": "5321234567"
  }
}
```

#### POST /api/Auth/login
```json
// Request
{
  "email": "string",
  "password": "string"
}

// Response 200
{
  "success": true,
  "message": "Giriş başarılı",
  "token": "eyJhbG...",
  "user": { ... }
}
```

#### GET /api/Auth/profile
Header: `Authorization: Bearer {token}`
```json
// Response 200
{
  "success": true,
  "user": { ... }
}
```

#### PUT /api/Auth/profile
Header: `Authorization: Bearer {token}`
```json
// Request
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string (opsiyonel)"
}
```

#### POST /api/Auth/change-password
Header: `Authorization: Bearer {token}`
```json
// Request
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmNewPassword": "string"
}
```

---

### Company (Firma)

#### POST /api/Company/create
Header: `Authorization: Bearer {token}`
```json
// Request
{
  "name": "string",
  "taxNumber": "string (10-11 hane, sadece rakam)",
  "taxOffice": "string",
  "mersisNumber": "string (16 hane, sadece rakam)",
  "naceCode": "string (opsiyonel)",
  "address": "string",
  "city": "string",
  "district": "string",
  "postalCode": "string (opsiyonel)",
  "phoneNumber": "string (sadece rakam)",
  "website": "string (opsiyonel)"
}

// Response 201
{
  "success": true,
  "message": "Firma oluşturuldu",
  "company": {
    "id": 1,
    "name": "Test A.Ş.",
    "verificationStatus": 1,
    ...
  }
}
```

#### GET /api/Company/my-company
Header: `Authorization: Bearer {token}`
```json
// Response 200
{
  "success": true,
  "company": {
    "id": 1,
    "name": "Test A.Ş.",
    "taxNumber": "1234567890",
    "taxOffice": "Kadıköy",
    "mersisNumber": "0123456789012345",
    "address": "...",
    "city": "İstanbul",
    "district": "Kadıköy",
    "phoneNumber": "02161234567",
    "website": "https://...",
    "logoUrl": "/uploads/logos/company_1.jpg",
    "verificationStatus": 3,
    "verificationRejectionReason": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

// Firma yoksa Response 404
{
  "success": false,
  "message": "Firma bulunamadı"
}
```

#### PUT /api/Company/update
Header: `Authorization: Bearer {token}`
Sadece değişen alanları gönder.

#### POST /api/Company/logo
Header: `Authorization: Bearer {token}`
Content-Type: `multipart/form-data`
Form field: `file` (image/jpeg, image/png, image/webp, max 5MB)

#### DELETE /api/Company/logo
Header: `Authorization: Bearer {token}`

---

### Category (Kategori)

#### GET /api/Category
```json
// Response 200
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "PLC",
      "description": "...",
      "parentCategoryId": null,
      "subCategories": []
    },
    {
      "id": 2,
      "name": "Motor",
      "description": "...",
      "parentCategoryId": null,
      "subCategories": []
    }
  ]
}
```

---

### Product (Ürün)

#### GET /api/Product/search
Query parametreleri (hepsi opsiyonel):
- `keyword`: string
- `categoryId`: number
- `minPrice`: number
- `maxPrice`: number
- `brand`: string
- `condition`: string ("Sıfır", "Yeni Gibi", "Yenilenmiş", "İkinci El", "Kullanılmış")
- `page`: number (default 1)
- `pageSize`: number (default 20)

```json
// Response 200
{
  "success": true,
  "message": "24 ürün bulundu",
  "products": [
    {
      "id": 1,
      "title": "Siemens S7-1200 PLC",
      "description": "...",
      "brand": "Siemens",
      "model": "S7-1200",
      "partNumber": "6ES7214-1AG40-0XB0",
      "quantity": 5,
      "minimumOrderQuantity": 1,
      "unitPrice": 15000,
      "currency": "TRY",
      "condition": "Sıfır",
      "warrantyInfo": "2 yıl",
      "region": "İstanbul",
      "status": 2,
      "viewCount": 150,
      "createdAt": "2024-01-01T00:00:00Z",
      "publishedAt": "2024-01-01T00:00:00Z",
      "categoryId": 1,
      "categoryName": "PLC",
      "companyId": 1,
      "companyName": "Test A.Ş.",
      "images": [
        {
          "id": 1,
          "productId": 1,
          "imageUrl": "/uploads/products/product_1_img1.jpg",
          "isPrimary": true,
          "displayOrder": 1
        }
      ]
    }
  ],
  "totalCount": 24
}
```

#### GET /api/Product/{id}
Tek ürün detayı.

#### GET /api/Product/my-products
Header: `Authorization: Bearer {token}`
Kullanıcının firmasına ait ürünler.

#### POST /api/Product/create
Header: `Authorization: Bearer {token}`
**Önemli:** Firma onaylı olmalı (verificationStatus === 3)
```json
// Request
{
  "categoryId": 1,
  "title": "string (min 5)",
  "description": "string (min 20)",
  "brand": "string (opsiyonel)",
  "model": "string (opsiyonel)",
  "partNumber": "string (opsiyonel)",
  "quantity": "number (min 1)",
  "minimumOrderQuantity": "number (min 1)",
  "unitPrice": "number (min 1)",
  "currency": "TRY | USD | EUR",
  "condition": "Sıfır | Yeni Gibi | Yenilenmiş | İkinci El | Kullanılmış",
  "warrantyInfo": "string (opsiyonel)"
}

// Response 201
{
  "success": true,
  "message": "Ürün oluşturuldu",
  "product": { ... }
}
```

#### PUT /api/Product/{id}
Header: `Authorization: Bearer {token}`
Sadece değişen alanları gönder.

#### DELETE /api/Product/{id}
Header: `Authorization: Bearer {token}`

#### POST /api/Product/{id}/publish
Header: `Authorization: Bearer {token}`
Ürünü yayınlar (status: 1 → 2)

#### POST /api/Product/{id}/unpublish
Header: `Authorization: Bearer {token}`
Ürünü yayından kaldırır (status: 2 → 1)

---

### ProductImage (Ürün Görseli)

#### POST /api/ProductImage/upload/{productId}?isPrimary=true
Header: `Authorization: Bearer {token}`
Content-Type: `multipart/form-data`
Form field: `file`
Max 5 görsel per ürün.

#### DELETE /api/ProductImage/{imageId}
Header: `Authorization: Bearer {token}`

#### POST /api/ProductImage/{imageId}/set-primary
Header: `Authorization: Bearer {token}`

---

### ContactRequest (İletişim Talebi)

#### POST /api/ContactRequest/create
Header: `Authorization: Bearer {token}`
**Önemli:** Firma onaylı olmalı (verificationStatus === 3)
```json
// Request
{
  "productId": 1,
  "message": "string",
  "contactPhone": "string (opsiyonel)",
  "ndaAccepted": true
}

// Response 201
{
  "success": true,
  "message": "Talep gönderildi",
  "contactRequest": { ... }
}
```

#### GET /api/ContactRequest/received
Header: `Authorization: Bearer {token}`
Firmaya gelen talepler.
```json
// Response 200
{
  "success": true,
  "contactRequests": [
    {
      "id": 1,
      "productId": 1,
      "productTitle": "Siemens S7-1200",
      "message": "...",
      "contactPhone": "5321234567",
      "status": 1,
      "createdAt": "...",
      "reviewedAt": null,
      "rejectionReason": null,
      "buyerCompanyName": "ABC Ltd.",
      "buyerContactName": "Ahmet Yılmaz",
      "buyerEmail": "ahmet@abc.com"
    }
  ]
}
```

#### GET /api/ContactRequest/sent
Header: `Authorization: Bearer {token}`
Firmanın gönderdiği talepler.
**Önemli:** status === 2 ise satıcı bilgileri görünür:
```json
{
  "sellerCompanyName": "Test A.Ş.",
  "sellerPhone": "02161234567",
  "sellerEmail": "info@test.com"
}
```

#### POST /api/ContactRequest/{id}/review
Header: `Authorization: Bearer {token}`
```json
// Onay
{ "approve": true }

// Red
{ "approve": false, "rejectionReason": "Stok tükendi" }
```

---

### Admin (Sadece admin kullanıcılar)

Admin kontrolü: `user.email === "admin@stockmatch.com" || user.email === "ahmet@test.com"`

#### GET /api/Admin/dashboard
```json
// Response 200
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalCompanies": 45,
    "pendingCompanies": 5,
    "approvedCompanies": 38,
    "totalProducts": 320,
    "activeProducts": 280,
    "totalContactRequests": 89
  }
}
```

#### GET /api/Admin/companies
Tüm firmalar.

#### GET /api/Admin/companies/pending
Onay bekleyen firmalar.

#### POST /api/Admin/companies/{id}/verify
```json
// Onay
{ "approve": true }

// Red
{ "approve": false, "rejectionReason": "Eksik belgeler" }
```

---

## SAYFA YAPISI

### Public Sayfalar (Giriş gerekmez)

1. **/** - Ana Sayfa
   - Hero section (başlık, arama kutusu)
   - Öne çıkan ürünler (GET /api/Product/search?pageSize=8)
   - Özellikler section
   - CTA section
   - Footer

2. **/login** - Giriş Sayfası
   - Email + şifre formu
   - Hata gösterimi
   - Başarılı girişte /dashboard'a yönlendir

3. **/register** - Kayıt Sayfası (2 Adımlı)
   - Adım 1: Kişisel bilgiler (ad, soyad, email, şifre)
   - Adım 2: Firma bilgileri (opsiyonel, "Daha Sonra" butonu ile atlanabilir)
   - Başarılı kayıtta /dashboard'a yönlendir

4. **/products** - Ürün Listesi
   - Arama kutusu
   - Filtreler (kategori, durum, fiyat)
   - Ürün kartları grid
   - Sayfalama

5. **/product/[id]** - Ürün Detay
   - Görsel galerisi
   - Ürün bilgileri
   - "Satıcıyla İletişime Geç" butonu
   - Giriş yapılmamışsa login'e yönlendir
   - Firma onaylı değilse uyarı göster
   - NDA onayı ile iletişim modal'ı

### Protected Sayfalar (Giriş gerekli)

6. **/dashboard** - Kontrol Paneli
   - Hoşgeldin mesajı
   - Firma yoksa veya onaylı değilse uyarı
   - İstatistik kartları
   - Hızlı işlemler
   - Son ürünler
   - Son talepler

7. **/dashboard/products** - Ürünlerim
   - Ürün tablosu
   - Yayınla/Kaldır butonları
   - Düzenle/Sil butonları
   - "Yeni Ürün" butonu

8. **/dashboard/products/new** - Yeni Ürün
   - Görsel yükleme (max 5)
   - Kategori seçimi
   - Form alanları
   - Firma onaylı değilse uyarı göster

9. **/dashboard/products/[id]** - Ürün Düzenle
   - Mevcut görseller + silme
   - Yeni görsel ekleme
   - Form alanları

10. **/dashboard/requests** - İletişim Talepleri
    - Tab: Gelen / Gönderilen
    - Gelen için: Onayla/Reddet butonları
    - Onaylanmış taleplerde iletişim bilgileri

11. **/dashboard/company** - Firma Ayarları
    - Logo yükleme/silme
    - Firma bilgileri formu
    - Doğrulama durumu badge'i

12. **/dashboard/settings** - Profil Ayarları
    - Profil bilgileri formu
    - Şifre değiştirme formu

### Admin Sayfası

13. **/admin** - Admin Panel
    - Navbar'da sadece admin'e görünür link
    - Dashboard istatistikleri
    - Firma listesi (bekleyen/tümü)
    - Onayla/Reddet butonları

---

## API HELPER FONKSİYONLARI

```typescript
// lib/api.ts

const API_BASE_URL = "https://localhost:7001/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const getBackendBaseUrl = () => "https://localhost:7001";

export const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-product.jpg";
  if (path.startsWith("http")) return path;
  return `${getBackendBaseUrl()}${path.startsWith("/") ? path : "/" + path}`;
};

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 204) {
    return { success: true } as T;
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.errors?.join(", ") || "Bir hata oluştu");
  }

  return data;
}

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    fetchApi("/Auth/login", { method: "POST", body: JSON.stringify(data) }),
  
  register: (data: any) =>
    fetchApi("/Auth/register", { method: "POST", body: JSON.stringify(data) }),
  
  getProfile: () => fetchApi("/Auth/profile"),
  
  updateProfile: (data: any) =>
    fetchApi("/Auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  
  changePassword: (data: any) =>
    fetchApi("/Auth/change-password", { method: "POST", body: JSON.stringify(data) }),
};

// Company
export const companyApi = {
  create: (data: any) =>
    fetchApi("/Company/create", { method: "POST", body: JSON.stringify(data) }),
  
  getMyCompany: () => fetchApi("/Company/my-company"),
  
  update: (data: any) =>
    fetchApi("/Company/update", { method: "PUT", body: JSON.stringify(data) }),
  
  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/Company/logo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return response.json();
  },
  
  deleteLogo: () => fetchApi("/Company/logo", { method: "DELETE" }),
};

// Category
export const categoryApi = {
  getAll: () => fetchApi("/Category"),
};

// Product
export const productApi = {
  search: (params: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    return fetchApi(`/Product/search?${query}`);
  },
  
  getById: (id: number) => fetchApi(`/Product/${id}`),
  
  getMyProducts: () => fetchApi("/Product/my-products"),
  
  create: (data: any) =>
    fetchApi("/Product/create", { method: "POST", body: JSON.stringify(data) }),
  
  update: (id: number, data: any) =>
    fetchApi(`/Product/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  
  delete: (id: number) =>
    fetchApi(`/Product/${id}`, { method: "DELETE" }),
  
  publish: (id: number) =>
    fetchApi(`/Product/${id}/publish`, { method: "POST" }),
  
  unpublish: (id: number) =>
    fetchApi(`/Product/${id}/unpublish`, { method: "POST" }),
};

// ProductImage
export const productImageApi = {
  upload: async (productId: number, file: File, isPrimary = false) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      `${API_BASE_URL}/ProductImage/upload/${productId}?isPrimary=${isPrimary}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      }
    );
    return response.json();
  },
  
  delete: (imageId: number) =>
    fetchApi(`/ProductImage/${imageId}`, { method: "DELETE" }),
  
  setPrimary: (imageId: number) =>
    fetchApi(`/ProductImage/${imageId}/set-primary`, { method: "POST" }),
};

// ContactRequest
export const contactRequestApi = {
  create: (data: any) =>
    fetchApi("/ContactRequest/create", { method: "POST", body: JSON.stringify(data) }),
  
  getReceived: () => fetchApi("/ContactRequest/received"),
  
  getSent: () => fetchApi("/ContactRequest/sent"),
  
  review: (id: number, data: { approve: boolean; rejectionReason?: string }) =>
    fetchApi(`/ContactRequest/${id}/review`, { method: "POST", body: JSON.stringify(data) }),
};

// Admin
export const adminApi = {
  getDashboard: () => fetchApi("/Admin/dashboard"),
  
  getAllCompanies: () => fetchApi("/Admin/companies"),
  
  getPendingCompanies: () => fetchApi("/Admin/companies/pending"),
  
  verifyCompany: (id: number, data: { approve: boolean; rejectionReason?: string }) =>
    fetchApi(`/Admin/companies/${id}/verify`, { method: "POST", body: JSON.stringify(data) }),
};
```

---

## AUTH CONTEXT

```typescript
// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, companyApi, getToken, setToken, removeToken } from "@/lib/api";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface Company {
  id: number;
  name: string;
  verificationStatus: number;
  // ... diğer alanlar
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          await refreshUser();
          setIsLoggedIn(true);
        } catch {
          removeToken();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const refreshUser = async () => {
    const response = await authApi.getProfile();
    if (response.success && response.user) {
      setUser(response.user);
      await refreshCompany();
    }
  };

  const refreshCompany = async () => {
    try {
      const response = await companyApi.getMyCompany();
      if (response.success && response.company) {
        setCompany(response.company);
      } else {
        setCompany(null);
      }
    } catch {
      setCompany(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        setIsLoggedIn(true);
        await refreshCompany();
        return { success: true, message: "Giriş başarılı" };
      }
      return { success: false, message: response.message || "Giriş başarısız" };
    } catch (error: any) {
      return { success: false, message: error.message || "Giriş başarısız" };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        setIsLoggedIn(true);
        return { success: true, message: "Kayıt başarılı" };
      }
      return { success: false, message: response.message || "Kayıt başarısız" };
    } catch (error: any) {
      return { success: false, message: error.message || "Kayıt başarısız" };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setCompany(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, isLoading, user, company,
      login, register, logout, refreshUser, refreshCompany
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

---

## STATUS BADGE HELPER

```typescript
// lib/utils.ts

// Firma durumu badge'i
export const getCompanyStatusBadge = (status: number) => {
  switch (status) {
    case 1: return { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" };
    case 2: return { label: "İnceleniyor", color: "bg-blue-100 text-blue-800" };
    case 3: return { label: "Onaylı", color: "bg-green-100 text-green-800" };
    case 4: return { label: "Reddedildi", color: "bg-red-100 text-red-800" };
    default: return { label: "Bilinmiyor", color: "bg-gray-100 text-gray-800" };
  }
};

// Ürün durumu badge'i
export const getProductStatusBadge = (status: number) => {
  switch (status) {
    case 1: return { label: "Taslak", color: "bg-yellow-100 text-yellow-800" };
    case 2: return { label: "Aktif", color: "bg-green-100 text-green-800" };
    case 3: return { label: "Satıldı", color: "bg-blue-100 text-blue-800" };
    case 4: return { label: "Pasif", color: "bg-gray-100 text-gray-800" };
    default: return { label: "Bilinmiyor", color: "bg-gray-100 text-gray-800" };
  }
};

// Talep durumu badge'i
export const getRequestStatusBadge = (status: number) => {
  switch (status) {
    case 1: return { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" };
    case 2: return { label: "Onaylandı", color: "bg-green-100 text-green-800" };
    case 3: return { label: "Reddedildi", color: "bg-red-100 text-red-800" };
    case 4: return { label: "Süresi Doldu", color: "bg-gray-100 text-gray-800" };
    default: return { label: "Bilinmiyor", color: "bg-gray-100 text-gray-800" };
  }
};

// Para birimi formatı
export const formatCurrency = (price: number, currency: string) => {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₺";
  return `${symbol}${price.toLocaleString("tr-TR")}`;
};

// Tarih formatı
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
```

---

## ÖNEMLİ NOTLAR

1. **Telefon numaraları:** Backend sadece rakam kabul ediyor. Göndermeden önce `phoneNumber.replace(/\D/g, "")` ile temizle.

2. **Admin kontrolü:** Navbar'da admin linkini sadece admin kullanıcılara göster:
   ```typescript
   const isAdmin = user?.email === "admin@stockmatch.com" || user?.email === "ahmet@test.com";
   ```

3. **Firma kontrolü:** Ürün eklemek ve iletişim talebi göndermek için firma gerekli VE firma onaylı olmalı (verificationStatus === 3).

4. **Görsel URL'leri:** Backend'den gelen path'ler relative. `getImageUrl()` helper'ı kullan.

5. **Protected routes:** `/dashboard/*` sayfalarında token kontrolü yap. Yoksa `/login`'e yönlendir.

6. **HTTPS:** Backend https://localhost:7001 kullanıyor. Tarayıcı sertifika uyarısı verebilir, kabul et.

---

## BAŞLANGIÇ

```bash
npx create-next-app@latest stockmatch-frontend --typescript --tailwind --app
cd stockmatch-frontend
npm install lucide-react
npm run dev
```

Şimdi yukarıdaki tüm bilgileri kullanarak tam çalışan bir frontend geliştir.
