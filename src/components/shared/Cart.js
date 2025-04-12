"use client";

import { useCart } from "@/contexts/CartContext";
import { IoMdClose } from "react-icons/io";
import Button from "../ui/Button";

export default function Cart() {
  const { setIsCartOpen } = useCart();

  return (
    <div className="bg-white text-black flex flex-col shadow-lg">
      {/* Cart Header */}
      <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        <button
          onClick={() => setIsCartOpen(false)}
          className="text-gray-500 hover:text-black"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      {/* Cart Items - scrollable */}
      <div className="overflow-y-auto py-4 px-6 max-h-[60vh]">
        {/* Empty state or cart items */}
        <div className="py-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <Button
            className="mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition"
            onClick={() => setIsCartOpen(false)}
          >
            Continue Shopping
          </Button>
        </div>

        {/* Example cart item - Will be replaced with real items */}
        <div className="hidden border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-20 h-20 flex-shrink-0"></div>
            <div className="flex-1">
              <h3 className="font-medium">Arrival Perfume</h3>
              <p className="text-gray-500 text-sm">100ml</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="w-6 h-6 border border-gray-300 flex items-center justify-center">
                  -
                </button>
                <span className="w-8 text-center">1</span>
                <button className="w-6 h-6 border border-gray-300 flex items-center justify-center">
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$300.00</p>
              <button className="text-gray-500 text-sm mt-2 hover:text-black">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Footer */}
      <div className="border-t border-gray-200 py-4 px-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Subtotal</span>
          <span className="">100.000.000đ</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Shipping and taxes calculated at checkout
        </p>
        <Button className="w-full">Checkout</Button>
      </div>
    </div>
  );
}
