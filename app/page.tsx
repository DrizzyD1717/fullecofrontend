import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

// Server-side data fetching
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:5000/api/products", {
      // no-store ensures we see new products immediately during development
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on failure so the page doesn't completely crash
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero / Header Section */}
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Latest Arrivals
          </h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
            Discover our newest collection of premium gear.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-lg text-zinc-500">
            No products found. Is your Express backend running?
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
