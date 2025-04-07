import React, { useState, useEffect } from "react";
import { CarouselComponent } from "../../../types/ServerDrivenUI";

const Carousel: React.FC<CarouselComponent> = ({
  items,
  autoplay = false,
  autoplayInterval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-48 md:h-64">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              pointerEvents: index === currentIndex ? "auto" : "none"
            }}
            onClick={() =>
              item.action && console.log("Navigate to:", item.action)
            }
          >
            <img
              src={item.imageUrl}
              alt={`슬라이드 ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md z-10"
            onClick={goToPrevSlide}
          >
            ◀
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md z-10"
            onClick={goToNextSlide}
          >
            ▶
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
