// src/app/admin/add-product/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AddProductPage() {
  const router = useRouter();
  const { userInfo } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/");
    }
  }, [mounted, userInfo, router]);

  if (!mounted || !userInfo || !userInfo.isAdmin) return null;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload a product image or provide an image URL.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/products",
        {
          name,
          price: Number(price),
          category,
          countInStock: Number(countInStock),
          description,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] sm:p-10">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-black dark:text-white">
          Add New Product
        </h1>
        <p className="mb-8 text-sm font-medium text-black dark:text-zinc-400">
          Upload product media and configure inventory details.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Product Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
              Product Image
            </label>
            <ImageUpload value={image} onChange={(url) => setImage(url)} />

            {/* Optional Direct URL Input */}
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste a direct image URL (https://...)"
              className="mt-3 block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sony DualSense Wireless Controller"
              className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          {/* Price, Category & Stock */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
                Price (<span>&#8358;</span>)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="69.99"
                className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Gaming"
                className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
                Stock Count
              </label>
              <input
                type="number"
                min="0"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="15"
                className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-black dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a detailed description of the product..."
              className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-black dark:bg-white px-8 py-4 text-base font-bold text-white dark:text-black transition-colors hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
          >
            {loading ? "Publishing Product..." : "Publish Product"}
          </motion.button>
        </form>
      </div>
    </main>
  );
}
