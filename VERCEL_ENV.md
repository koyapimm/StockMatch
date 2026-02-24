# Vercel Environment Variables

Production deploy için Vercel Dashboard'da aşağıdaki environment variable'ları ekleyin:

| Key | Value | Açıklama |
|-----|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://stockmatch-backend.onrender.com/api` | Backend API base URL |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `admin@stockmatch.com` | Admin e-postaları (virgülle ayırarak birden fazla eklenebilir) |

**Ayarlama:** Vercel Dashboard → Proje → Settings → Environment Variables
