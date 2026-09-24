// src/app/order/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export default function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params Promise using React 19's use() hook
  const { id } = use(params);
  const router = useRouter();
  const { userInfo } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push(`/login?redirect=/order/${id}`);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );
        setOrder(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo, router]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <p className="text-lg font-bold text-[var(--foreground)]">
          Loading receipt...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          {error || "Order Not Found"}
        </h1>
        <Link
          href="/"
          className="mt-4 text-sm font-bold underline text-[var(--foreground)]"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Order Confirmed
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Order ID:{" "}
            <span className="font-mono font-bold text-[var(--foreground)]">
              {order._id}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {order.isPaid ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Paid via {order.paymentMethod}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-sm font-bold text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
              Payment Pending
            </span>
          )}

          {order.isDelivered ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <Truck className="h-4 w-4" />
              Delivered
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-500/10 border border-zinc-500/30 px-4 py-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
              <Truck className="h-4 w-4" />
              Processing Delivery
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Customer & Items Info */}
        <div className="space-y-8 lg:col-span-8">
          {/* Shipping Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214]">
            <h2 className="mb-4 text-lg font-bold text-black dark:text-white">
              Shipping Details
            </h2>
            <div className="space-y-2 text-sm text-black dark:text-zinc-300">
              <p>
                <span className="font-bold">Customer:</span> {order.user.name} (
                {order.user.email})
              </p>
              <p>
                <span className="font-bold">Address:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}, {order.shippingAddress.country}
              </p>
              {order.paymentResult?.id && (
                <p>
                  <span className="font-bold">Paystack Reference:</span>{" "}
                  <span className="font-mono">{order.paymentResult.id}</span>
                </p>
              )}
            </div>
          </div>

          {/* Purchased Items */}
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214]">
            <h2 className="mb-6 text-lg font-bold text-black dark:text-white">
              Purchased Items
            </h2>
            <ul className="divide-y divide-[var(--border)]">
              {order.orderItems.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${item.product}`}
                      className="font-bold text-black dark:text-white hover:text-[var(--accent)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-medium text-black dark:text-zinc-400">
                      Qty: {item.qty} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-black text-black dark:text-white">
                    ${(item.qty * item.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Receipt Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] lg:sticky lg:top-24">
            <h2 className="mb-6 text-xl font-bold text-black dark:text-white">
              Order Receipt
            </h2>

            <dl className="space-y-4 text-sm font-medium text-black dark:text-white">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-bold text-black dark:text-white">
                  ${order.itemsPrice.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-black dark:text-white">
                  {order.shippingPrice === 0
                    ? "Free"
                    : `$${order.shippingPrice.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax (7.5%)</dt>
                <dd className="font-bold text-black dark:text-white">
                  ${order.taxPrice.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <dt className="text-base font-bold text-black dark:text-white">
                  Total Paid
                </dt>
                <dd className="text-2xl font-black text-black dark:text-white">
                  ${order.totalPrice.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
