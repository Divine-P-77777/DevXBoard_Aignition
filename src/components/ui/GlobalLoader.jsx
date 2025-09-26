"use client";
import React from "react";
import { Pinwheel } from 'ldrs/react';
import 'ldrs/react/Pinwheel.css';
import { useSelector } from "react-redux";
import clsx from "clsx";

const GlobalLoader = ({
  size,       // optional: number or string
  stroke = 4,
  color = "purple",
  fullscreen = false,
  className = "",
}) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // responsive size fallback
  const loaderSize = size || 50;

  return (
    <div
      className={clsx(
        fullscreen 
          ? "fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300" 
          : "flex items-center justify-center",
        fullscreen && (isDarkMode ? "bg-black/40" : "bg-white/30"),
        className
      )}
    >
      <Pinwheel
        size={loaderSize}
        stroke={stroke}
        speed="1"
        color={color}
      />
    </div>
  );
};

export default GlobalLoader;
