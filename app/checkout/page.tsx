"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, shippingAddress, saveShippingAddress } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");

  useEffect(() => {
    setMounted(true);
    if (shippingAddress) {
      setAddress(shippingAddress.address);
      setCity(shippingAddress.city);
      setState(shippingAddress.state);
      setCountry(shippingAddress.country);
    }
  }, [shippingAddress]);

  if (!mounted) return null;

  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = subtotal > 100 ? 0 : 5.00; 
  const total = subtotal + shippingPrice;

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    saveShippingAddress({ address, city, state, country });
    router.push("/placeorder"); 
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
      <div className="lg:col-span-7">
  <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
    Shipping Information
  </h1>

  <form onSubmit={submitHandler} className="space-y-6">
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Street Address
      </label>
      <input
        type="text"
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="e.g. 123 Tech Hub Street, Yaba"
        className="block w-full rounded-xl border border-[var(--border)] bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-[var(--foreground)] placeholder:text-zinc-500 dark:placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
      />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          City
        </label>
        <input
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ikeja"
          className="block w-full rounded-xl border border-[var(--border)] bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-[var(--foreground)] placeholder:text-zinc-500 dark:placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          State
        </label>
        <input
          type="text"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Lagos"
          className="block w-full rounded-xl border border-[var(--border)] bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-[var(--foreground)] placeholder:text-zinc-500 dark:placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
        />
      </div>
    </div>

    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Country
      </label>
      <input
        type="text"
        required
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="block w-full rounded-xl border border-[var(--border)] bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-black dark:text-[var(--foreground)] placeholder:text-zinc-500 dark:placeholder:text-zinc-500 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
      />
    </div>

    <div className="pt-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-xl bg-[var(--foreground)] px-8 py-4 text-lg font-bold text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:text-white"
      >
        Proceed to Payment
      </motion.button>
    </div>
  </form>
</div>

        <div className="lg:col-span-5">
  <div className="rounded-2xl border border-[var(--border)] bg-zinc-50 p-6 dark:bg-[#121214] lg:sticky lg:top-24">
    <h2 className="mb-6 text-lg font-bold text-black dark:text-white">Order Summary</h2>
    
    <ul className="mb-6 max-h-64 flex-col space-y-4 overflow-y-auto pr-2">
      {cartItems.map((item) => (
        <li key={item._id} className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-black dark:text-white line-clamp-1">{item.name}</span>
            <span className="text-sm font-medium text-black dark:text-white">Qty: {item.qty}</span>
          </div>
          <span className="font-bold text-black dark:text-white">${(item.price * item.qty).toFixed(2)}</span>
        </li>
      ))}
    </ul>

    <dl className="space-y-4 border-t border-[var(--border)] pt-6 text-sm font-medium text-black dark:text-white">
      <div className="flex items-center justify-between">
        <dt>Subtotal</dt>
        <dd className="font-bold text-black dark:text-white">${subtotal.toFixed(2)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt>Shipping</dt>
        <dd className="font-bold text-black dark:text-white">
          {shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}
        </dd>
      </div>
      
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <dt className="text-base font-bold text-black dark:text-white">Total</dt>
        <dd className="text-2xl font-black text-black dark:text-white">${total.toFixed(2)}</dd>
      </div>
    </dl>
  </div>
</div>

      </div>
    </main>
  );
}