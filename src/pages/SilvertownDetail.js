// 📂 src/pages/SilvertownDetail.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//import silvertowns from "../data/silvertowns";
import "../styles/pages/SilvertownDetail.css";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import { fetchSilvertownDetail } from "../api/silvertown";
import CartButton from "../components/CartButton";

function SilvertownDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   const found = silvertowns.find((item) => item.facilityId === id);
  //   setData(found);
  // }, [id]);

  useEffect(() => {
    fetchSilvertownDetail(id)
      .then(setData)
      .catch((err) => {
        console.error("디테일 API 오류:", err);
      });
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <FloatingNavButtons />
      <div className="layout-container">
        <div className="detail-container">
          <div className="detail-header">
            <img
              src={data.photos[0] || "/images/default.png"}
              alt="메인"
              className="main-photo"
            />
            <div className="detail-info">
              <h2>{data.facilityName}</h2>
              <p className="price">
                {data.facilityCharge.toLocaleString()}원/월
              </p>
              <p>
                주소:{" "}
                {`${data.facilityAddressLocation} ${data.facilityAddressCity} ${data.facilityDetailAddress}`}
              </p>
              <p>주거형태: {data.facilityTheme}</p>
              <p>
                홈페이지:{" "}
                <a href={data.facilityHomepage}>{data.facilityHomepage}</a>
              </p>
              <p>전화번호: {data.facilityPhone}</p>
              <div className="detail-buttons">
                <button>1:1 문의</button>
                <button>찜 ♥</button>
                {/* <button>상담예약</button>
                <button>장바구니</button> */}
                <CartButton data={data} productType="silvertown" />
              </div>
            </div>
            <div className="map-box">[지도 API]</div>
          </div>

          <div className="thumbnail-box">
            {data.photos &&
            data.photos.length > 0 &&
            data.photos.some((url) => url) ? (
              data.photos
                .filter((url) => url)
                .map((url, idx) => (
                  <img key={idx} src={url} alt={`photo-${idx}`} />
                ))
            ) : (
              <img
                src="/images/default.png"
                alt="기본 이미지"
                className="card-thumbnail"
              />
            )}
          </div>

          <div className="tag-section">
            <strong>태그: </strong>
            {data.tags.join(", ")}
          </div>

          <div className="notice-section">
            <h3>공지사항</h3>
            <ul>
              {data.notices.filter((n) => n.noticeIsFixed).length > 0 ? (
                // 고정 공지 1순위
                data.notices
                  .filter((n) => n.noticeIsFixed)
                  .map((notice, i) => (
                    <li key={i} className="fnotice-item">
                      <Link
                        to={`/notice/${data.facilityId}/${notice.noticeId}`}
                        className="fnotice-link"
                      >
                        <span className="fnotice-title">
                          [공지] {notice.noticeTitle}
                        </span>
                        <span className="fnotice-date">
                          {notice.noticeUpdatedAt?.slice(0, 10)}
                        </span>
                      </Link>
                    </li>
                  ))
              ) : data.notices.length > 0 ? (
                // 고정이 없다면 최신 1개만
                <li className="fnotice-item">
                  <Link
                    to={`/notice/${data.facilityId}/${data.notices[0].noticeId}`}
                    className="fnotice-link"
                  >
                    <span className="fnotice-title">
                      {data.notices[0].noticeTitle}
                    </span>
                    <span className="fnotice-date">
                      {data.notices[0].noticeUpdatedAt?.slice(0, 10)}
                    </span>
                  </Link>
                </li>
              ) : (
                // 공지가 아예 없을 때
                <li>등록된 공지사항이 없습니다.</li>
              )}
            </ul>
            <Link
              to={`/notice/${data.facilityId}`}
              className="notice-full-link"
            >
              공지사항 전체 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SilvertownDetail;
