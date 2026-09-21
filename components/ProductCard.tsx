"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all hover:shadow-lg dark:hover:shadow-zinc-900/50"
    >
      {/* Image Container */}
      <Link
        href={`/product/${product._id}`}
        className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span>{product.category}</span>
          {product.countInStock > 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              In Stock
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Out of Stock</span>
          )}
        </div>

        <Link href={`/product/${product._id}`}>
          <h3 className="mb-2 text-lg font-bold leading-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-black">
            ${product.price.toFixed(2)}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={product.countInStock === 0}
            onClick={() => addToCart(product, 1)} // <-- ADD THIS
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-bold text-[var(--background)] transition-transform hover:bg-[var(--accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
