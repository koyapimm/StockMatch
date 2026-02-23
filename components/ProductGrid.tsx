import { ProductDto } from "@/lib/api";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: ProductDto[];
  isLoading?: boolean;
};

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white">
            <div className="h-48 bg-slate-200" />
            <div className="p-3">
              <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mb-2 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mb-3 h-3 w-1/4 rounded bg-slate-200" />
              <div className="h-10 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
        <p className="text-slate-500">Filtre kriterlerinize uygun ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
