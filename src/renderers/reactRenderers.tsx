import React from "react";
import { UINode } from "../core/ServerDrivenUIEngine";

/**
 * 헤더 렌더러 컴포넌트
 */
export const HeaderReactRenderer = (props: any) => {
  const {
    title,
    backgroundColor = "#FFFFFF",
    textColor = "#000000",
    height = 60,
    children
  } = props;

  return (
    <header
      className="flex items-center justify-center px-4 w-full"
      style={{
        backgroundColor,
        color: textColor,
        height
      }}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </header>
  );
};

/**
 * 버튼 렌더러 컴포넌트
 */
export const ButtonReactRenderer = (props: any) => {
  const {
    title,
    style = "primary",
    backgroundColor,
    textColor,
    cornerRadius = 4,
    action,
    children
  } = props;

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
    console.log("버튼 클릭:", action);
  };

  return (
    <button
      className={`w-full py-3 font-medium transition-colors ${getStyleClasses()}`}
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        borderRadius: `${cornerRadius}px`
      }}
      onClick={action ? handleClick : undefined}
    >
      {title}
      {children}
    </button>
  );
};

/**
 * 섹션 아이템 렌더러 컴포넌트
 */
const SectionItem = ({
  item,
  layout = "grid"
}: {
  item: any;
  layout: string;
}) => {
  const handleClick = () => {
    if (item.action) {
      console.log("아이템 클릭:", item.action);
    }
  };

  const getItemClasses = () => {
    switch (layout) {
      case "grid":
        return "flex flex-col items-center p-2 bg-white rounded-lg shadow-sm";
      case "list":
        return "flex items-center p-3 bg-white rounded-lg shadow-sm";
      case "horizontal":
        return "flex-shrink-0 flex flex-col items-center p-2 mr-3 bg-white rounded-lg shadow-sm";
      default:
        return "";
    }
  };

  const getIconClasses = () => {
    switch (layout) {
      case "grid":
        return "w-12 h-12 mb-2";
      case "list":
        return "w-8 h-8 mr-3";
      case "horizontal":
        return "w-10 h-10 mb-1";
      default:
        return "";
    }
  };

  const getTitleClasses = () => {
    if (layout === "grid" || layout === "horizontal") {
      return "text-sm font-medium text-center";
    } else {
      return "text-sm font-medium";
    }
  };

  return (
    <div
      className={getItemClasses()}
      style={layout === "horizontal" ? { width: "80px" } : undefined}
      onClick={item.action ? handleClick : undefined}
    >
      {item.iconUrl && (
        <img
          src={item.iconUrl}
          alt={item.title || ""}
          className={getIconClasses()}
        />
      )}
      <span className={getTitleClasses()}>{item.title}</span>
    </div>
  );
};

/**
 * 섹션 렌더러 컴포넌트
 */
export const SectionReactRenderer = (props: any) => {
  const { title, items = [], layout = "grid", columns = 2, children } = props;

  const getContainerClasses = () => {
    switch (layout) {
      case "grid":
        return "grid gap-4 mt-2";
      case "list":
        return "flex flex-col mt-2 space-y-2";
      case "horizontal":
        return "flex overflow-x-auto mt-2 pb-2";
      default:
        return "mt-2";
    }
  };

  return (
    <section className="p-4">
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      <div
        className={getContainerClasses()}
        style={
          layout === "grid"
            ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
            : undefined
        }
      >
        {items.map((item: any, index: number) => (
          <SectionItem key={item.id || index} item={item} layout={layout} />
        ))}
      </div>
      {children}
    </section>
  );
};

/**
 * 기본 제공되는 React 렌더러 맵
 */
const reactRenderers = {
  header: HeaderReactRenderer,
  button: ButtonReactRenderer,
  section: SectionReactRenderer
  // 다른 렌더러는 필요에 따라 추가할 수 있습니다.
};

export default reactRenderers;
