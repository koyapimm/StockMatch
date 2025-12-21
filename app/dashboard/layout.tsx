"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userCompany, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { name: "Stok Listem", href: "/dashboard/inventory", icon: Package },
    { name: "Yeni Ürün Ekle", href: "/dashboard/add", icon: PlusCircle },
    { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 sm:h-16 sm:px-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/stockmatch_logo.jpeg"
                alt="StockMatch"
                width={120}
                height={35}
                className="h-7 w-auto sm:h-8"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-slate-600 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:gap-3 sm:px-3 ${
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-lg px-2 py-2 sm:gap-3 sm:px-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 sm:h-8 sm:w-8">
                <svg
                  className="h-4 w-4 text-white sm:h-5 sm:w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-slate-900 sm:text-sm">
                  {userCompany || "Şirket Adı"}
                </p>
                <p className="text-xs text-slate-500">Kurumsal</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-3 sm:h-16 sm:px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-slate-600 sm:h-6 sm:w-6" />
          </button>

          <div className="flex flex-1 items-center justify-between lg:justify-end">
            {/* Breadcrumb */}
            <div className="hidden text-xs text-slate-600 lg:flex lg:items-center lg:gap-2 lg:text-sm">
              <Link href="/" className="hover:text-slate-900">
                Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-slate-900">Dashboard</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:px-3"
              >
                Çıkış
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

