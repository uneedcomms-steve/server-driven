import React from "react";
import { ProductListComponent } from "../../../types/ServerDrivenUI";

const ProductList: React.FC<ProductListComponent> = ({
  title,
  items,
  layout = "horizontal",
  showPrice = true,
  showDiscountPrice = true
}) => {
  const renderItems = () => {
    switch (layout) {
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {showPrice && item.price && (
                    <p
                      className={`text-sm mt-1 ${
                        showDiscountPrice && item.discountPrice
                          ? "line-through text-gray-400"
                          : "font-bold"
                      }`}
                    >
                      {item.price}
                    </p>
                  )}
                  {showDiscountPrice && item.discountPrice && (
                    <p className="text-sm text-red-600 font-bold mt-1">
                      {item.discountPrice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="flex flex-col mt-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex bg-white rounded-lg shadow-sm overflow-hidden"
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.badge && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 flex-1">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {showPrice && item.price && (
                    <p
                      className={`text-sm mt-1 ${
                        showDiscountPrice && item.discountPrice
                          ? "line-through text-gray-400"
                          : "font-bold"
                      }`}
                    >
                      {item.price}
                    </p>
                  )}
                  {showDiscountPrice && item.discountPrice && (
                    <p className="text-sm text-red-600 font-bold mt-1">
                      {item.discountPrice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "horizontal":
      default:
        return (
          <div className="flex overflow-x-auto mt-2 pb-2 hide-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-40 bg-white rounded-lg shadow-sm overflow-hidden mr-3"
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {showPrice && item.price && (
                    <p
                      className={`text-xs mt-1 ${
                        showDiscountPrice && item.discountPrice
                          ? "line-through text-gray-400"
                          : "font-bold"
                      }`}
                    >
                      {item.price}
                    </p>
                  )}
                  {showDiscountPrice && item.discountPrice && (
                    <p className="text-xs text-red-600 font-bold mt-1">
                      {item.discountPrice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {renderItems()}
    </div>
  );
};

export default ProductList;
