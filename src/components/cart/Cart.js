"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { IoMdClose } from "react-icons/io";
import Button from "../shared/Button";
import CartItemList from "./CartItemList";
import api from "@/constants/apiURL";

export default function Cart() {
  const { setIsCartOpen, cartChanged, setTotalQuantity } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      const items = res.data.cart.items || [];
      setCartItems(items);

      // 👉 Tính tổng số lượng
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } catch (error) {
      console.error("Lỗi fetch giỏ hàng", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [cartChanged]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await api.put("/cart/put", { itemId, quantity });

      // Tạo mảng mới
      const updated = cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );

      setCartItems(updated);

      // Tính lại tổng
      const total = updated.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await api.delete(
        `/cart/delete?slug=${item.slug}&variantId=${item.variant.id}`
      );

      // Tạo mảng mới sau khi xoá
      const filtered = cartItems.filter(
        (i) =>
          !(
            i.slug === item.slug &&
            i.variant?.id === item.variant?.id &&
            i._id === item._id
          )
      );

      setCartItems(filtered);

      // Tính lại tổng
      const total = filtered.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };
  return (
    <div className="bg-grey text-white flex flex-col shadow-lg px-8 py-4">
      {/* Cart Header */}
      <div className="flex items-center py-4 border-b border-light-grey w-full text-sm text-gray-400">
        <h2 className="w-[40%]">Cart</h2>
        <h2 className="w-[20%]">Size</h2>
        <h2 className="w-[20%]">Quantity</h2>
        <div className="w-[20%] flex justify-end">
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-black"
          >
            <IoMdClose size={20} />
          </button>
        </div>
      </div>

      {/* Cart Body */}
      <div className="overflow-y-auto min-h-[30vh] max-h-[40vh] flex w-full flex-col custom-scrollbar">
        {loading ? (
          <div className="text-center py-4 text-sm text-gray-400">
            Đang tải giỏ hàng...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-400">
            Giỏ hàng của bạn trống.
          </div>
        ) : (
          <CartItemList
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        )}
      </div>

      {/* Cart Footer */}
      <div className="border-t border-light-grey bg-grey flex">
        <div className="flex justify-between items-center w-[60%]"></div>
        <div className=" text-sm mb-4 w-[40%] ">
          <div className="py-6 flex justify-between text-white border-b border-light-grey items-center cursor-pointer group">
            <span className=" group-hover:text-light-grey transition-colors duration-200">
              Apply a promotional code
            </span>
            <span className="group-hover:text-light-grey transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          </div>

          <div className=" flex flex-col justify-between text-white items-center">
            <div className="flex justify-between w-full py-5">
              <span>Included Taxes</span>
              <span className="text-xl">
                {Array.isArray(cartItems)
                  ? cartItems
                      .reduce(
                        (total, item) =>
                          total + item.quantity * item.variant.price,
                        0
                      )
                      .toLocaleString("vi-VN")
                  : "0"}
                ₫
              </span>
            </div>
            <Button className="w-full" variant="inverse">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
