import { UINode } from "../core/ServerDrivenUIEngine";

/**
 * 헤더 요소를 렌더링하는 함수
 * @param props 헤더 속성
 * @param children 자식 노드
 * @returns 헤더 HTML 요소
 */
export const headerRenderer = (
  props: any,
  children?: UINode[]
): HTMLElement => {
  const header = document.createElement("header");

  // 속성 설정
  header.style.backgroundColor = props.backgroundColor || "#FFFFFF";
  header.style.color = props.textColor || "#000000";
  header.style.height = `${props.height || 60}px`;
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "center";
  header.style.padding = "0 16px";
  header.style.width = "100%";

  // 제목 추가
  const title = document.createElement("h1");
  title.style.fontSize = "1.25rem";
  title.style.fontWeight = "700";
  title.textContent = props.title || "";
  header.appendChild(title);

  return header;
};

/**
 * 버튼 요소를 렌더링하는 함수
 * @param props 버튼 속성
 * @param children 자식 노드
 * @returns 버튼 HTML 요소
 */
export const buttonRenderer = (
  props: any,
  children?: UINode[]
): HTMLElement => {
  const button = document.createElement("button");

  // 기본 스타일 설정
  button.style.width = "100%";
  button.style.padding = "12px 0";
  button.style.fontWeight = "500";
  button.style.transition = "all 0.2s ease";
  button.style.cursor = "pointer";
  button.style.border = "none";
  button.style.borderRadius = props.cornerRadius
    ? `${props.cornerRadius}px`
    : "4px";

  // 스타일 유형별 설정
  switch (props.style) {
    case "primary":
      button.style.backgroundColor = props.backgroundColor || "#3B82F6";
      button.style.color = props.textColor || "#FFFFFF";
      break;
    case "secondary":
      button.style.backgroundColor = props.backgroundColor || "#E5E7EB";
      button.style.color = props.textColor || "#1F2937";
      break;
    case "outline":
      button.style.backgroundColor = "transparent";
      button.style.border = "1px solid #D1D5DB";
      button.style.color = props.textColor || "#1F2937";
      break;
    default:
      button.style.backgroundColor = props.backgroundColor || "#3B82F6";
      button.style.color = props.textColor || "#FFFFFF";
  }

  // 텍스트 설정
  button.textContent = props.title || "";

  // hover 효과를 위한 이벤트 설정
  button.addEventListener("mouseover", () => {
    if (props.style === "primary") {
      button.style.backgroundColor = "#2563EB";
    } else if (props.style === "secondary") {
      button.style.backgroundColor = "#D1D5DB";
    } else if (props.style === "outline") {
      button.style.backgroundColor = "#F3F4F6";
    }
  });

  button.addEventListener("mouseout", () => {
    if (props.style === "primary") {
      button.style.backgroundColor = props.backgroundColor || "#3B82F6";
    } else if (props.style === "secondary") {
      button.style.backgroundColor = props.backgroundColor || "#E5E7EB";
    } else if (props.style === "outline") {
      button.style.backgroundColor = "transparent";
    }
  });

  // 클릭 이벤트 설정
  if (props.action) {
    button.setAttribute("data-action", JSON.stringify(props.action));
    button.addEventListener("click", () => {
      console.log("버튼 클릭:", props.action);
    });
  }

  return button;
};

/**
 * 섹션 요소를 렌더링하는 함수
 * @param props 섹션 속성
 * @param children 자식 노드
 * @returns 섹션 HTML 요소
 */
export const sectionRenderer = (
  props: any,
  children?: UINode[]
): HTMLElement => {
  const section = document.createElement("section");
  section.style.padding = "16px";

  // 제목 추가
  if (props.title) {
    const title = document.createElement("h2");
    title.style.fontSize = "1.125rem";
    title.style.fontWeight = "700";
    title.textContent = props.title;
    section.appendChild(title);
  }

  // 아이템 컨테이너 추가
  const container = document.createElement("div");
  container.style.marginTop = "8px";

  switch (props.layout) {
    case "grid":
      container.style.display = "grid";
      container.style.gap = "16px";
      container.style.gridTemplateColumns = `repeat(${
        props.columns || 2
      }, 1fr)`;
      break;
    case "list":
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      break;
    case "horizontal":
      container.style.display = "flex";
      container.style.overflowX = "auto";
      container.style.paddingBottom = "8px";
      break;
  }

  // 아이템 추가
  if (props.items && Array.isArray(props.items)) {
    props.items.forEach((item: any) => {
      const itemElement = createItemElement(item, props.layout);
      container.appendChild(itemElement);
    });
  }

  section.appendChild(container);
  return section;
};

/**
 * 섹션 아이템 요소 생성 헬퍼 함수
 * @param item 아이템 데이터
 * @param layout 레이아웃 타입
 * @returns 아이템 HTML 요소
 */
const createItemElement = (item: any, layout: string = "grid"): HTMLElement => {
  const itemElement = document.createElement("div");

  // 레이아웃 유형별 스타일 설정
  switch (layout) {
    case "grid":
      itemElement.style.display = "flex";
      itemElement.style.flexDirection = "column";
      itemElement.style.alignItems = "center";
      itemElement.style.padding = "8px";
      itemElement.style.backgroundColor = "white";
      itemElement.style.borderRadius = "8px";
      itemElement.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      break;
    case "list":
      itemElement.style.display = "flex";
      itemElement.style.alignItems = "center";
      itemElement.style.padding = "12px";
      itemElement.style.backgroundColor = "white";
      itemElement.style.borderRadius = "8px";
      itemElement.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      break;
    case "horizontal":
      itemElement.style.flexShrink = "0";
      itemElement.style.display = "flex";
      itemElement.style.flexDirection = "column";
      itemElement.style.alignItems = "center";
      itemElement.style.padding = "8px";
      itemElement.style.marginRight = "12px";
      itemElement.style.backgroundColor = "white";
      itemElement.style.borderRadius = "8px";
      itemElement.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      itemElement.style.width = "80px";
      break;
  }

  // 아이콘 추가
  if (item.iconUrl) {
    const icon = document.createElement("img");
    icon.src = item.iconUrl;
    icon.alt = item.title || "";

    if (layout === "grid") {
      icon.style.width = "48px";
      icon.style.height = "48px";
      icon.style.marginBottom = "8px";
    } else if (layout === "list") {
      icon.style.width = "32px";
      icon.style.height = "32px";
      icon.style.marginRight = "12px";
    } else if (layout === "horizontal") {
      icon.style.width = "40px";
      icon.style.height = "40px";
      icon.style.marginBottom = "4px";
    }

    itemElement.appendChild(icon);
  }

  // 제목 추가
  const title = document.createElement("span");
  title.textContent = item.title || "";

  if (layout === "grid" || layout === "horizontal") {
    title.style.fontSize = "0.875rem";
    title.style.fontWeight = "500";
    title.style.textAlign = "center";
  } else {
    title.style.fontSize = "0.875rem";
    title.style.fontWeight = "500";
  }

  itemElement.appendChild(title);

  // 클릭 이벤트 설정
  if (item.action) {
    itemElement.setAttribute("data-action", JSON.stringify(item.action));
    itemElement.style.cursor = "pointer";
    itemElement.addEventListener("click", () => {
      console.log("아이템 클릭:", item.action);
    });
  }

  return itemElement;
};

/**
 * 기본 제공되는 네이티브 DOM 렌더러 맵
 */
const nativeRenderers = {
  header: headerRenderer,
  button: buttonRenderer,
  section: sectionRenderer
  // 다른 렌더러는 필요에 따라 추가할 수 있습니다.
};

export default nativeRenderers;
