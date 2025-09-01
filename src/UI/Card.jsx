import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded p-4 ${className}`}>
      {children}
    </div>
  );
}
