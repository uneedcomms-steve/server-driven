import React from "react";
import { HeaderComponent } from "../../../types/ServerDrivenUI";

const Header: React.FC<HeaderComponent> = ({
  title,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
  height = 60
}) => {
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
    </header>
  );
};

export default Header;
