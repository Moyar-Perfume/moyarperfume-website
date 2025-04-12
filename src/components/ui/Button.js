"use client";

import React from "react";

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "inverse":
        return "text-sm md:text-base relative text-black bg-white border-[1px] p-1.5 md:p-2 px-3 md:px-4 border-black overflow-hidden transition-all duration-500 hover:text-white group";
      default:
        return "text-sm md:text-base relative text-white bg-black border border-white p-1.5 md:p-2 px-6 md:px-8 font-medium overflow-hidden transition-all duration-500 hover:text-black group";
    }
  };

  const getOverlayStyles = () => {
    return variant === "inverse"
      ? "absolute left-0 right-0 top-1/2 h-0 bg-black transition-all duration-500 ease-in-out -translate-y-1/2 group-hover:h-full"
      : "absolute left-0 right-0 top-1/2 h-0 bg-white transition-all duration-500 ease-in-out -translate-y-1/2 group-hover:h-full";
  };

  return (
    <button
      className={`${getButtonStyles()} ${className} min-w-[100px] md:min-w-[120px]`}
      {...props}
    >
      <span className={getOverlayStyles()}></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
