// src/app/page.tsx
import ProductCard from "@/components/ProductCard";
import StoreFilter from "@/components/StoreFilter";
import { Product } from "@/types";

interface HomeProps {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Unwrap the promise for React 19 / Next 15 compatibility
  const params = await searchParams;
  const keyword = params.keyword || "";
  const category = params.category || "";

  // Build the Express URL with query parameters
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (category) query.set("category", category);

  const res = await fetch(
    `http://127.0.0.1:5000/api/products?${query.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Failed to fetch products. Is your backend running?
        </h1>
      </main>
    );
  }

  const products: Product[] = await res.json();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero / Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Featured Products
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
          Explore our latest collection of premium gear and accessories.
        </p>
      </div>

      {/* Interactive Search & Filter */}
      <StoreFilter />

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            No products found
          </p>
          <p className="mt-2 text-zinc-500">
            Try adjusting your search or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
