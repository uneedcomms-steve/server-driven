import { useState, useEffect, useMemo } from "react";
import ServerDrivenUIEngine from "../core/ServerDrivenUIEngine";
import { ServerDrivenUIData } from "../types/ServerDrivenUI";

interface UseServerDrivenEngineOptions {
  url?: string;
  data?: ServerDrivenUIData;
  renderers?: Record<string, any>;
  components?: Record<string, any>;
}

interface UseServerDrivenEngineResult {
  engine: ServerDrivenUIEngine;
  loading: boolean;
  error: Error | null;
  rootNode: any;
  reload: () => Promise<void>;
}

/**
 * ServerDrivenUIEngine을 React에서 사용하기 위한 훅
 *
 * @param options 옵션
 * @returns 엔진 인스턴스, 로딩 상태, 오류, 루트 노드 및 재로드 함수
 */
const useServerDrivenEngine = (
  options: UseServerDrivenEngineOptions = {}
): UseServerDrivenEngineResult => {
  const { url, data, renderers, components } = options;

  // 엔진 인스턴스 생성 (메모이제이션)
  const engine = useMemo(() => new ServerDrivenUIEngine(data), [data]);

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(!data && !!url);
  const [error, setError] = useState<Error | null>(null);
  const [rootNode, setRootNode] = useState<any>(null);

  // 엔진 초기화 함수
  const initializeEngine = () => {
    // 컴포넌트 등록
    if (components) {
      engine.registerComponents(components);
    }

    // 렌더러 등록
    if (renderers) {
      engine.registerRenderers(renderers);
    }

    // 데이터가 직접 제공된 경우 로드
    if (data) {
      engine.loadData(data);
      setRootNode(engine.getRootNode());
    }
  };

  // 데이터 로드 함수
  const loadData = async (): Promise<void> => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      await engine.loadFromURL(url);
      setRootNode(engine.getRootNode());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("서버 드리븐 UI 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 엔진 초기화 및 데이터 로드
  useEffect(() => {
    initializeEngine();

    if (url && !data) {
      loadData();
    }
  }, [engine, url, data]);

  // 렌더러 변경 시 다시 등록
  useEffect(() => {
    if (renderers) {
      engine.registerRenderers(renderers);
    }
  }, [engine, renderers]);

  // 컴포넌트 변경 시 다시 등록
  useEffect(() => {
    if (components) {
      engine.registerComponents(components);
    }
  }, [engine, components]);

  return {
    engine,
    loading,
    error,
    rootNode,
    reload: loadData
  };
};

export default useServerDrivenEngine;
