// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ShoppingCart, Sun, Moon, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const { userInfo, logout } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-[var(--foreground)]"
        >
          AUREOO<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Cart Icon */}
          <Link href="/cart">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative flex items-center gap-2 text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </motion.div>
          </Link>

          {/* Auth State */}
          {mounted && userInfo ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-zinc-100 dark:bg-zinc-800/80 px-3.5 py-2 text-sm font-bold text-black dark:text-white hover:border-[var(--accent)] transition-colors"
              >
                <User className="h-4 w-4 text-[var(--accent)]" />
                <span>{userInfo.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="rounded-xl border border-[var(--border)] p-2 text-zinc-600 dark:text-zinc-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            mounted && (
              <Link
                href="/login"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-bold text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
