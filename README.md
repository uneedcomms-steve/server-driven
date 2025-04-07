# Server-Driven UI 엔진

HTML 파서와 유사한 접근 방식으로 서버에서 제공된 JSON 데이터를 기반으로 UI를 동적으로 구성하는 서버 드리븐 UI 엔진입니다.

## 주요 기능

- 클래스 기반 서버 드리븐 UI 엔진
- JSON 데이터로부터 UI 트리 구성
- React 및 네이티브 DOM 렌더링 지원
- 컴포넌트 및 렌더러 등록 시스템
- 트리 탐색 및 검색 기능

## 폴더 구조

```
src/
├── core/                   # 코어 엔진
│   ├── ServerDrivenUIEngine.ts   # 메인 엔진 클래스
│   └── ServerDrivenRenderer.tsx   # React 렌더러 (옵션)
├── hooks/                  # React 연동 훅
│   ├── useServerDrivenEngine.ts   # 엔진 사용 훅
│   └── useServerDrivenUI.ts       # 기존 훅 (옵션)
├── renderers/              # 렌더러 구현
│   ├── nativeRenderers.ts    # 네이티브 DOM 렌더러
│   ├── reactRenderers.tsx    # React 렌더러
│   └── index.ts              # 렌더러 내보내기
├── types/                  # 타입 정의
│   └── ServerDrivenUI.ts     # 서버 드리븐 UI 타입
```

## 사용 방법

### 서버 드리븐 UI 엔진 직접 사용

```typescript
import ServerDrivenUIEngine from "./core/ServerDrivenUIEngine";
import nativeRenderers from "./renderers/nativeRenderers";

// 엔진 인스턴스 생성
const engine = new ServerDrivenUIEngine();

// 렌더러 등록
engine.registerRenderers(nativeRenderers);

// 데이터 로드 (URL에서)
await engine.loadFromURL("/path/to/ui-data.json");

// 또는 직접 데이터 설정
engine.loadData(uiData);

// 루트 노드 가져오기
const rootNode = engine.getRootNode();

// DOM으로 렌더링
const container = document.getElementById("app");
const element = engine.renderToDOM(rootNode);
if (element) {
  container.appendChild(element);
}
```

### React와 함께 사용

```tsx
import React from "react";
import useServerDrivenEngine from "./hooks/useServerDrivenEngine";
import reactRenderers from "./renderers/reactRenderers";

function App() {
  // 훅 사용
  const { engine, loading, error, rootNode } = useServerDrivenEngine({
    url: "/ui-data.json",
    renderers: reactRenderers
  });

  // 로딩 중
  if (loading) return <div>로딩 중...</div>;

  // 오류 발생
  if (error) return <div>오류: {error.message}</div>;

  // 데이터 없음
  if (!rootNode) return <div>데이터 없음</div>;

  // Virtual DOM 렌더링
  return <div>{engine.createVirtualDOM(rootNode)}</div>;
}
```

## JSON 데이터 형식

서버에서 제공하는 JSON 데이터 예시:

```json
{
  "version": "1.0",
  "screen": {
    "id": "home_screen",
    "title": "홈 화면",
    "backgroundColor": "#f5f5f5",
    "components": [
      {
        "type": "header",
        "id": "main_header",
        "title": "서버 드리븐 UI 예제",
        "backgroundColor": "#4A90E2",
        "textColor": "#FFFFFF",
        "height": 60
      },
      {
        "type": "section",
        "id": "category_section",
        "title": "카테고리",
        "layout": "grid",
        "columns": 2,
        "items": [
          {
            "id": "category_1",
            "title": "전자기기",
            "iconUrl": "https://via.placeholder.com/50?text=전자"
          },
          {
            "id": "category_2",
            "title": "의류",
            "iconUrl": "https://via.placeholder.com/50?text=의류"
          }
        ]
      },
      {
        "type": "button",
        "id": "promo_button",
        "title": "프로모션 보기",
        "style": "primary",
        "backgroundColor": "#FF5722",
        "textColor": "#FFFFFF",
        "cornerRadius": 8
      }
    ]
  }
}
```

## 커스텀 렌더러 구현

### 네이티브 DOM 렌더러 예시

```typescript
export const customRenderer = (
  props: any,
  children?: UINode[]
): HTMLElement => {
  const element = document.createElement("div");
  // 속성 및 스타일 설정
  element.className = "custom-element";
  element.textContent = props.text || "";

  // 이벤트 처리
  if (props.action) {
    element.addEventListener("click", () => {
      console.log("Action:", props.action);
    });
  }

  return element;
};
```

### React 렌더러 예시

```tsx
export const CustomReactRenderer = (props: any) => {
  const { text, action, children } = props;

  const handleClick = () => {
    if (action) {
      console.log("Action:", action);
    }
  };

  return (
    <div className="custom-element" onClick={action ? handleClick : undefined}>
      {text}
      {children}
    </div>
  );
};
```

## 라이센스

MIT

## 참고 자료

- [Server-Driven UI에 대한 이해](https://tech.airbnb.com/server-driven-ui-the-future-of-mobile-app-development/)
- [React에서 Server-Driven UI 구현하기](https://medium.com/airbnb-engineering/building-a-server-driven-ui-system-for-airbnb-rentals-6095acfc4f55)
