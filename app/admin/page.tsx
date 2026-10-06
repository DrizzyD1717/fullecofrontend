// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  DollarSign,
  Truck,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types";

interface AdminOrder {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { userInfo } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!userInfo || !userInfo.isAdmin) {
      router.push("/");
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [mounted, userInfo, router]);

  if (!mounted || !userInfo || !userInfo.isAdmin) return null;

  const handleDeliverOrder = async (orderId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isDelivered: true } : o)),
      );
    } catch (error) {
      console.error("Error marking order delivered:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Admin Command Center
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage store inventory, customer orders, and fulfillment.
          </p>
        </div>

        <Link
          href="/admin/add-product"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-bold text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-black dark:text-zinc-400">
              Total Revenue
            </span>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-black dark:text-white">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-black dark:text-zinc-400">
              Total Orders
            </span>
            <ShoppingBag className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <p className="mt-3 text-3xl font-black text-black dark:text-white">
            {orders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-black dark:text-zinc-400">
              Active Products
            </span>
            <Package className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-black dark:text-white">
            {products.length}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6 flex gap-3 border-b border-[var(--border)] pb-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "orders"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "products"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
          }`}
        >
          Product Inventory ({products.length})
        </button>
      </div>

      {/* Tab Content Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] sm:p-8">
        {loading ? (
          <p className="py-12 text-center font-bold text-black dark:text-white">
            Loading store data...
          </p>
        ) : activeTab === "orders" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-black dark:text-white">
              <thead className="border-b border-[var(--border)] text-xs font-bold uppercase text-black dark:text-zinc-400">
                <tr>
                  <th className="pb-4 pr-4">Order ID</th>
                  <th className="pb-4 px-4">Customer</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Total</th>
                  <th className="pb-4 px-4">Paid</th>
                  <th className="pb-4 px-4">Delivered</th>
                  <th className="pb-4 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-4 pr-4 font-mono font-bold text-black dark:text-white">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-black dark:text-white">
                      {order.user?.name || "Customer"}
                    </td>
                    <td className="py-4 px-4 font-medium text-black dark:text-zinc-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-black text-black dark:text-white">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Clock className="h-3.5 w-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-500/30 bg-zinc-500/10 px-2.5 py-1 text-xs font-bold text-black dark:text-zinc-300">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleDeliverOrder(order._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 dark:bg-white dark:text-black dark:hover:bg-emerald-500 dark:hover:text-white transition-colors"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            Mark Delivered
                          </button>
                        )}
                        <Link
                          href={`/order/${order._id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-black dark:text-white hover:border-[var(--accent)] transition-colors"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-black dark:text-white">
              <thead className="border-b border-[var(--border)] text-xs font-bold uppercase text-black dark:text-zinc-400">
                <tr>
                  <th className="pb-4 pr-4">Product</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Price</th>
                  <th className="pb-4 px-4">Stock</th>
                  <th className="pb-4 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-black dark:text-white">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-black dark:text-zinc-300">
                      {product.category}
                    </td>
                    <td className="py-4 px-4 font-black text-black dark:text-white">
                      <span>&#8358;</span>
                      {product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-black dark:text-white">
                      {product.countInStock}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
