// src/components/StoreFilter.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const CATEGORIES = ["All", "Gaming", "Laptops", "Accessories", "Audio"];

export default function StoreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentKeyword = searchParams.get("keyword") || "";
  const currentCategory = searchParams.get("category") || "";

  const [keyword, setKeyword] = useState(currentKeyword);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(keyword, currentCategory);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = category === "All" ? "" : category;
    updateFilters(keyword, newCategory);
  };

  const updateFilters = (newKeyword: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newKeyword) params.set("keyword", newKeyword);
    if (newCategory) params.set("category", newCategory);

    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setKeyword("");
    router.push("/");
  };

  return (
    <div className="mb-10 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-2xl border border-[var(--border)] bg-zinc-50 dark:bg-[#121214] py-4 pl-12 pr-12 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
        />
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

        {(keyword || currentCategory) && (
          <button
            type="button"
            onClick={clearFilters}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 text-black dark:text-white hover:bg-red-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isActive =
            (cat === "All" && !currentCategory) || cat === currentCategory;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
