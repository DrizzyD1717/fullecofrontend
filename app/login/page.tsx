// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const setCredentials = useAuthStore((state) => state.setCredentials);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        },
      );
      setCredentials(data);
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-8 dark:bg-[#121214]">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-black dark:text-white">
          Sign In
        </h1>
        <p className="mb-8 text-sm font-medium text-black dark:text-zinc-400">
          Access your account to complete checkout.
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full rounded-xl border border-[var(--border)] bg-white dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-white placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-black dark:bg-white px-8 py-4 text-base font-bold text-white dark:text-black transition-colors hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>
      </div>
    </main>
  );
}
