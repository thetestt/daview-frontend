// 📂 src/components/SliderBanner.js
import React, { useEffect, useRef, useState } from "react";
import slideImages from "../data/slideImages";
import "../styles/components/SliderBanner.css";

// 복제된 슬라이드 배열 생성 (구조 보존)
const cloneSlides = [
  { ...slideImages[slideImages.length - 1] },
  ...slideImages.map((item) => ({ ...item })),
  { ...slideImages[0] },
];

function SliderBanner() {
  const [index, setIndex] = useState(1); // 실제 첫 슬라이드는 index 1
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const length = cloneSlides.length;

  // 자동 슬라이드
  useEffect(() => {
    if (!isTransitioning || isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isTransitioning, isHovered]);

  // 트랜지션 리셋
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const goToPrev = () => {
    if (index <= 0) return;
    setIndex(index - 1);
  };

  const goToNext = () => {
    if (index >= length - 1) return;
    setIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    if (index === length - 1) {
      setIsTransitioning(false);
      setIndex(1);
    } else if (index === 0) {
      setIsTransitioning(false);
      setIndex(length - 2);
    }
  };

  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`slider-track ${isTransitioning ? "transition" : ""}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {cloneSlides.map((item, i) => (
          <a href={item?.url || "#"} key={i}>
            <img
              src={item?.image}
              alt={item?.alt || "슬라이드 이미지"}
              className="slide-image"
            />
          </a>
        ))}
      </div>

      {/* 좌우 버튼 */}
      <button className="nav-button prev" onClick={goToPrev}>
        ‹
      </button>
      <button className="nav-button next" onClick={goToNext}>
        ›
      </button>

      {/* 인디케이터 */}
      <div className="indicators">
        {slideImages.map((_, i) => (
          <span
            key={i}
            className={`dot ${i + 1 === index ? "active" : ""}`}
            onClick={() => setIndex(i + 1)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default SliderBanner;
