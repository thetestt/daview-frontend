import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import nursingHomes from "../data/nursingHomes";
import { fetchNursinghome } from "../api/nursinghome";
import "../styles/components/MainList.css";

function NursingHomeList() {
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
      {data
        .filter((town) => town.facilityId) // key가 될 값이 있는지 확인
        .map((town) => (
          <div key={town.facilityId} className="facility-card-wrapper">
            <Link
              to={`/nursinghome/${town.facilityId}`}
              className="facility-card-link"
            >
              <div className="facility-card">
                {/* ✅ photoUrl 기준으로 이미지 표시 */}
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

export default NursingHomeList;
