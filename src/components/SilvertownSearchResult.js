import React, { useState, useEffect } from "react";
import styles from "../styles/components/MainList.module.css";
import { Link } from "react-router-dom";
import { fetchFilteredSilvertowns } from "../api/silvertown"; // 🔁 필터 적용 API 함수 사용
import backgroundShape from "../assets/mwhite.png";

function SilvertownSearchResult({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const result = await fetchFilteredSilvertowns(filters);
        console.log("📦 시설검색 응답 데이터:", result);
        setData(result);
      } catch (err) {
        console.error("API 오류:", err);
      }
    };

    fetchFilteredData();
  }, [filters]);

  return (
    <div className={styles["whole-list"]}>
      <div className={styles["facility-list"]}>
        <h3>실버타운 검색결과</h3>
        {/* ✅ quote 이미지: 카드들 뒷배경처럼 고정 */}
        <img
          src={backgroundShape}
          alt="quote"
          className={styles["list-quote-background"]}
        />

        {data.length === 0 ? (
          <p>조건에 맞는 결과가 없습니다.</p>
        ) : (
          <div className={styles["whole-card"]}>
            {data.map((town) => (
              <div
                key={town.facilityId}
                className={styles["facility-card-wrapper"]}
              >
                <Link
                  to={`/silvertown/${town.facilityId}`}
                  className={styles["facility-card-link"]}
                >
                  <div className={styles["facility-card"]}>
                    {town.photoUrl ? (
                      <img
                        src={`http://localhost:8080${town.photoUrl}`}
                        alt={town.facilityName}
                        className={styles["card-thumbnail"]}
                      />
                    ) : (
                      <img
                        src="/images/default.png"
                        alt="기본 이미지"
                        className={styles["card-thumbnail"]}
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
        )}
      </div>
    </div>
  );
}

export default SilvertownSearchResult;
