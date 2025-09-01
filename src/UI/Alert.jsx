// src/UI/Alert.jsx
import React from "react";

export default function Alert({ message, type = "error" }) {
  const colors = {
    error: "bg-red-100 border-red-400 text-red-700",
    success: "bg-green-100 border-green-400 text-green-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${colors[type]}`} role="alert">
      <p>{message}</p>
    </div>
  );
}
