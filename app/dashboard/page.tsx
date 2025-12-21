"use client";

import { Package, Clock, Wallet } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      name: "Toplam Aktif Stok",
      value: "1,250",
      icon: Package,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Bekleyen Talepler",
      value: "12",
      icon: Clock,
      change: "+3",
      changeType: "positive",
    },
    {
      name: "Tahmini Değer",
      value: "₺450.000",
      icon: Wallet,
      change: "+8.2%",
      changeType: "positive",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Yeni ürün eklendi",
      item: "Siemens Simatic S7-1200 PLC",
      time: "2 saat önce",
      status: "Aktif",
    },
    {
      id: 2,
      action: "Talebe yanıt verildi",
      item: "ABB ACS550 VFD",
      time: "5 saat önce",
      status: "İşlemde",
    },
    {
      id: 3,
      action: "Ürün güncellendi",
      item: "Omron AC Servo Motor",
      time: "1 gün önce",
      status: "Aktif",
    },
    {
      id: 4,
      action: "Yeni talep alındı",
      item: "Allen-Bradley PanelView Plus",
      time: "2 gün önce",
      status: "Beklemede",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Genel Bakış</h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Stok durumunuz ve son aktiviteleriniz
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 sm:text-sm">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-2 text-xs font-medium sm:text-sm ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 text-slate-900 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Son Aktiviteler
          </h2>
        </div>
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Aksiyon
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Ürün
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Zaman
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-900 sm:px-6">
                    {activity.action}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                    {activity.item}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                    {activity.time}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        activity.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "İşlemde"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="divide-y divide-slate-200 md:hidden">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="mt-1 text-sm text-slate-600 truncate">{activity.item}</p>
                  <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                </div>
                <span
                  className={`ml-3 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    activity.status === "Aktif"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "İşlemde"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

