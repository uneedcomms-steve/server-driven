import React from "react";
import { ButtonComponent } from "../../../types/ServerDrivenUI";

const Button: React.FC<ButtonComponent> = ({
  title,
  style = "primary",
  backgroundColor,
  textColor,
  cornerRadius = 4,
  action
}) => {
  const getStyleClasses = () => {
    switch (style) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "outline":
        return "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const handleClick = () => {
    if (action) {
      console.log("Button action:", action);
    }
  };

  return (
    <button
      className={`w-full py-3 font-medium transition-colors ${getStyleClasses()}`}
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        borderRadius: `${cornerRadius}px`
      }}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default Button;
