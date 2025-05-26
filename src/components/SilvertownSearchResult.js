// src/components/SilvertownSearchResult.js
import React, { useState, useEffect } from "react";
import "../styles/components/MainList.css";
import { Link } from "react-router-dom";
import { fetchSilvertowns } from "../api/silvertown"; // 이후 필터값이 있으면 여기에 추가

function SilvertownSearchResult() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 추후 검색 조건 전달 가능
    fetchSilvertowns()
      .then((res) => {
        setData(res); // 실제로는 필터 조건 적용된 결과만 오게 하면 좋아요
      })
      .catch((err) => {
        console.error("API 오류:", err);
      });
  }, []);

  return (
    <div className="facility-list">
      실버타운 검색결과
      {data
        .filter((town) => town.facilityId)
        .map((town) => (
          <div key={town.facilityId} className="facility-card-wrapper">
            <Link
              to={`/silvertown/${town.facilityId}`}
              className="facility-card-link"
            >
              <div className="facility-card">
                {town.photoUrl ? (
                  <img
                    src={`http://localhost:8080${town.photoUrl}`}
                    alt={town.facilityName}
                    className="card-thumbnail"
                  />
                ) : (
                  <img
                    src="/images/default.png"
                    alt="기본 이미지"
                    className="card-thumbnail"
                  />
                )}
                <h3>{town.facilityName}</h3>
                <p>
                  {town.facilityAddressLocation} {town.facilityAddressCity}
                </p>
                <p>
                  {town.facilityCharge
                    ? `${town.facilityCharge.toLocaleString()}원/월`
                    : "가격 정보 없음"}
                </p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default SilvertownSearchResult;
