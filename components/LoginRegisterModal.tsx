"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "@/contexts/AuthContext";

type LoginRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
};

export default function LoginRegisterModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginRegisterModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const { login, setUserCompany } = useAuth();
  const [registerData, setRegisterData] = useState({
    companyName: "",
    taxNumber: "",
    mersisNace: "",
    email: "",
    password: "",
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş doğrulama ve giriş
    login();
    setUserCompany(registerData.companyName);
    alert("Hesap doğrulandı! Şirket belgeleriniz incelenecek ve onaylanacaktır.");
    onLoginSuccess();
    onClose();
    // Formu temizle
    setRegisterData({
      companyName: "",
      taxNumber: "",
      mersisNace: "",
      email: "",
      password: "",
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş giriş
    login();
    alert("Giriş başarılı!");
    onLoginSuccess();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === "login" ? "Giriş Yap" : "Kayıt Ol & Doğrula"}
    >
      {/* Tab Buttons */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("register")}
          className={`-mb-px border-b-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "register"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Kayıt Ol
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`-mb-px border-b-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "login"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Giriş Yap
        </button>
      </div>

      {activeTab === "register" ? (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="companyName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Şirket Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              // required
              value={registerData.companyName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Örn: ABC Endüstriyel A.Ş."
            />
          </div>

          <div>
            <label
              htmlFor="taxNumber"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Vergi Numarası <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="taxNumber"
              name="taxNumber"
              // required
              value={registerData.taxNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Örn: 1234567890"
            />
          </div>

          <div>
            <label
              htmlFor="mersisNace"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              MERSİS / NACE Kodu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="mersisNace"
              name="mersisNace"
              // required
              value={registerData.mersisNace}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Örn: TR123456789012345678901234"
            />
            <p className="mt-1 text-xs text-slate-500">
              Şirket doğrulaması için gereklidir
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-posta <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              // required
              value={registerData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Şifre <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              // required
              value={registerData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="En az 8 karakter"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Kayıt Ol ve Doğrula
          </button>
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="loginEmail"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-posta
            </label>
            <input
              type="email"
              id="loginEmail"
              // required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="loginPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Şifre
            </label>
            <input
              type="password"
              id="loginPassword"
              // required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Giriş Yap
          </button>
        </form>
      )}
    </Modal>
  );
}

