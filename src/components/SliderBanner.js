// 📂 src/components/SliderBanner.js
import React, { useEffect, useRef, useState } from "react";
import slideImages from "../data/slideImages";
import styles from "../styles/components/SliderBanner.module.css";

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
      className={styles["slider-container"]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${styles["slider-track"]} ${
          isTransitioning ? styles["transition"] : ""
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {cloneSlides.map((item, i) => (
          <a
            href={item?.url || "#"}
            key={i}
            onClick={(e) => e.preventDefault()}
          >
            <img
              src={item?.image}
              alt={item?.alt || "슬라이드 이미지"}
              className={styles["slide-image"]}
            />
          </a>
        ))}
      </div>

      {/* 좌우 버튼 */}
      <div className={styles["nav-wrapper"]}>
        <button
          className={`${styles["nav-button"]} ${styles["prev"]}`}
          onClick={goToPrev}
        >
          ❮
        </button>
        <button
          className={`${styles["nav-button"]} ${styles["next"]}`}
          onClick={goToNext}
        >
          ❯
        </button>
      </div>

      {/* 인디케이터 */}
      <div className={styles["indicators"]}>
        {slideImages.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i + 1 === index ? styles.active : ""}`}
            onClick={() => setIndex(i + 1)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default SliderBanner;
