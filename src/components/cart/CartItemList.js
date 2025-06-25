import { ConfigProvider, Spin } from "antd";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function CartItemList({ items, onUpdateQuantity, onRemove }) {
  const [loadingItemId, setLoadingItemId] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    setLoadingItemId(itemId);
    try {
      await onUpdateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleRemoveItem = async (item) => {
    setLoadingItemId(item._id);
    try {
      await onRemove(item);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={item._id || index}
          className={`flex items-center py-6 border-b border-light-grey w-full text-sm h-[70px] group `}
        >
          <div className="w-[40%] whitespace-normal pr-4">
            <h4
              className={`font-medium transition-all duration-300  ${
                loadingItemId === item._id ? "text-light-grey" : "text-white"
              } `}
            >
              {item.name}
            </h4>
          </div>

          <div
            className={`w-[20%] pr-4 transition-all duration-300   ${
              loadingItemId === item._id ? "text-light-grey" : "text-white"
            }`}
          >
            {item.variant.capacity}
          </div>

          <div className="w-[20%] pr-4 gap-4 flex items-center relative">
            <select
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item._id, parseInt(e.target.value))
              }
              disabled={loadingItemId === item._id}
              className={`border px-2 py-2 bg-grey rounded-none border-light-grey hover:border-white transition-all duration-300 ${
                loadingItemId === item._id
                  ? "text-light-grey cursor-default"
                  : "text-white cursor-pointer"
              } `}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {loadingItemId === item._id ? (
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flower w-[14px] h-[14px] " />
                ))}
              </div>
            ) : (
              <button
                onClick={() => handleRemoveItem(item)}
                className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-light-grey ml-1"
              >
                Remove
              </button>
            )}
          </div>

          <div
            className={`w-[20%] text-right pr-3 transition-all duration-300  ${
              loadingItemId === item._id ? "text-light-grey" : "text-white"
            }`}
          >
            {(item.variant.price * item.quantity).toLocaleString("vi-VN")}₫
          </div>
        </div>
      ))}
    </>
  );
}
