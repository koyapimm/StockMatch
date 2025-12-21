"use client";

import Image from "next/image";
import { mockProducts } from "@/lib/mockData";
import { Edit, Trash2 } from "lucide-react";

export default function InventoryPage() {
  // Simüle edilmiş kullanıcı ürünleri (gerçek uygulamada API'den gelecek)
  const userProducts = mockProducts.slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Stok Listem</h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Tüm listedeki ürünlerinizi yönetin
          </p>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Görsel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Ürün Adı
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Stok
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Fiyat
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600 sm:px-6">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {userProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="text-sm font-medium text-slate-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {product.brand} • {product.subCategory}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                    {product.partNumber || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-900 sm:px-6">
                    {product.stock} adet
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900 sm:px-6">
                    {product.currency === "USD" ? "$" : "₺"}
                    {product.price.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {product.stock > 0 ? "Aktif" : "Satıldı"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards - Mobile */}
      <div className="space-y-4 md:hidden">
        {userProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {product.brand} • {product.subCategory}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-600">
                    SKU: {product.partNumber || "N/A"}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-600">
                    Stok: {product.stock} adet
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    {product.currency === "USD" ? "$" : "₺"}
                    {product.price.toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {product.stock > 0 ? "Aktif" : "Satıldı"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
                    <Edit className="h-3 w-3" />
                    Düzenle
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

