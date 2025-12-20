import Image from "next/image";
import { Product } from "@/lib/mockData";

type ProductCardProps = {
  product: Product;
};

// Gizlilik mantığı: sellerName'i asla gösterme!
// Bunun yerine maskelenmiş bir badge göster
function getMaskedSellerBadge(sellerName: string): string {
  // Seller name'den hash benzeri bir ID oluştur
  const hash = sellerName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `Supplier #${hash.toString().slice(-4)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const maskedSeller = getMaskedSellerBadge(product.sellerName);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 w-full bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
        />
        {/* Condition Badge */}
        <div className="absolute right-2 top-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.condition === "New in Box"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {product.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">
          {product.title}
        </h3>

        {product.partNumber && (
          <p className="mb-2 text-sm text-slate-500">
            Parça No: <span className="font-mono">{product.partNumber}</span>
          </p>
        )}

        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            {product.brand}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-600">{product.category}</span>
        </div>

        {/* Masked Seller Badge - Gizlilik kuralı */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs">🛡️</span>
          <span className="text-xs font-medium text-slate-600">
            {maskedSeller}
          </span>
        </div>

        {/* Price and Stock */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-200">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {product.price.toLocaleString()} {product.currency}
            </p>
            <p className="text-xs text-slate-500">
              Stok: {product.stock} adet
            </p>
          </div>
        </div>

        {/* Contact Button */}
        <button className="mt-4 w-full rounded-lg bg-orange-600 py-2 font-semibold text-white transition-colors hover:bg-orange-700">
          İletişime Geç
        </button>
      </div>
    </div>
  );
}

