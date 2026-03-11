# Backend: HttpOnly Cookie ile Kimlik Doğrulama

Frontend artık JWT'yi **localStorage'a koymuyor**. Token'ı **HttpOnly cookie** ile alıyor; böylece XSS ile JavaScript üzerinden token çalınamaz.

Backend'in aşağıdakileri yapması gerekir.

## 1. Login ve Register yanıtında cookie set et

`POST /Auth/login` ve (otomatik giriş yapıyorsan) `POST /Auth/register` yanıtında **body'de token döndürmek yerine (veya ek olarak)** HTTP header ile cookie set edin:

```
Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
```

- **HttpOnly**: JavaScript erişemez; sadece tarayıcı isteklerde gönderir.
- **Secure**: Sadece HTTPS ile gönderilir (production için zorunlu).
- **SameSite=Strict**: CSRF riskini azaltır (isteğe göre Lax da kullanılabilir).
- **Path=/**: Hangi path'lerde gönderileceği (genelde `/` veya `/api`).
- **Max-Age**: Saniye cinsinden (örn. 86400 = 1 gün).

Örnek (ASP.NET Core):

```csharp
Response.Cookies.Append("token", jwt, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Path = "/",
    MaxAge = TimeSpan.FromDays(1)
});
```

API isteklerinde kimlik doğrulama: **Authorization: Bearer** yerine **Cookie** header'ından `token` değerini okuyup doğrulayın.

## 2. CORS ve credentials

Frontend `fetch(..., { credentials: 'include' })` kullanıyor; cookie cross-origin istekle gider. Backend:

- **Access-Control-Allow-Origin**: `*` kullanmayın; somut origin yazın (örn. `https://www.getstockmatch.com`).
- **Access-Control-Allow-Credentials: true** dönün.

Örnek (ASP.NET Core):

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://www.getstockmatch.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

## 3. Logout endpoint

`POST /Auth/logout` implementasyonu: yanıtta cookie'yi silin (Max-Age=0 veya Expires geçmiş bir tarih):

```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

Böylece kullanıcı çıkış yaptığında tarayıcı cookie'yi kaldırır.

---

Özet: Login/Register'da **Set-Cookie (HttpOnly)**, tüm isteklerde **Cookie'den token oku**, CORS'ta **AllowCredentials** + somut **Origin**, Logout'ta **cookie'yi sil**.
