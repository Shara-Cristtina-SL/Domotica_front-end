import React from "react";
import PropTypes from "prop-types";

const variants = {
  create: "bg-green-600 hover:bg-green-700 text-white",
  edit: "bg-blue-600 hover:bg-blue-700 text-white",
  delete: "bg-red-600 hover:bg-red-700 text-white",
  default: "bg-gray-200 hover:bg-gray-300 text-black",
};

const Button = ({ label, onClick, type = "button", variant = "default" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition duration-200 shadow-sm ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit"]),
  variant: PropTypes.oneOf(["create", "edit", "delete", "default"]),
};

export { Button };
