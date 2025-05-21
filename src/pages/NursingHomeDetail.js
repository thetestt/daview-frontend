import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import nursingHomes from "../data/nursingHomes";
import "../styles/pages//NursingHomeDetail.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function NursingHomeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const found = nursingHomes.find((item) => item.facility_id === id);
    setData(found);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <FloatingNavButtons backTo="/nursinghome" />
      <div className="layout-container">
        <div className="detail-container">
          <div className="detail-header">
            <img src={data.photos[0]} alt="메인" className="main-photo" />
            <div className="detail-info">
              <h2>{data.facility_name}</h2>
              <p className="price">
                {data.facility_charge.toLocaleString()}원/월
              </p>
              <p>
                주소:{" "}
                {`${data.facility_address_location} ${data.facility_address_city} ${data.facility_detail_address}`}
              </p>
              <p>테마: {data.facility_theme}</p>
              <p>
                홈페이지:{" "}
                <a href={data.facility_homepage}>{data.facility_homepage}</a>
              </p>
              <p>전화번호: {data.facility_phone}</p>
              <div className="detail-buttons">
                <button>1:1 문의</button>
                <button>상담예약</button>
                <button>장바구니</button>
                <button>찜 ♥</button>
              </div>
            </div>
            <div className="map-box">[지도 API]</div>
          </div>

          <div className="thumbnail-box">
            {data.photos.map((url, idx) => (
              <img key={idx} src={url} alt={`photo-${idx}`} />
            ))}
          </div>

          <div className="tag-section">
            <strong>태그: </strong>
            {data.tags.join(", ")}
          </div>

          <div className="tag-section">
            <strong>태그: </strong>
            {data.tags.join(", ")}
          </div>

          <div className="notice-section">
            <h3>공지사항</h3>
            <ul>
              {data.notices.filter((notice) => notice.noticeIsFixed).length >
              0 ? (
                data.notices
                  .filter((notice) => notice.noticeIsFixed)
                  .map((notice, i) => (
                    <li key={i} className="fnotice-item">
                      <Link
                        to={`/notice/${data.facilityId}/${notice.noticeId}`}
                        className="fnotice-link"
                      >
                        <span className="fnotice-title">
                          {notice.noticeIsFixed ? "[공지] " : ""}
                          {notice.noticeTitle}
                        </span>
                        <span className="fnotice-date">
                          {notice.noticeUpdatedAt?.slice(0, 10)}{" "}
                          {/* yyyy-MM-dd 형식 */}
                        </span>
                      </Link>
                    </li>
                  ))
              ) : (
                <li>고정된 공지사항이 없습니다.</li>
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

export default NursingHomeDetail;
