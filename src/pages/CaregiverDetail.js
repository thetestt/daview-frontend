// 📂 src/pages/CaregiverDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import caregivers from "../data/caregivers";
import { getCaregiverById } from "../api/caregiver";
import "../styles/pages/CaregiverDetail.css";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function CaregiverDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCaregiverById(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("❌ 요양사 불러오기 실패:", err));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <FloatingNavButtons backTo="/caregiver" />
      <div className="layout-container">
        <div className="caregiver-detail-container">
          <div className="caregiver-header">
            <div className="profile-photo-box">
              <img src={data.photo} alt="증명사진" className="profile-photo" />
            </div>
            <div className="caregiver-info">
              <h2>
                <span>{data.username || "이름 미정"}</span>
                <span className={`detail-caregiver-gender ${data.userGender}`}>
                  {data.userGender === "male"
                    ? "남"
                    : data.userGender === "female"
                    ? "여"
                    : "미정"}
                </span>
              </h2>
              <p>
                희망 근무지:{" "}
                {`${data.hopeWorkAreaLocation} ${data.hopeWorkAreaCity}`}
              </p>
              <p>희망 근무기관: {data.hopeWorkPlace}</p>
              <p>근무형태: {data.hopeWorkType}</p>
              <p>고용형태: {data.hopeEmploymentType}</p>
              <p>학력: {data.educationLevel}</p>
              <p>보유 자격증: {data.certificates.join(", ")}</p>
              <p className="price">
                {data.hopeWorkAmount.toLocaleString()}원/월
              </p>
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
                    ●{c.companyName} ({c.startDate} ~ {c.endDate})
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
    </>
  );
}

export default CaregiverDetail;
