"use client";
import React from 'react';
import { ToastContainer as ReactToastContainer, Bounce } from 'react-toastify';
import { useSelector } from "react-redux";

const ToastContainer = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <ReactToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        transition={Bounce}
      />
    </div>
  );
};

export default ToastContainer;
