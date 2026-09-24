// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  User,
  Mail,
  Shield,
  Package,
  ExternalLink,
  CheckCircle2,
  Clock,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface OrderSummary {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderItems: Array<{
    name: string;
    qty: number;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!userInfo) {
      router.push("/login?redirect=/profile");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order history");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [mounted, userInfo, router]);

  if (!mounted || !userInfo) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
        My Account
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: User Profile Card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl font-black text-white dark:bg-white dark:text-black">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">
                  {userInfo.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)]">
                  <Shield className="h-3.5 w-3.5" />
                  {userInfo.isAdmin ? "Administrator" : "Verified Customer"}
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t border-[var(--border)] pt-6 text-sm text-black dark:text-white">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="font-semibold">{userInfo.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-zinc-500" />
                <span className="font-semibold">{userInfo.email}</span>
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Order History
              </h2>
              <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-black dark:text-white">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {loadingOrders ? (
              <p className="py-12 text-center font-bold text-black dark:text-white">
                Loading your orders...
              </p>
            ) : error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="mb-4 h-12 w-12 text-zinc-400" />
                <h3 className="text-lg font-bold text-black dark:text-white">
                  No orders yet
                </h3>
                <p className="mt-1 mb-6 text-sm font-medium text-black dark:text-zinc-400">
                  When you purchase items, your receipts will appear here.
                </p>
                <Link
                  href="/"
                  className="rounded-xl bg-black dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-black hover:bg-[var(--accent)] hover:text-white transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-black dark:text-white">
                  <thead className="border-b border-[var(--border)] text-xs font-bold uppercase text-black dark:text-zinc-400">
                    <tr>
                      <th className="pb-4 pr-4">Order ID</th>
                      <th className="pb-4 px-4">Date</th>
                      <th className="pb-4 px-4">Total</th>
                      <th className="pb-4 px-4">Payment</th>
                      <th className="pb-4 px-4">Delivery</th>
                      <th className="pb-4 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {orders.map((order) => (
                      <tr key={order._id} className="group">
                        <td className="py-4 pr-4 font-mono font-bold text-black dark:text-white">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 font-medium text-black dark:text-zinc-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-black text-black dark:text-white">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          {order.isPaid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              Delivered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 border border-zinc-500/30 px-2.5 py-1 text-xs font-bold text-black dark:text-zinc-300">
                              Processing
                            </span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <Link
                            href={`/order/${order._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-black dark:text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                          >
                            Receipt
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
