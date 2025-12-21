"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";

type AuthWarningModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthWarningModal({
  isOpen,
  onClose,
}: AuthWarningModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Giriş Yapmanız Gerekiyor" size="small">
      <div className="space-y-6">
        <p className="text-base text-slate-600">
          Satıcı ile iletişime geçmek ve fiyat teklifi almak için kurumsal hesabınızla giriş yapmalısınız.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              onClose();
              router.push("/login");
            }}
            className="flex-1 rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/register");
            }}
            className="flex-1 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </Modal>
  );
}

