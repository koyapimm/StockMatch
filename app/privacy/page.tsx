import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">Gizlilik Politikası</h1>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">1. Giriş</h2>
                        <p>
                            StockMatch olarak gizliliğinize önem veriyoruz. Bu politika, kişisel ve kurumsal
                            verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">2. Toplanan Veriler</h2>
                        <h3 className="text-xl font-medium text-slate-800">2.1 Kişisel Veriler</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Ad, soyad ve iletişim bilgileri</li>
                            <li>E-posta adresi ve telefon numarası</li>
                            <li>Şifre (şifrelenmiş olarak saklanır)</li>
                        </ul>

                        <h3 className="mt-4 text-xl font-medium text-slate-800">2.2 Kurumsal Veriler</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Firma adı ve adresi</li>
                            <li>Vergi numarası ve vergi dairesi</li>
                            <li>MERSIS numarası ve NACE kodu</li>
                            <li>Firma logosu ve website adresi</li>
                        </ul>

                        <h3 className="mt-4 text-xl font-medium text-slate-800">2.3 Kullanım Verileri</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Oturum açma zamanları ve IP adresleri</li>
                            <li>Platform üzerindeki aktiviteler</li>
                            <li>İlan görüntüleme ve iletişim talepleri</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">3. Verilerin Kullanımı</h2>
                        <p>Topladığımız verileri aşağıdaki amaçlarla kullanıyoruz:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Platform hizmetlerinin sağlanması ve iyileştirilmesi</li>
                            <li>Firma doğrulama süreçlerinin yürütülmesi</li>
                            <li>Kullanıcılar arası güvenli iletişimin sağlanması</li>
                            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                            <li>Dolandırıcılık ve kötüye kullanımın önlenmesi</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">4. Veri Paylaşımı</h2>
                        <p>
                            Verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Açık rızanız olduğunda</li>
                            <li>Yasal zorunluluk halinde</li>
                            <li>NDA kabul edildiğinde, sadece ilgili satıcı/alıcıya iletişim bilgileri</li>
                            <li>Hizmet sağlayıcılarımızla (hosting, e-posta servisleri vb.)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">5. Veri Güvenliği</h2>
                        <p>
                            Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>SSL/TLS şifrelemesi</li>
                            <li>Güvenli veri merkezleri</li>
                            <li>Şifrelerin hash&apos;lenerek saklanması</li>
                            <li>Erişim kontrolü ve yetkilendirme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">6. Çerezler (Cookies)</h2>
                        <p>
                            Platformumuz oturum yönetimi ve kullanıcı deneyimini iyileştirmek için çerezler kullanır.
                            Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">7. Haklarınız</h2>
                        <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Verilerinize erişim hakkı</li>
                            <li>Verilerin düzeltilmesini talep hakkı</li>
                            <li>Verilerin silinmesini talep hakkı</li>
                            <li>İşlemenin kısıtlanmasını talep hakkı</li>
                            <li>Veri taşınabilirliği hakkı</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">8. İletişim</h2>
                        <p>
                            Gizlilik ile ilgili sorularınız veya talepleriniz için bizimle iletişime geçebilirsiniz:
                        </p>
                    </section>

                    <section className="rounded-lg bg-slate-100 p-6">
                        <p className="text-sm text-slate-600">
                            <strong>E-posta:</strong> <a href="mailto:kvkk@stockmatch.com" className="text-slate-900 hover:underline">kvkk@stockmatch.com</a>
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            <strong>Son güncelleme:</strong> Ocak 2026
                        </p>
                    </section>
                </div>

                <div className="mt-8">
                    <Link href="/register" className="text-sm font-medium text-slate-900 hover:underline">
                        ← Kayıt sayfasına dön
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
