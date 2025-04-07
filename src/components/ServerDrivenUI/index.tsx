import React, { useEffect, useState } from "react";
import { ServerDrivenUIData } from "../../types/ServerDrivenUI";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import Section from "./components/Section";
import ProductList from "./components/ProductList";
import Button from "./components/Button";
import Footer from "./components/Footer";

interface ServerDrivenUIProps {
  dataUrl?: string;
  data?: ServerDrivenUIData;
}

const ServerDrivenUI: React.FC<ServerDrivenUIProps> = ({
  dataUrl,
  data: initialData
}) => {
  const [data, setData] = useState<ServerDrivenUIData | null>(
    initialData || null
  );
  const [loading, setLoading] = useState<boolean>(!initialData && !!dataUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataUrl) return;

      try {
        setLoading(true);
        const response = await fetch(dataUrl);

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는 중 오류가 발생했습니다."
        );
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dataUrl && !initialData) {
      fetchData();
    }
  }, [dataUrl, initialData]);

  const renderComponent = (component: any) => {
    switch (component.type) {
      case "header":
        return <Header key={component.id} {...component} />;
      case "carousel":
        return <Carousel key={component.id} {...component} />;
      case "section":
        return <Section key={component.id} {...component} />;
      case "product_list":
        return <ProductList key={component.id} {...component} />;
      case "button":
        return <Button key={component.id} {...component} />;
      case "footer":
        return <Footer key={component.id} {...component} />;
      default:
        console.warn(`지원하지 않는 컴포넌트 타입: ${component.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: data.screen.backgroundColor || "#ffffff" }}
    >
      {data.screen.components.map((component) => renderComponent(component))}
    </div>
  );
};

export default ServerDrivenUI;
