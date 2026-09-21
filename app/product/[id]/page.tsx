import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, PackageX } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

// Fetch the single product
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Fetch all products to find similar ones
async function getSimilarProducts(
  category: string,
  currentId: string,
): Promise<Product[]> {
  try {
    const res = await fetch(`http://localhost:5000/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const allProducts: Product[] = await res.json();

    // Filter by the same category, exclude the current product, and grab max 4
    return allProducts
      .filter((p) => p.category === category && p._id !== currentId)
      .slice(0, 4);
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Unwrap the params Promise first
  const { id } = await params;

  // 2. Pass the unwrapped id to your fetch function
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Link href="/" className="mt-4 text-[var(--accent)] hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const similarProducts = await getSimilarProducts(
    product.category,
    product._id,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery (Single image for now) */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col pt-4">
          <div className="mb-2 text-sm font-semibold tracking-wide text-[var(--accent)] uppercase">
            {product.category}
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {product.name}
          </h1>

          <div className="mb-8 text-3xl font-black text-[var(--foreground)]">
            ${product.price.toFixed(2)}
          </div>

          <p className="mb-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="mb-8 flex items-center gap-2 text-sm font-medium">
            {product.countInStock > 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Check className="h-5 w-5" />
                <span>In Stock ({product.countInStock} available)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <PackageX className="h-5 w-5" />
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Add to Cart Action */}
          <button
            disabled={product.countInStock === 0}
            className="flex w-full items-center justify-center rounded-xl bg-[var(--foreground)] px-8 py-4 text-lg font-bold text-[var(--background)] transition-transform hover:scale-[1.02] hover:bg-[var(--accent)] hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            {product.countInStock > 0 ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-24 border-t border-[var(--border)] pt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
