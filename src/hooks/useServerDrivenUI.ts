import { useState, useEffect, useMemo } from "react";
import ServerDrivenParser from "../core/ServerDrivenParser";
import defaultRenderers from "../renderers";
import { ServerDrivenUIData } from "../types/ServerDrivenUI";

interface ServerDrivenUIOptions {
  url?: string;
  initialData?: ServerDrivenUIData;
  renderers?: Record<string, any>;
}

interface ServerDrivenUIResult {
  parser: ServerDrivenParser;
  data: ServerDrivenUIData | null;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * 서버 드리븐 UI 파서를 관리하는 React 훅
 *
 * @param options 설정 옵션
 * @returns 파서, 데이터, 로딩 상태, 오류 및 새로고침 함수
 */
const useServerDrivenUI = (
  options: ServerDrivenUIOptions = {}
): ServerDrivenUIResult => {
  const { url, initialData, renderers = defaultRenderers } = options;

  // 파서 인스턴스 생성 (메모이제이션)
  const parser = useMemo(
    () => new ServerDrivenParser(initialData),
    [initialData]
  );

  // 상태 관리
  const [data, setData] = useState<ServerDrivenUIData | null>(
    initialData || null
  );
  const [loading, setLoading] = useState<boolean>(!initialData && !!url);
  const [error, setError] = useState<Error | null>(null);

  // 데이터 로드 함수
  const loadData = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const fetchedData = await parser.fetchFromUrl(url);
      setData(fetchedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("서버 드리븐 UI 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 렌더러 등록 및 초기 데이터 로드
  useEffect(() => {
    // 렌더러 등록
    if (renderers) {
      parser.registerRenderers(renderers);
    }

    // 초기 데이터가 없고 URL이 제공된 경우 데이터 로드
    if (!initialData && url) {
      loadData();
    }
  }, [parser, url, initialData, renderers]);

  // URL 변경 시 데이터 다시 로드
  useEffect(() => {
    if (url) {
      loadData();
    }
  }, [url]);

  return {
    parser,
    data,
    loading,
    error,
    reload: loadData
  };
};

export default useServerDrivenUI;
