import React, { useEffect, useState, useRef } from "react";
import useServerDrivenEngine from "./hooks/useServerDrivenEngine";
import reactRenderers from "./renderers/reactRenderers";
import nativeRenderers from "./renderers/nativeRenderers";
import { UINode } from "./core/ServerDrivenUIEngine";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNative, setIsNative] = useState(false);

  // ServerDrivenUIEngine 훅 사용
  const { engine, loading, error, rootNode, reload } = useServerDrivenEngine({
    url: "/test.json",
    renderers: isNative ? nativeRenderers : reactRenderers
  });

  // 렌더러 갱신
  useEffect(() => {
    if (isNative) {
      engine.registerRenderers(nativeRenderers);
    } else {
      engine.registerRenderers(reactRenderers);
    }
  }, [isNative, engine]);

  // DOM으로 렌더링 (네이티브 모드일 때)
  useEffect(() => {
    if (isNative && rootNode && containerRef.current) {
      // 컨테이너 내용 초기화
      containerRef.current.innerHTML = "";

      // 전체 UI 트리를 DOM으로 렌더링
      const uiElement = engine.renderToDOM(rootNode);
      if (uiElement) {
        containerRef.current.appendChild(uiElement);
      }
    }
  }, [isNative, rootNode, engine]);

  // 렌더링 모드 전환 핸들러
  const toggleRenderMode = () => {
    setIsNative(!isNative);
  };

  // 데이터 다시 로드 핸들러
  const handleReload = () => {
    reload();
  };

  // React 모드에서 Virtual DOM 렌더링
  const renderVirtualDOM = () => {
    if (!rootNode) return null;
    return engine.createVirtualDOM(rootNode);
  };

  // 로딩 중인 경우
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">로딩 중...</p>
      </div>
    );
  }

  // 오류가 발생한 경우
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="text-gray-700">{error.message}</p>
          <p className="mt-4 text-gray-600">
            test.json 파일이 public 폴더에 존재하는지 확인해주세요.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleReload}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 루트 노드가 없는 경우
  if (!rootNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">데이터 없음</h1>
          <p className="text-gray-700">
            서버에서 데이터를 받아오지 못했습니다.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleReload}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 컨트롤 패널 */}
      <div className="bg-white p-4 shadow-md mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Server-Driven UI 엔진</h1>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={toggleRenderMode}
          >
            {isNative ? "React 모드로 전환" : "네이티브 모드로 전환"}
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleReload}
          >
            새로고침
          </button>
        </div>
      </div>

      {/* UI 렌더링 영역 */}
      {isNative ? (
        <div
          ref={containerRef}
          className="container mx-auto"
          style={{
            backgroundColor: rootNode.props.backgroundColor || "#ffffff"
          }}
        ></div>
      ) : (
        <div
          className="container mx-auto"
          style={{
            backgroundColor: rootNode.props.backgroundColor || "#ffffff"
          }}
        >
          {renderVirtualDOM()}
        </div>
      )}
    </div>
  );
}

export default App;
