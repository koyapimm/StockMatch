"use client";

import { useState } from "react";
import Modal from "./Modal";

type NDAModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function NDAModal({
  isOpen,
  onClose,
  onAccept,
}: NDAModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAccept = () => {
    if (isAgreed) {
      setIsAgreed(false); // Reset for next time
      onAccept();
    }
  };

  const handleClose = () => {
    setIsAgreed(false); // Reset checkbox on close
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ticari Gizlilik ve İletişim Sözleşmesi"
      size="large"
    >
      <div className="space-y-6">
        {/* Scrollable Terms */}
        <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                1. TİCARİ GİZLİLİK VE VERİ KORUMA
              </h3>
              <p>
                Bu platform üzerinden yapılan tüm iletişimler ve paylaşılan bilgiler ticari gizlilik
                kapsamındadır. Satıcı ve alıcı taraflar, birbirlerinin kişisel ve ticari bilgilerini
                üçüncü şahıslarla paylaşmayı, satışını veya dağıtımını yapmayı kabul etmezler.
                Tüm iletişim kayıtları şifreli olarak saklanır ve yalnızca ilgili taraflar
                tarafından erişilebilir.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                2. KİMLİK GİZLİLİĞİ VE ANONİMİTE
              </h3>
              <p>
                Platform, B2B ticarette güvenliği sağlamak amacıyla satıcı kimliklerini gizli tutar.
                Alıcılar, satıcıların gerçek şirket isimlerini göremezler; yalnızca doğrulanmış
                satıcı numaralarını görürler. Bu sistem, tarafların güvenli bir şekilde iletişim
                kurmasını ve işlemlerini gerçekleştirmesini sağlar.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                3. İLETİŞİM VE MESAJLAŞMA KURALLARI
              </h3>
              <p>
                Platform üzerinden gönderilen tüm mesajlar profesyonel ve ticari amaçlı olmalıdır.
                Spam, reklam veya uygunsuz içerikli mesajlar yasaktır. İletişim sırasında paylaşılan
                teknik bilgiler, fiyat teklifleri ve ürün detayları gizlilik kapsamındadır ve
                yalnızca ilgili taraflar arasında kalmalıdır.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                4. VERİ İŞLEME VE KULLANIM
              </h3>
              <p>
                Paylaşılan iletişim bilgileri (e-posta, telefon, şirket adı) yalnızca platform
                üzerinden yapılacak iletişimler için kullanılacaktır. Bu bilgiler, ticari
                faaliyetler dışında kullanılamaz, pazarlama amaçlı paylaşılamaz veya üçüncü
                taraflara satılamaz. KVKK ve GDPR uyumlu veri işleme politikaları uygulanır.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                5. SORUMLULUK VE YÜKÜMLÜLÜKLER
              </h3>
              <p>
                Taraflar, platform üzerinden yapılan iletişimlerden ve bu iletişimler sonucunda
                gerçekleştirilen işlemlerden sorumludur. Platform, taraflar arasındaki anlaşmazlıklarda
                yalnızca aracı görevi görür ve doğrudan sorumluluk kabul etmez. Tüm işlemler tarafların
                kendi sorumluluğunda gerçekleşir.
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="nda-agreement"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
          />
          <label
            htmlFor="nda-agreement"
            className="cursor-pointer text-sm font-medium text-slate-900"
          >
            Sözleşmeyi okudum ve kabul ediyorum.
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAccept}
          disabled={!isAgreed}
          className={`w-full rounded-lg px-6 py-3 text-base font-semibold text-white transition-colors ${
            isAgreed
              ? "bg-slate-900 hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          Onayla ve Devam Et
        </button>
      </div>
    </Modal>
  );
}

