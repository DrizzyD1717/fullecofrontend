"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by mounting the theme toggle only on the client
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-black tracking-tighter"
          >
            AUREOO<span className="text-[var(--accent)]">.</span>
          </motion.div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-full border-0 bg-zinc-100 dark:bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-transparent placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-inset focus:ring-[var(--accent)] sm:leading-6 transition-all duration-300"
              placeholder="Search for products..."
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              // Updated to use var(--foreground) for maximum contrast
              className="text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            // Updated text colors
            className="flex items-center gap-2 text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
          >
            <User className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:block">Sign In</span>
          </motion.button>

          <Link href="/cart">
            <motion.div
              whileHover={{ y: -2 }}
              // Updated text colors
              className="relative flex items-center gap-2 text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white shadow-sm">
                3
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
