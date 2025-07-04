import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/pages/Detail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";
import NaverMap from "../components/common/NaverMap";
import { fetchNursinghomeDetail } from "../api/nursinghome";
import { getReviewsByProdNm } from "../api/reviewApi";

function NursingHomeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNursinghomeDetail(id)
      .then(setData)
      .catch((err) => console.error("API 오류:", err));
  }, [id]);

  useEffect(() => {
    if (!data || !data.facilityName) return;
    const fetchReviews = async () => {
      try {
        const res = await getReviewsByProdNm(data.facilityName);
        setReviews(res);
      } catch (err) {
        console.error("리뷰 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [data]);

  const calculateAverageStars = (reviews) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.revStars, 0);
    return total / reviews.length;
  };

  const renderStars = (average) => {
    const full = Math.round(average);
    return (
      <>
        {[...Array(full)].map((_, i) => (
          <span key={`full-${i}`} className={styles.star}>
            ★
          </span>
        ))}
        {[...Array(5 - full)].map((_, i) => (
          <span key={`empty-${i}`} className={styles["star-empty"]}>
            ☆
          </span>
        ))}
      </>
    );
  };

  if (!data) return <div>Loading...</div>;

  const address = `${data.facilityAddressLocation} ${data.facilityAddressCity} ${data.facilityDetailAddress}`;
  const photos = data.photos?.filter((url) => url) || ["/images/default.png"];

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
            <div className={styles["photo-slider"]}>
              <div className={styles["carousel-wrapper"]}>
                <div
                  className={styles["carousel-track"]}
                  style={{ transform: `translateX(${offset}px)` }}
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

            <div className={styles["tilte-box"]}>
              <div className={styles["title-header"]}>
                <div className={styles["text-group"]}>
                  <div className={styles["title-line"]}>
                    <h2 className={styles["facility-name"]}>
                      {data.facilityName}
                    </h2>
                    <span className={styles["star-display"]}>
                      {renderStars(calculateAverageStars(reviews))}
                    </span>
                    <span className={styles["average-text"]}>
                      {reviews.length > 0 &&
                        `${calculateAverageStars(reviews).toFixed(1)}점 / ${
                          reviews.length
                        }개의 후기`}
                    </span>
                  </div>
                </div>
                <HeartButton
                  facilityId={id}
                  className={styles["heart-button"]}
                />
              </div>
              <hr className={styles["divider"]} />
            </div>

            <div className={styles["info_map-box"]}>
              <div className={styles["info-box"]}>
                <div className={styles["info-text"]}>
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
                </div>
                <div className={styles["tags"]}># {data.tags.join(", #")}</div>
                <div className={styles["price-box"]}>
                  <p className={styles["price"]}>
                    {data.facilityCharge.toLocaleString()}원
                    <span className={styles["per-month"]}>/ 월</span>
                  </p>
                </div>
                <div className={styles["button-group"]}>
                  <ChatButton
                    facilityId={id}
                    receiverId={data.memberId}
                    className={styles["chat-button"]}
                  />
                  <CartButton
                    data={data}
                    productType="nursinghome"
                    className={styles["cart-button"]}
                  />
                </div>
              </div>
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
              <ul className={styles["review-list"]}>
                {isLoading ? (
                  <li>로딩 중...</li>
                ) : reviews.length > 0 ? (
                  reviews.slice(0, 2).map((review) => (
                    <li key={review.revId} className={styles["review-item"]}>
                      <Link
                        to={`/review/${review.revId}`}
                        className={styles["review-link"]}
                      >
                        <span className={styles["review-title"]}>
                          {review.revTtl}
                        </span>
                        <span className={styles["review-date"]}>
                          {review.revRegDate?.slice(0, 10)}
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>등록된 리뷰가 없습니다.</li>
                )}
              </ul>
            </div>

            <h3>상세페이지</h3>
            <div className={styles["detail-desc"]}>
              {data.facilityDetailText || "상세 설명이 없습니다."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NursingHomeDetail;
