// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem extends Product {
  qty: number;
}

// Ensure this matches the Express backend Order model
export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  country: string;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null; // <-- NEW
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  saveShippingAddress: (address: ShippingAddress) => void; // <-- NEW
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: null, // <-- NEW
      
      addToCart: (product, qty = 1) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item._id === product._id);

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item._id === product._id ? { ...item, qty: item.qty + qty } : item
            ),
          });
        } else {
          set({ cartItems: [...cartItems, { ...product, qty }] });
        }
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((item) => item._id !== id),
        });
      },

      updateQuantity: (id, qty) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item._id === id ? { ...item, qty } : item
          ),
        });
      },

      // <-- NEW FUNCTION
      saveShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "aureoo-cart-storage",
    }
  )
);