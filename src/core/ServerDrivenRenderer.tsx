import React, { Component } from "react";
import ServerDrivenParser from "./ServerDrivenParser";
import { ServerDrivenUIData } from "../types/ServerDrivenUI";

interface ServerDrivenRendererProps {
  data?: ServerDrivenUIData;
  dataUrl?: string;
  parser?: ServerDrivenParser;
  renderers?: Record<string, React.ComponentType<any>>;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

interface ServerDrivenRendererState {
  loading: boolean;
  error: Error | null;
  data: ServerDrivenUIData | null;
}

/**
 * 서버 드리븐 UI 렌더러 클래스 컴포넌트
 * 파서를 사용하여 JSON 데이터를 React 컴포넌트로 렌더링
 */
class ServerDrivenRenderer extends Component<
  ServerDrivenRendererProps,
  ServerDrivenRendererState
> {
  private parser: ServerDrivenParser;

  constructor(props: ServerDrivenRendererProps) {
    super(props);

    // 파서 인스턴스 생성 (props에서 제공되거나 새로 생성)
    this.parser =
      props.parser || new ServerDrivenParser(props.data || undefined);

    // 렌더러 등록
    if (props.renderers) {
      this.parser.registerRenderers(props.renderers);
    }

    this.state = {
      loading: !!props.dataUrl && !props.data,
      error: null,
      data: props.data || null
    };
  }

  async componentDidMount() {
    // URL이 제공된 경우 데이터 가져오기
    if (this.props.dataUrl && !this.props.data) {
      await this.fetchData();
    }
  }

  async componentDidUpdate(prevProps: ServerDrivenRendererProps) {
    // URL이 변경된 경우 데이터 다시 가져오기
    if (this.props.dataUrl !== prevProps.dataUrl && this.props.dataUrl) {
      await this.fetchData();
    }

    // 새 데이터가 제공된 경우 파서 업데이트
    if (this.props.data !== prevProps.data && this.props.data) {
      this.parser.setData(this.props.data);
      this.setState({ data: this.props.data });
    }

    // 새 렌더러가 제공된 경우 등록
    if (this.props.renderers !== prevProps.renderers && this.props.renderers) {
      this.parser.registerRenderers(this.props.renderers);
    }
  }

  /**
   * URL에서 데이터 가져오기
   */
  private async fetchData() {
    try {
      this.setState({ loading: true, error: null });
      const data = await this.parser.fetchFromUrl(this.props.dataUrl!);
      this.setState({ data, loading: false });
    } catch (error) {
      console.error("데이터 로드 실패:", error);

      const err = error instanceof Error ? error : new Error(String(error));
      this.setState({ error: err, loading: false });

      if (this.props.onError) {
        this.props.onError(err);
      }
    }
  }

  /**
   * 컴포넌트 렌더링
   * @param parsedComponent 파싱된 컴포넌트 정보
   * @param index 인덱스
   */
  private renderComponent(
    parsedComponent: { type: string; renderer: any; props: any },
    index: number
  ) {
    const { renderer, props } = parsedComponent;

    if (!renderer) {
      return null;
    }

    // 렌더러가 React 컴포넌트인 경우
    const Renderer = renderer;
    return <Renderer key={props.id || `component-${index}`} {...props} />;
  }

  render() {
    const { loading, error, data } = this.state;
    const { loadingComponent, fallback } = this.props;

    // 로딩 중
    if (loading) {
      return (
        loadingComponent || (
          <div className="flex items-center justify-center p-8">로딩 중...</div>
        )
      );
    }

    // 오류 발생
    if (error) {
      return (
        fallback || (
          <div className="flex items-center justify-center p-8 text-red-600">
            {error.message}
          </div>
        )
      );
    }

    // 데이터가 없는 경우
    if (!data) {
      return (
        fallback || (
          <div className="flex items-center justify-center p-8">
            데이터가 없습니다.
          </div>
        )
      );
    }

    // 화면 파싱
    const parsedScreen = this.parser.parseScreen();
    if (!parsedScreen) {
      return (
        fallback || (
          <div className="flex items-center justify-center p-8">
            화면 구성 데이터가 유효하지 않습니다.
          </div>
        )
      );
    }

    // 화면 렌더링
    return (
      <div
        className="flex flex-col min-h-screen"
        style={{ backgroundColor: parsedScreen.backgroundColor }}
      >
        {parsedScreen.components.map((component, index) =>
          this.renderComponent(component, index)
        )}
      </div>
    );
  }
}

export default ServerDrivenRenderer;
