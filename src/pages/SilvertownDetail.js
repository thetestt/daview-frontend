import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/pages/Detail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import { fetchSilvertownDetail } from "../api/silvertown";
import { getReviewsByProdNm } from "../api/reviewApi";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";
import NaverMap from "../components/common/NaverMap";
import backgroundShape from "../assets/mwhite.png";

function SilvertownDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSilvertownDetail(id)
      .then(setData)
      .catch((err) => console.error("API 오류:", err));
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!data || !data.facilityName) return;
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
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.revStars, 0);
    return total / reviews.length;
  };

  const renderStars = (average) => {
    const rounded = Math.round(average);
    const fullStars = Math.min(rounded, 5);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={styles["star"]}>
            ★
          </span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={styles["star-empty"]}>
            ☆
          </span>
        ))}
      </>
    );
  };

  if (!data) return <div>Loading...</div>;

  const photos = data.photos?.filter((url) => url) || ["/images/default.png"];
  const address = `${data.facilityAddressLocation} ${data.facilityAddressCity} ${data.facilityDetailAddress}`;

  // 사진 슬라이드 핸들러
  const handlePhotoPrev = () => {
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handlePhotoNext = () => {
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const imageWidth = 700;
  const imageMargin = -10;
  const totalImageWidth = imageWidth + imageMargin * 2;
  const wrapperWidth = 1000;
  const photoOffset =
    wrapperWidth / 2 - totalImageWidth / 2 - photoIndex * totalImageWidth;

  // 리뷰 슬라이드 핸들러
  const handleReviewPrev = () => {
    setReviewIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReviewNext = () => {
    setReviewIndex((prev) =>
      Math.min(prev + 1, Math.max(0, reviews.length - 2))
    );
  };

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
                    transform: `translateX(${photoOffset}px)`,
                  }}
                >
                  {photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`slide-${i}`}
                      className={`${styles["carousel-image"]} ${
                        i === photoIndex ? styles["active"] : ""
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handlePhotoPrev}
                  className={styles["arrow-left"]}
                >
                  ❮
                </button>
                <button
                  onClick={handlePhotoNext}
                  className={styles["arrow-right"]}
                >
                  ❯
                </button>
              </div>
            </div>

            {/* 제목 */}
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

            {/* 정보 + 지도 */}
            <div className={styles["info_map-box"]}>
              <div className={styles["info-box"]}>
                <div className={styles["info-detail-box"]}>
                  <img
                    src={backgroundShape}
                    alt="quote"
                    className={styles["list-quote-background"]}
                  />
                </div>
                <div className={styles["info-text"]}>
                  <p>
                    <img
                      src="/images/icon/pin.png"
                      alt="주소"
                      style={{ width: "20px", marginRight: "-10px" }}
                    />
                    주소: {address}
                  </p>
                  <p>
                    <img
                      src="/images/icon/layout.png"
                      alt="테마"
                      style={{ width: "20px", marginRight: "-3px" }}
                    />
                    테마: {data.facilityTheme}
                  </p>
                  <p>
                    <img
                      src="/images/icon/website.png"
                      alt="홈페이지"
                      style={{ width: "20px", marginRight: "-3px" }}
                    />
                    홈페이지:{" "}
                    <a
                      href={data.facilityHomepage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.facilityHomepage}
                    </a>
                  </p>
                  <p>
                    <img
                      src="/images/icon/telephone.png"
                      alt="전화번호"
                      style={{ width: "20px", marginRight: "-3px" }}
                    />
                    전화번호: {data.facilityPhone}
                  </p>
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
                    productType="silvertown"
                    className={styles["cart-button"]}
                  />
                </div>
              </div>
              <NaverMap className={styles["map-box"]} address={address} />
            </div>
          </div>

          {/* 공지 + 리뷰 + 상세페이지 */}
          <div className={styles["notice-review-section"]}>
            <div className={styles["notice-box"]}>
              <div className={styles["notice-header"]}>
                <h3 className={styles["notice-title"]}>공지사항</h3>
                <Link
                  to={`/notice/${data.facilityId}`}
                  className={styles["view-all"]}
                >
                  공지사항 전체보기 &gt;
                </Link>
              </div>
              <div className={styles["notice-content"]}>
                {data.notices.length > 0 ? (
                  <Link
                    to={`/notice/${data.facilityId}/${data.notices[0].noticeId}`}
                    className={styles["notice-item"]}
                  >
                    <strong className={styles["notice-label"]}>
                      [{data.notices[0].noticeIsFixed ? "공지" : "일반"}]
                    </strong>{" "}
                    {data.notices[0].noticeTitle}
                  </Link>
                ) : (
                  <span className={styles["notice-none"]}>공지사항 없음</span>
                )}
              </div>
            </div>

            {/* 리뷰 */}
            <h3>리뷰</h3>
            <div className={styles["review-slider-container"]}>
              <button
                className={styles["arrow-button"]}
                onClick={handleReviewPrev}
              >
                &#10094;
              </button>
              <div className={styles["review-slider-wrapper"]}>
                <div
                  className={styles["review-slider-track"]}
                  style={{ transform: `translateX(-${reviewIndex * 420}px)` }}
                >
                  {reviews.map((review, index) => {
                    const isVisible =
                      index === reviewIndex || index === reviewIndex + 1;
                    return (
                      <div
                        key={review.revId}
                        className={`${styles["review-item"]} ${
                          isVisible ? styles["active"] : styles["inactive"]
                        }`}
                      >
                        <Link
                          to={`/review/${review.revId}`}
                          className={styles["review-link"]}
                        >
                          <div className={styles["review-title-line"]}>
                            <span className={styles["review-title"]}>
                              {review.revTtl}
                            </span>
                            <span className={styles["review-stars"]}>
                              {renderStars(review.revStars)}
                            </span>
                          </div>
                          <div className={styles["review-content"]}>
                            {review.revCont?.slice(0, 60)}...
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                className={styles["arrow-button"]}
                onClick={handleReviewNext}
              >
                &#10095;
              </button>
            </div>

            <h3>상세페이지</h3>
            <div className={styles["detail-desc"]}>
              <img src="/images/silvertonwD.jpeg" alt="실버타운 메인" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SilvertownDetail;
