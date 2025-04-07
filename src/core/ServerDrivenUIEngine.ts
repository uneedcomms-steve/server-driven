import { ServerDrivenUIData } from "../types/ServerDrivenUI";

// Node 타입 정의 (브라우저 환경에서는 전역으로 사용 가능)
type DOMNode = globalThis.Node;

/**
 * 서버 드리븐 UI 엔진의 노드 인터페이스
 */
export interface UINode {
  type: string;
  props: Record<string, any>;
  children?: UINode[];
  parent?: UINode | null;
}

/**
 * 서버 드리븐 UI 엔진
 * HTML 파서와 유사하게 JSON 데이터를 파싱하고 렌더링 트리를 구성합니다.
 */
class ServerDrivenUIEngine {
  private data: ServerDrivenUIData | null = null;
  private rootNode: UINode | null = null;
  private nodeRegistry: Map<string, any> = new Map();
  private rendererRegistry: Map<string, any> = new Map();

  /**
   * ServerDrivenUIEngine 생성자
   * @param data 초기 데이터 (선택적)
   */
  constructor(data?: ServerDrivenUIData) {
    if (data) {
      this.loadData(data);
    }
  }

  /**
   * 데이터 로드 및 파싱
   * @param data UI 데이터
   */
  public loadData(data: ServerDrivenUIData): void {
    this.data = data;
    this.parse();
  }

  /**
   * URL에서 데이터 로드
   * @param url 데이터 URL
   * @returns Promise<void>
   */
  public async loadFromURL(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      this.loadData(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      throw error;
    }
  }

  /**
   * 컴포넌트 등록
   * @param type 컴포넌트 타입
   * @param componentClass 컴포넌트 클래스 또는 생성자
   */
  public registerComponent(type: string, componentClass: any): void {
    this.nodeRegistry.set(type, componentClass);
  }

  /**
   * 일괄 컴포넌트 등록
   * @param components 컴포넌트 레지스트리
   */
  public registerComponents(components: Record<string, any>): void {
    Object.entries(components).forEach(([type, component]) => {
      this.registerComponent(type, component);
    });
  }

  /**
   * 렌더러 등록
   * @param type 컴포넌트 타입
   * @param renderer 렌더러 함수
   */
  public registerRenderer(type: string, renderer: any): void {
    this.rendererRegistry.set(type, renderer);
  }

  /**
   * 일괄 렌더러 등록
   * @param renderers 렌더러 레지스트리
   */
  public registerRenderers(renderers: Record<string, any>): void {
    Object.entries(renderers).forEach(([type, renderer]) => {
      this.registerRenderer(type, renderer);
    });
  }

  /**
   * 특정 타입의 컴포넌트 클래스 가져오기
   * @param type 컴포넌트 타입
   * @returns 컴포넌트 클래스 또는 undefined
   */
  public getComponent(type: string): any {
    return this.nodeRegistry.get(type);
  }

  /**
   * 특정 타입의 렌더러 가져오기
   * @param type 컴포넌트 타입
   * @returns 렌더러 또는 undefined
   */
  public getRenderer(type: string): any {
    return this.rendererRegistry.get(type);
  }

  /**
   * 데이터 파싱 및 노드 트리 구성
   */
  private parse(): void {
    if (!this.data || !this.data.screen) {
      this.rootNode = null;
      return;
    }

    // 루트 노드 생성
    this.rootNode = {
      type: "screen",
      props: {
        id: this.data.screen.id,
        title: this.data.screen.title,
        backgroundColor: this.data.screen.backgroundColor
      },
      children: []
    };

    // 각 컴포넌트를 자식 노드로 추가
    if (this.data.screen.components) {
      this.data.screen.components.forEach((component) => {
        const childNode = this.createNode(component, this.rootNode);
        if (childNode && this.rootNode?.children) {
          this.rootNode.children.push(childNode);
        }
      });
    }
  }

  /**
   * 단일 컴포넌트를 노드로 변환
   * @param component 컴포넌트 데이터
   * @param parent 부모 노드
   * @returns 생성된 노드
   */
  private createNode(component: any, parent?: UINode | null): UINode | null {
    if (!component || !component.type) {
      return null;
    }

    const { type, ...props } = component;
    const node: UINode = {
      type,
      props,
      parent,
      children: []
    };

    // 자식 컴포넌트가 있는 경우 재귀적으로 처리
    if (props.items && Array.isArray(props.items)) {
      props.items.forEach((item: any) => {
        const childNode = this.createNode(item, node);
        if (childNode) {
          node.children!.push(childNode);
        }
      });
    }

    return node;
  }

  /**
   * 특정 노드를 HTML 요소로 렌더링
   * @param node 렌더링할 노드
   * @returns HTML 요소
   */
  public renderToDOM(node: UINode = this.rootNode!): HTMLElement | null {
    if (!node) return null;

    const renderer = this.getRenderer(node.type);
    if (renderer) {
      const renderedElement = renderer(
        node.props,
        node.children
          ?.map((child) => this.renderToDOM(child))
          .filter(Boolean) || []
      );
      // 렌더러가 유효한 DOM 노드를 반환했는지 확인
      if (renderedElement instanceof HTMLElement) {
        // Tailwind 클래스의 스타일을 확실하게 적용하기 위해 속성을 확정
        renderedElement.setAttribute("data-component-type", node.type);
        return renderedElement;
      } else {
        console.warn(
          `${node.type} 렌더러가 유효한 DOM 노드를 반환하지 않았습니다.`
        );
        return null;
      }
    }

    // 기본 렌더링 구현 (div 생성)
    const element = document.createElement("div");
    element.setAttribute("data-type", node.type);

    // props를 HTML 속성으로 변환
    Object.entries(node.props).forEach(([key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        element.setAttribute(`data-${key}`, String(value));
      }
    });

    // 자식 노드 렌더링
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        const childElement = this.renderToDOM(child);
        if (childElement instanceof HTMLElement) {
          element.appendChild(childElement);
        }
      });
    }

    return element;
  }

  /**
   * 루트 노드 가져오기
   * @returns 루트 노드
   */
  public getRootNode(): UINode | null {
    return this.rootNode;
  }

  /**
   * 노드 트리를 순회하며 노드 검색
   * @param predicate 검색 조건 함수
   * @param node 시작 노드
   * @returns 조건에 맞는 첫 번째 노드
   */
  public findNode(
    predicate: (node: UINode) => boolean,
    node: UINode = this.rootNode!
  ): UINode | null {
    if (!node) return null;

    if (predicate(node)) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNode(predicate, child);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * 노드 트리를 순회하며 여러 노드 검색
   * @param predicate 검색 조건 함수
   * @param node 시작 노드
   * @returns 조건에 맞는 모든 노드
   */
  public findNodes(
    predicate: (node: UINode) => boolean,
    node: UINode = this.rootNode!
  ): UINode[] {
    const results: UINode[] = [];

    if (!node) return results;

    if (predicate(node)) {
      results.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        const childResults = this.findNodes(predicate, child);
        results.push(...childResults);
      }
    }

    return results;
  }

  /**
   * React 렌더링을 위한 Virtual DOM 생성
   * @param node 렌더링할 노드
   * @returns Virtual DOM 객체
   */
  public createVirtualDOM(node: UINode = this.rootNode!): any {
    if (!node) return null;

    const renderer = this.getRenderer(node.type);
    if (!renderer) {
      console.warn(`렌더러를 찾을 수 없음: ${node.type}`);
      return null;
    }

    const { children: nodeChildren, ...nodeProps } = node;

    // 자식 노드의 Virtual DOM 생성
    const childElements =
      node.children?.map((child) => this.createVirtualDOM(child)) || [];

    // 렌더러 호출하여 Virtual DOM 생성
    return renderer({ ...nodeProps.props, children: childElements });
  }
}

export default ServerDrivenUIEngine;
