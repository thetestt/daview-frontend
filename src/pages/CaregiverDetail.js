// 📂 src/pages/CaregiverDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import caregivers from "../data/caregivers";
import "./CaregiverDetail.css";
import "../styles/layout.css";

function CaregiverDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const found = caregivers.find((item) => item.caregiver_id === id);
    setData(found);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="layout-container">
    <div className="caregiver-detail-container">
      <div className="caregiver-header">
        <div className="profile-photo-box">
          <img src={data.photo} alt="증명사진" className="profile-photo" />
        </div>
        <div className="caregiver-info">
          <h2>{data.name || "이름 미정"}</h2>
          <p>희망 근무지: {`${data.hope_work_area_location} ${data.hope_work_area_city}`}</p>
          <p>희망 근무기관: {data.hope_work_place}</p>
          <p>근무형태: {data.hope_work_type}</p>
          <p>고용형태: {data.hope_employment_type}</p>
          <p>학력: {data.education_level}</p>
          <p>보유 자격증: {data.certificates.join(", ")}</p>
          <p className="price">{data.hope_work_amount.toLocaleString()}원/월</p>
          <div className="detail-buttons">
            <button>1:1 문의</button>
            <button>장바구니</button>
            <button>찜 ♥</button>
          </div>
        </div>
        <div className="map-box">[지도 API]</div>
      </div>

      <div className="career-section">
        <h3>경력사항</h3>
        <ul>
          {data.career.length > 0 ? (
            data.career.map((c, i) => (
              <li key={i}>
                {c.company_name} ({c.start_date} ~ {c.end_date})
              </li>
            ))
          ) : (
            <li>경력 없음</li>
          )}
        </ul>
      </div>

      <div className="intro-section">
        <h3>자기소개</h3>
        <p>{data.introduction}</p>
      </div>
    </div>
    </div>
  );
}

export default CaregiverDetail;
