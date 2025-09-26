"use client";
import React from "react";

export default function TemplateViewLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col ">
      {children}
    </div>
  );
}