"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
          <ShoppingBag className="h-12 w-12 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          Your cart is empty
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-300">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-[var(--foreground)] px-8 py-3 font-bold text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:text-white"
          >
            Start Shopping
          </motion.button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {cartItems.map((item) => (
              <li key={item._id} className="flex py-6 sm:py-8">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:h-32 sm:w-32">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100px, 150px" />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold text-[var(--foreground)]">
                          <Link href={`/product/${item._id}`} className="hover:text-[var(--accent)] transition-colors">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        {item.category}
                      </p>
                      <p className="mt-1 text-lg font-black text-[var(--foreground)]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center sm:mt-0 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-[var(--border)]">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                          className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--foreground)]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, Math.min(item.countInStock, item.qty + 1))}
                          className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
                          disabled={item.qty >= item.countInStock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-4 p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
  <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] sm:p-8">
    <h2 className="text-lg font-bold text-black dark:text-white">Order Summary</h2>
    
    <dl className="mt-6 space-y-4 text-sm font-medium text-black dark:text-white">
      <div className="flex items-center justify-between">
        <dt>Subtotal</dt>
        <dd className="font-bold text-black dark:text-white">${subtotal.toFixed(2)}</dd>
      </div>
      
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <dt className="text-base font-bold text-black dark:text-white">Order Total</dt>
        <dd className="text-xl font-black text-black dark:text-white">${subtotal.toFixed(2)}</dd>
      </div>
    </dl>

    <div className="mt-8">
      <Link href="/checkout">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-4 text-base font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Checkout
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </Link>
    </div>
    <div className="mt-4 text-center text-xs font-medium text-black dark:text-white">
      Taxes and shipping calculated at checkout.
    </div>
  </div>
</div>
      </div>
    </main>
  );
}