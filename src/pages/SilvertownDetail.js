// 📂 src/pages/SilvertownDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import silvertowns from "../data/silvertowns";
import "./SilvertownDetail.css";
import "../styles/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function SilvertownDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const found = silvertowns.find((item) => item.facilityId === id);
    setData(found);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
     <FloatingNavButtons backTo="/silvertown" />
    <div className="layout-container">
    <div className="detail-container">
      <div className="detail-header">
        <img src={data.photos[0]} alt="메인" className="main-photo" />
        <div className="detail-info">
          <h2>{data.facilityName}</h2>
          <p className="price">{data.facilityCharge.toLocaleString()}원/월</p>
          <p>주소: {`${data.facilityAddressLocation} ${data.facilityAddressCity} ${data.facilityDetailAddress}`}</p>
          <p>주거형태: {data.facilityTheme}</p>
          <p>홈페이지: <a href={data.facilityHomepage}>{data.facilityHomepage}</a></p>
          <p>전화번호: {data.facilityPhone}</p>
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
        <strong>태그: </strong>{data.tags.join(", ")}
      </div>

      <div className="notice-section">
        <h3>공지사항</h3>
        <ul>
          {data.notices.length > 0 ? (
            data.notices.map((notice, i) => (
              <li key={i}>
                <strong>{notice.isFixed ? "[공지] " : ""}</strong>
                {notice.title} - {notice.content}
              </li>
            ))
          ) : (
            <li>공지사항이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
    </div>
    </>
  );
}

export default SilvertownDetail;