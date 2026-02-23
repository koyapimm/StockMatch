"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { isAdminUser } from "@/lib/utils";

export default function Navbar() {
  const { isLoggedIn, user, company, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAdmin = isAdminUser(user?.email);

  // Hydration uyumsuzluğunu önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/stockmatch_logo.jpeg"
                alt="StockMatch"
                width={140}
                height={40}
                className="h-8 w-auto sm:h-10"
                priority
              />
              <p className="text-xl font-bold text-green-500">StockMatch</p>
            </Link>
            {/* Navigation Links - Desktop */}
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Ürünler
              </Link>
              <Link
                href="/kurumsal"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                Kurumsal
              </Link>
              <Link
                href="/iletisim"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                İletişim
              </Link>
            </div>
          </div>

          {/* Right Side - Auth State */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Auth Buttons */}
            {mounted && isLoggedIn ? (
              <div className="hidden items-center gap-3 sm:flex">
                {/* Avatar Icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                  <User className="h-5 w-5 text-white" />
                </div>

                {/* User/Company Name */}
                <span className="hidden text-sm text-slate-700 lg:block">
                  {company?.name || `${user?.firstName} ${user?.lastName}`}
                </span>

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 sm:px-4 sm:text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-700 sm:px-4 sm:text-sm"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </button>
              </div>
            ) : mounted ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:px-4 sm:text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 sm:px-6 sm:text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-slate-200 pt-4 md:hidden">
            {/* Mobile Navigation Links */}
            <div className="mb-4 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Ürünler
              </Link>
              <Link
                href="/kurumsal"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Kurumsal
              </Link>
              <Link
                href="/iletisim"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                İletişim
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            {mounted && isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-lg px-4 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm text-slate-700">
                    {company?.name || `${user?.firstName} ${user?.lastName}`}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Çıkış
                </button>
              </div>
            ) : mounted ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </nav >
  );
}
