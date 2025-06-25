import React, { useState, useEffect } from "react";
import styles from "../styles/components/MainList.module.css";
import { Link } from "react-router-dom";
import { fetchFilteredNursinghomes } from "../api/nursinghome"; // 🔁 필터 적용 API 함수 사용

function NursingHomeSearchResult({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const result = await fetchFilteredNursinghomes(filters);
        setData(result);
      } catch (err) {
        console.error("요양원 검색 오류:", err);
      }
    };

    fetchFilteredData();
  }, [filters]);

  return (
    <div className={styles["facility-list"]}>
      <h3>요양원 검색결과</h3>
      {data.length === 0 ? (
        <p>조건에 맞는 결과가 없습니다.</p>
      ) : (
        data.map((home) => (
          <div
            key={home.facilityId}
            className={styles["facility-card-wrapper"]}
          >
            <Link
              to={`/nursinghome/${home.facilityId}`}
              className={styles["facility-card-link"]}
            >
              <div className={styles["facility-card"]}>
                {home.photoUrl ? (
                  <img
                    src={`http://localhost:8080${home.photoUrl}`}
                    alt={home.facilityName}
                    className={styles["card-thumbnail"]}
                  />
                ) : (
                  <img
                    src="/images/default.png"
                    alt="기본 이미지"
                    className={styles["card-thumbnail"]}
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
        ))
      )}
    </div>
  );
}

export default NursingHomeSearchResult;
