// src/components/NursingHomeSearchResult.js
import React, { useState, useEffect } from "react";
import "../styles/components/MainList.css";
import { Link } from "react-router-dom";
import { fetchNursinghome } from "../api/nursinghome";

function NursingHomeSearchResult() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchNursinghome()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("API 오류:", err);
      });
  }, []);

  return (
    <div className="facility-list">
      요양원 검색결과
      {data
        .filter((home) => home.facilityId)
        .map((home) => (
          <div key={home.facilityId} className="facility-card-wrapper">
            <Link
              to={`/nursinghome/${home.facilityId}`}
              className="facility-card-link"
            >
              <div className="facility-card">
                {home.photoUrl ? (
                  <img
                    src={`http://localhost:8080${home.photoUrl}`}
                    alt={home.facilityName}
                    className="card-thumbnail"
                  />
                ) : (
                  <img
                    src="/images/default.png"
                    alt="기본 이미지"
                    className="card-thumbnail"
                  />
                )}
                <h3>{home.facilityName}</h3>
                <p>
                  {home.facilityAddressLocation} {home.facilityAddressCity}
                </p>
                <p>
                  {home.facilityCharge
                    ? `${home.facilityCharge.toLocaleString()}원/월`
                    : "가격 정보 없음"}
                </p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default NursingHomeSearchResult;
