// 서버 드리븐 UI 기본 타입 정의

export interface Action {
  type: "navigate" | "deeplink" | "webview" | "api";
  destination: string;
  params?: Record<string, any>;
}

export interface BaseComponent {
  id: string;
  type: string;
}

// 헤더 컴포넌트
export interface HeaderComponent extends BaseComponent {
  type: "header";
  title: string;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
}

// 캐러셀 아이템
export interface CarouselItem {
  id: string;
  imageUrl: string;
  action?: Action;
}

// 캐러셀 컴포넌트
export interface CarouselComponent extends BaseComponent {
  type: "carousel";
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

// 섹션 아이템
export interface SectionItem {
  id: string;
  title: string;
  iconUrl?: string;
  action?: Action;
}

// 섹션 컴포넌트
export interface SectionComponent extends BaseComponent {
  type: "section";
  title: string;
  items: SectionItem[];
  layout: "grid" | "list" | "horizontal";
  columns?: number;
}

// 상품 아이템
export interface ProductItem {
  id: string;
  title: string;
  price?: string;
  discountPrice?: string;
  imageUrl: string;
  badge?: string;
  action?: Action;
}

// 상품 목록 컴포넌트
export interface ProductListComponent extends BaseComponent {
  type: "product_list";
  title: string;
  items: ProductItem[];
  layout: "grid" | "list" | "horizontal";
  showPrice?: boolean;
  showDiscountPrice?: boolean;
}

// 버튼 컴포넌트
export interface ButtonComponent extends BaseComponent {
  type: "button";
  title: string;
  style?: "primary" | "secondary" | "outline";
  backgroundColor?: string;
  textColor?: string;
  cornerRadius?: number;
  action?: Action;
}

// 푸터 아이템
export interface FooterItem {
  id: string;
  title: string;
  iconUrl?: string;
  isSelected?: boolean;
  badgeCount?: number;
  action?: Action;
}

// 푸터 컴포넌트
export interface FooterComponent extends BaseComponent {
  type: "footer";
  items: FooterItem[];
  backgroundColor?: string;
  layout: "tabs" | "buttons";
}

// 화면 정의
export interface Screen {
  id: string;
  title: string;
  backgroundColor?: string;
  components: (
    | HeaderComponent
    | CarouselComponent
    | SectionComponent
    | ProductListComponent
    | ButtonComponent
    | FooterComponent
  )[];
}

// 전체 서버 드리븐 UI 데이터 구조
export interface ServerDrivenUIData {
  version: string;
  screen: Screen;
}
