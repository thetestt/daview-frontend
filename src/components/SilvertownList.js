import React, { useState, useEffect } from "react";
import "./SilvertownList.css";
import { Link } from "react-router-dom";
import { fetchSilvertowns } from "../api/silvertown"; // ✅ API에서만 불러오기

function SilvertownList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSilvertowns()
      .then((res) => {
        console.log("백엔드 응답 결과:", res);
        setData(res);
      })
      .catch((err) => {
        console.error("API 오류:", err);
      });
  }, []);

  return (
    <div className="facility-list">
      {data
        .filter((town) => town.facilityId) // key가 될 값이 있는지 확인
        .map((town) => (
          <div key={town.facilityId} className="facility-card-wrapper">
            <Link
              to={`/silvertown/${town.facilityId}`}
              className="facility-card-link"
            >
              <div className="facility-card">
                {Array.isArray(town.photos) && town.photos.length > 0 ? (
                  <img
                    src={town.photos[0] || "/images/default.png"}
                    alt={town.facilityName}
                    className="card-thumbnail"
                  />
                ) : (
                  <div className="card-thumbnail">No Image</div>
                )}
                <h3>{town.facilityName}</h3>
                <p>
                  {town.facilityAddressLocation}{" "}
                  {town.facilityAddressCity}
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

export default SilvertownList;