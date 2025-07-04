// 📂 src/pages/SilvertownDetail.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/pages/Detail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import { fetchSilvertownDetail } from "../api/silvertown";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";
import NaverMap from "../components/common/NaverMap";
import backgroundShape from "../assets/mwhite.png";

function SilvertownDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSilvertownDetail(id)
      .then(setData)
      .catch((err) => console.error("API 오류:", err));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  const photos = data.photos?.filter((url) => url) || ["/images/default.png"];

  const address = `${data.facilityAddressLocation} ${data.facilityAddressCity} ${data.facilityDetailAddress}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const imageWidth = 700;
  const imageMargin = -10;
  const totalImageWidth = imageWidth + imageMargin * 2;
  const wrapperWidth = 1000;
  const offset =
    wrapperWidth / 2 - totalImageWidth / 2 - currentIndex * totalImageWidth;
  return (
    <>
      <FloatingNavButtons />
      <div className={styles["page-background"]}>
        <div className={styles["detail-wrapper"]}>
          <div className={styles["main-section"]}>
            {/* 1. 사진 */}
            <div className={styles["photo-slider"]}>
              <div className={styles["carousel-wrapper"]}>
                <div
                  className={styles["carousel-track"]}
                  style={{
                    transform: `translateX(${offset}px)`,
                  }}
                >
                  {photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`slide-${i}`}
                      className={`${styles["carousel-image"]} ${
                        i === currentIndex ? styles["active"] : ""
                      }`}
                    />
                  ))}
                </div>
                <button onClick={handlePrev} className={styles["arrow-left"]}>
                  ❮
                </button>
                <button onClick={handleNext} className={styles["arrow-right"]}>
                  ❯
                </button>
              </div>
            </div>

            <div className={styles["info_map-box"]}>
              {/* 2. 텍스트 정보 */}
              <div className={styles["info-box"]}>
                <div className={styles["info-detail-box"]}>
                  {" "}
                  <img
                    src={backgroundShape}
                    alt="quote"
                    className={styles["list-quote-background"]}
                  />
                </div>
                <h2>{data.facilityName}</h2>
                <div className={styles["tags"]}>
                  태그: {data.tags.join(", ")}
                </div>
                <p className={styles["price"]}>
                  {data.facilityCharge.toLocaleString()}원 / 월
                </p>
                <p>주소: {address}</p>
                <p>테마: {data.facilityTheme}</p>
                <p>
                  홈페이지:{" "}
                  <a
                    href={data.facilityHomepage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.facilityHomepage}
                  </a>
                </p>
                <p>전화번호: {data.facilityPhone}</p>
                <div className={styles["button-group"]}>
                  <ChatButton facilityId={id} receiverId={data.memberId} />
                  <HeartButton facilityId={id} />
                  <CartButton data={data} productType="silvertown" />
                </div>
              </div>

              {/* 3. 지도 */}

              <NaverMap className={styles["map-box"]} address={address} />
            </div>
          </div>
          <div className={styles["notice-review-section"]}>
            <h3>공지사항</h3>
            <ul>
              {data.notices.length > 0 ? (
                data.notices.map((notice, idx) => (
                  <li key={idx}>
                    <Link to={`/notice/${data.facilityId}/${notice.noticeId}`}>
                      [{notice.noticeIsFixed ? "공지" : "일반"}]{" "}
                      {notice.noticeTitle}
                    </Link>
                  </li>
                ))
              ) : (
                <li>공지사항 없음</li>
              )}
            </ul>
            <Link to={`/notice/${data.facilityId}`}>공지사항 전체 보기</Link>

            <h3>리뷰</h3>
            <div className={styles["review-box"]}>
              {/* 여기에 리뷰 슬라이드 또는 리스트 추가 가능 */}
              <p>분위기가 너무 좋아요 ★★★★★</p>
            </div>

            <h3>상세페이지</h3>
            <div className={styles["detail-desc"]}>
              {/* 시설 소개 글 또는 추가 정보 */}
              {data.facilityDetailText || "상세 설명이 없습니다."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SilvertownDetail;
