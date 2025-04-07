import React from "react";
import { SectionComponent } from "../../../types/ServerDrivenUI";

const Section: React.FC<SectionComponent> = ({
  title,
  items,
  layout = "grid",
  columns = 2
}) => {
  const renderItems = () => {
    switch (layout) {
      case "grid":
        return (
          <div
            className="grid gap-4 mt-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm"
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                {item.iconUrl && (
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-12 h-12 mb-2"
                  />
                )}
                <span className="text-sm font-medium text-center">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="flex flex-col mt-2 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                {item.iconUrl && (
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-8 h-8 mr-3"
                  />
                )}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        );

      case "horizontal":
        return (
          <div className="flex overflow-x-auto mt-2 pb-2 hide-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 flex flex-col items-center p-2 mr-3 bg-white rounded-lg shadow-sm"
                style={{ width: "80px" }}
                onClick={() =>
                  item.action && console.log("Navigate to:", item.action)
                }
              >
                {item.iconUrl && (
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-10 h-10 mb-1"
                  />
                )}
                <span className="text-xs font-medium text-center">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {renderItems()}
    </div>
  );
};

export default Section;
