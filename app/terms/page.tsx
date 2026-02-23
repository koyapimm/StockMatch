import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">Kullanım Şartları</h1>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">1. Genel Hükümler</h2>
                        <p>
                            StockMatch platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
                            Bu platform, yalnızca tüzel kişiliklerin (şirketlerin) kullanımına açıktır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">2. Hesap ve Üyelik</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Platformumuza kayıt olmak için geçerli bir vergi numarası ve MERSIS numarasına sahip olmanız gerekmektedir.</li>
                            <li>Sağlanan bilgilerin doğruluğundan tamamen siz sorumlusunuz.</li>
                            <li>Hesabınızın güvenliğinden siz sorumlusunuz; şifrenizi kimseyle paylaşmayın.</li>
                            <li>Yanlış veya yanıltıcı bilgi veren hesaplar kalıcı olarak kapatılabilir.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">3. İlan ve Ürünler</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Yalnızca sahip olduğunuz veya satma yetkiniz olan ürünleri listeleyebilirsiniz.</li>
                            <li>Ürün açıklamaları doğru ve eksiksiz olmalıdır.</li>
                            <li>Yasadışı, tehlikeli veya kısıtlanmış ürünlerin listelenmesi yasaktır.</li>
                            <li>Fiyatlandırma manipülasyonu veya sahte stok bilgisi vermek yasaktır.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">4. İletişim ve İşlemler</h2>
                        <p>
                            Alıcı ve satıcı arasındaki iletişim platformumuz üzerinden sağlanır.
                            Gizlilik anlaşmasını (NDA) kabul ettikten sonra iletişim bilgilerine erişim sağlanır.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>İşlem detayları taraflar arasında belirlenir; StockMatch aracı değildir.</li>
                            <li>Platform dışı iletişime geçmek yasaktır.</li>
                            <li>Spam veya istenmeyen mesajlar göndermek yasaktır.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">5. Fikri Mülkiyet</h2>
                        <p>
                            Platform üzerindeki tüm içerik, tasarım ve markalar StockMatch&apos;e aittir.
                            İzinsiz kopyalama veya kullanım yasaktır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">6. Sorumluluk Reddi</h2>
                        <p>
                            StockMatch, kullanıcılar arasındaki işlemlerin sonucundan veya ürün kalitesinden sorumlu değildir.
                            Platform yalnızca bir buluşma noktası sağlamaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900">7. Değişiklikler</h2>
                        <p>
                            Bu şartlar önceden haber verilmeksizin değiştirilebilir.
                            Değişiklikler yayınlandığı anda yürürlüğe girer.
                        </p>
                    </section>

                    <section className="rounded-lg bg-slate-100 p-6">
                        <p className="text-sm text-slate-600">
                            <strong>Son güncelleme:</strong> Ocak 2026
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Sorularınız için: <a href="mailto:destek@stockmatch.com" className="text-slate-900 hover:underline">destek@stockmatch.com</a>
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
