// src/app/placeorder/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePaystackPayment } from "react-paystack";
import { motion } from "framer-motion";
import axios from "axios";

export default function PlaceOrderPage() {
  const router = useRouter();
  const { cartItems, shippingAddress, clearCart } = useCartStore();
  const { userInfo } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Redirect to login if not signed in
  if (!userInfo) {
    router.push("/login?redirect=/placeorder");
    return null;
  }
  if (!shippingAddress) {
    router.push("/checkout");
    return null;
  }
  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  // Price calculations
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 5.0;
  const taxPrice = Number((0.075 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Paystack Config
  const config = {
    reference: new Date().getTime().toString(),
    email: userInfo.email,
    amount: Math.round(totalPrice * 100), // In kobo/lowest denomination
    publicKey:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    currency: "NGN",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod: "Paystack",
        paymentResult: {
          id: reference.reference,
          status: reference.status,
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      clearCart();
      router.push(`/order/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    console.log("Payment modal closed");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Review Details */}
        <div className="lg:col-span-8">
          <ul className="divide-y divide-[var(--border)]">
            <li className="py-6">
              <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
                Shipping Address
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.state}, {shippingAddress.country}
              </p>
            </li>

            <li className="py-6">
              <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
                Payment Method
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                Paystack ({userInfo.email})
              </p>
            </li>

            <li className="py-6">
              <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">
                Order Items
              </h2>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="font-bold text-[var(--foreground)]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-[var(--foreground)]">
                      {item.qty} x ${item.price.toFixed(2)} =$
                      {(item.qty * item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        {/* Right: Payment Sidebar (High-contrast black/white text) */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] lg:sticky lg:top-24">
            <h2 className="mb-6 text-xl font-bold text-black dark:text-white">
              Order Summary
            </h2>

            <dl className="space-y-4 text-sm font-medium text-black dark:text-white">
              <div className="flex justify-between">
                <dt>Items</dt>
                <dd className="font-bold text-black dark:text-white">
                  ${itemsPrice.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-black dark:text-white">
                  {shippingPrice === 0
                    ? "Free"
                    : `$${shippingPrice.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd className="font-bold text-black dark:text-white">
                  ${taxPrice.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <dt className="text-base font-bold text-black dark:text-white">
                  Total
                </dt>
                <dd className="text-2xl font-black text-black dark:text-white">
                  ${totalPrice.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => initializePayment({ onSuccess, onClose })}
                disabled={isProcessing}
                className="w-full rounded-xl bg-black dark:bg-white px-8 py-4 text-lg font-bold text-white dark:text-black transition-colors hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
