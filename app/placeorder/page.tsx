// src/app/placeorder/page.tsx
import dynamic from "next/dynamic";

// This forces Next.js to completely skip server-side rendering for this page,
// meaning react-paystack will only run in the browser where 'window' exists.
const PlaceOrderClient = dynamic(() => import("./PlaceOrderClient"), {
  ssr: false,
});

export default function PlaceOrderPage() {
  return <PlaceOrderClient />;
}
