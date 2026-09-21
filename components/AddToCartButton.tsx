"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";

export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={product.countInStock === 0}
      onClick={() => addToCart(product, 1)}
      className="flex w-full items-center justify-center rounded-xl bg-[var(--foreground)] px-8 py-4 text-lg font-bold text-[var(--background)] transition-transform hover:bg-[var(--accent)] hover:text-white disabled:pointer-events-none disabled:opacity-50"
    >
      {product.countInStock > 0 ? "Add to Cart" : "Sold Out"}
    </motion.button>
  );
}
