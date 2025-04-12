"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/CartContext";
import RootClient from "./RootClient"; // bạn đã có sẵn

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <RootClient>{children}</RootClient>
      </CartProvider>
    </SessionProvider>
  );
}
