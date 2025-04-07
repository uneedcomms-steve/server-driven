import React from "react";
import { FooterComponent } from "../../../types/ServerDrivenUI";

const Footer: React.FC<FooterComponent> = ({
  items,
  backgroundColor = "#FFFFFF",
  layout = "tabs"
}) => {
  const handleItemClick = (item: any) => {
    if (item.action) {
      console.log("Navigate to:", item.action);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 shadow-top z-20"
      style={{ backgroundColor }}
    >
      <div
        className={`flex items-center justify-around ${
          layout === "tabs" ? "h-16" : "py-3"
        }`}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center ${
              item.isSelected ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => handleItemClick(item)}
          >
            <div className="relative">
              {item.iconUrl && (
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className="w-6 h-6 mb-1"
                />
              )}
              {item.badgeCount && item.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badgeCount > 9 ? "9+" : item.badgeCount}
                </span>
              )}
            </div>
            <span className="text-xs">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
