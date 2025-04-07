import HeaderRenderer from "./HeaderRenderer";

// 다른 렌더러들을 여기에 import하여 추가할 수 있습니다.
// import ButtonRenderer from "./ButtonRenderer";
// import CarouselRenderer from "./CarouselRenderer";
// 등등...

/**
 * 기본 제공되는 렌더러 맵
 * 타입을 키로 사용하고 해당 렌더러 컴포넌트를 값으로 가집니다.
 */
const defaultRenderers = {
  header: HeaderRenderer
  // 다른 렌더러를 여기에 추가할 수 있습니다.
  // button: ButtonRenderer,
  // carousel: CarouselRenderer,
  // 등등...
};

export { HeaderRenderer };
export default defaultRenderers;
