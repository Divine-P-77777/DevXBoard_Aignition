"use client";
import React from "react";
import { Pinwheel } from 'ldrs/react'
import 'ldrs/react/Pinwheel.css'

const GlobalLoader = ({
  size = 50,
  stroke = 4,
  color = "purple",
  fullscreen = false,
  className = "",
}) => {
  return (
    <div
      className={`${fullscreen ? "fixed inset-0 z-50 bg-black/30 flex items-center justify-center" : "flex items-center justify-center"} ${className}`}
    >
      <Pinwheel size={size} stroke={stroke} speed="1" color={color}></Pinwheel>
    </div>
  );
};

export default GlobalLoader;




