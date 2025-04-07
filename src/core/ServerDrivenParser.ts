import { ServerDrivenUIData, BaseComponent } from "../types/ServerDrivenUI";

/**
 * 서버 드리븐 UI 파서 클래스
 * HTML 파서와 유사한 방식으로 JSON 데이터를 파싱하여 렌더링 정보를 생성
 */
class ServerDrivenParser {
  private data: ServerDrivenUIData | null = null;
  private renderers: Map<string, any> = new Map();

  /**
   * 파서 생성자
   * @param data 초기 데이터 (선택적)
   */
  constructor(data?: ServerDrivenUIData) {
    if (data) {
      this.setData(data);
    }
  }

  /**
   * 데이터 설정 메서드
   * @param data 서버 드리븐 UI 데이터
   */
  public setData(data: ServerDrivenUIData): void {
    this.data = data;
  }

  /**
   * 데이터 가져오기 메서드
   * @returns 현재 설정된 데이터
   */
  public getData(): ServerDrivenUIData | null {
    return this.data;
  }

  /**
   * 특정 컴포넌트 타입에 대한 렌더러 등록
   * @param type 컴포넌트 타입
   * @param renderer 렌더러 함수 또는 컴포넌트
   */
  public registerRenderer(type: string, renderer: any): void {
    this.renderers.set(type, renderer);
  }

  /**
   * 여러 렌더러를 한 번에 등록
   * @param renderers 타입과 렌더러 맵 객체
   */
  public registerRenderers(renderers: Record<string, any>): void {
    Object.entries(renderers).forEach(([type, renderer]) => {
      this.registerRenderer(type, renderer);
    });
  }

  /**
   * 특정 타입의 렌더러 가져오기
   * @param type 컴포넌트 타입
   * @returns 해당 타입의 렌더러 또는 undefined
   */
  public getRenderer(type: string): any {
    return this.renderers.get(type);
  }

  /**
   * 특정 타입의 렌더러가 등록되어 있는지 확인
   * @param type 컴포넌트 타입
   * @returns 등록 여부
   */
  public hasRenderer(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * 단일 컴포넌트 파싱
   * @param component 컴포넌트 객체
   * @returns 렌더러에 필요한 데이터 객체
   */
  public parseComponent(component: BaseComponent): {
    type: string;
    renderer: any;
    props: any;
  } {
    const { type, ...props } = component;
    const renderer = this.getRenderer(type);

    if (!renderer) {
      console.warn(`렌더러를 찾을 수 없음: ${type}`);
      return { type, renderer: null, props };
    }

    return { type, renderer, props };
  }

  /**
   * 전체 화면 구성 컴포넌트 파싱
   * @returns 파싱된 화면 데이터
   */
  public parseScreen(): {
    backgroundColor: string;
    components: Array<{ type: string; renderer: any; props: any }>;
  } | null {
    if (!this.data || !this.data.screen) {
      return null;
    }

    const { backgroundColor = "#ffffff", components = [] } = this.data.screen;

    const parsedComponents = components.map((component) =>
      this.parseComponent(component)
    );

    return {
      backgroundColor,
      components: parsedComponents
    };
  }

  /**
   * URL로부터 데이터 가져오기
   * @param url 데이터를 가져올 URL
   * @returns Promise<ServerDrivenUIData>
   */
  public async fetchFromUrl(url: string): Promise<ServerDrivenUIData> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      this.setData(data);
      return data;
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      throw error;
    }
  }
}

export default ServerDrivenParser;
