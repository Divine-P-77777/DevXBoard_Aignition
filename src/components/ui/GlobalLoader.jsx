"use client";
import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

const GlobalLoader = ({ appName = "DevXBoard", className = "" }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={clsx(
        "flex flex-col items-center min-h-screen justify-center py-10 px-4",
        className,
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}
    >
      {/* Logo + Name */}
      <div className="flex flex-col items-center gap-3">
        <img src="/favicon.png" alt="App Logo" className="w-12 h-12 object-contain" />
        <span className={clsx("text-2xl font-bold tracking-wide", isDarkMode ? "text-white" : "text-gray-900")}>
          {appName}
        </span>
      </div>

      {/* Gradient Loader */}
<div
  className={clsx(
    "w-64 h-3 mt-6 rounded-full overflow-hidden shadow-md relative",
    isDarkMode ? "bg-gray-700" : "bg-gray-300"
  )}
>
  {/* Sliding Gradient */}
  <div className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-loader-slide"></div>
</div>

      {/* Loading text */}
<span
  className={clsx(
    "mt-3 text-sm font-medium transition-colors duration-300",
    isDarkMode ? "text-gray-300" : "text-gray-600"
  )}
>
  Loading...
</span>


<style jsx>{`
  @keyframes loader-slide {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-loader-slide {
    animation: loader-slide 1.5s infinite ease-in-out;
  }
`}</style>
    </div>
  );
};

export default GlobalLoader;
