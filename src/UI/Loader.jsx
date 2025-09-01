import React from "react";

export default function Loader({ size = 8 }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500`}
        style={{ width: `${size}rem`, height: `${size}rem` }}
      ></div>
    </div>
  );
}
