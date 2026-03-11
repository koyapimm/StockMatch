# Güvenlik Kontrol Listesi (Frontend)

Son tarama tarihi referansıyla özet. Backend ayrıca değerlendirilmeli.

---

## İkinci kontrol (detaylı tarama)

Aşağıdaki kontroller tekrar çalıştırıldı:

| Kontrol | Sonuç |
|--------|--------|
| `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` | **Yok** (tüm proje) |
| `document.write`, `.html()` | **Yok** |
| `localStorage` / `sessionStorage` kullanımı | **Yok** (sadece api.ts’te yorum + no-op; token artık cookie) |
| `getToken` / `setToken` / `removeToken` gerçek kullanımı | **Yok** (sadece no-op export; AuthContext token kullanmıyor) |
| Dinamik `href` / `src` | `product.id`, `request.productId` (sayı), `getApiImageUrl(imageUrl)` (API path). **Kullanıcı girdisi doğrudan href’e konmuyor.** |
| `tel:` / `mailto:` | `request.sellerPhone`, `request.sellerEmail` (API’den). Protokol sabit `tel:` / `mailto:`; tıklanınca script çalışmaz. İsteğe bağlı: backend’de format doğrulama veya frontend’de sadece rakam/+ için allowlist. |
| `router.push` / URL | Sadece `encodeURIComponent(searchQuery)` (arama). Sabit path’ler veya sayısal id. **Güvenli.** |
| `window.location` | Sadece iletisim: `mailto:...?subject=...&body=...` (encodeURIComponent ile). **Güvenli.** |
| `searchParams.get` | `keyword`, `tab`, `registered` — sadece okuma/filtre; React’te render escape. **Güvenli.** |
| API `fetch` URL’i | Hep `API_BASE_URL` + endpoint; **kullanıcı kontrollü URL yok.** |
| `JSON.parse` (kullanıcı girdisi) | **Yok.** |
| `target="_blank"` (tabnabbing) | **Yok.** |
| iframe / object / embed (kullanıcı içeriği) | **Yok.** |

**Sonuç:** Kritik açık tespit edilmedi. Önceki özet geçerli.

---

## ✅ İyi Durumda

| Konu | Durum |
|------|--------|
| **XSS** | `dangerouslySetInnerHTML`, `innerHTML`, `eval` yok. React varsayılan escape kullanılıyor. |
| **Token** | JWT artık HttpOnly cookie ile; JavaScript erişemiyor (XSS’te çalınamaz). |
| **localStorage** | Sadece eski token API’si (no-op); hassas veri tutulmuyor. |
| **URL / redirect** | `router.push` ve `encodeURIComponent` (örn. arama) kullanılıyor. |
| **İletişim mailto** | Sabit `mailto:` + `encodeURIComponent` ile güvenli. |
| **Gizli bilgi** | Kodda şifre / API key yok; sadece `NEXT_PUBLIC_*` env (tasarlanmış şekilde public). |

---

## ✅ Backend ile uyumlu (doğrulanmış)

| Konu | Backend durumu |
|------|----------------|
| **Görsel URL** | API sadece kendi ürettiği relative path döndürüyor (`/uploads/products/...`, `/uploads/logos/...`). Keyfi domain/path set edilmiyor; frontend `getApiImageUrl` ile güvenli. |
| **Dosya yükleme** | Ürün görseli ve logo: uzantı allowlist + boyut + **magic bytes** (JPEG/PNG/WEBP imza kontrolü). MIME/uzantı spoof ile tehlikeli dosya reddediliyor. |
| **Admin yetkisi** | Tüm admin endpoint’lerinde `IsAdminAsync(userId)`; false ise `Forbid()`. Yetki API’de zorunlu. |
| **IDOR** | Ürün, ürün görseli, firma, iletişim talebi (review): kaynak sahipliği (`CompanyId` / `SellerCompanyId` vs.) backend’de kontrol ediliyor. |

---

## 🔒 Auth (HttpOnly cookie)

- HttpOnly cookie (login/logout, `credentials: 'include'`)
- CORS: somut origin + `AllowCredentials` (backend’de)
- SameSite / Secure cookie (backend’de)

---

## Özet

Frontend’de kritik açık yok; XSS pattern yok, token cookie’de. Backend tarafında görsel URL’i güvenilir path, dosya yüklemede magic bytes doğrulaması, admin ve IDOR kontrolleri uygulanmış durumda. Periyodik `npm audit` ve bağımlılık güncellemeleri önerilir.
