import React, { useState, useEffect } from "react";
import styles from "../styles/components/MainList.module.css";
import { Link } from "react-router-dom";
import { fetchSilvertowns } from "../api/silvertown"; // ✅ API에서만 불러오기
import backgroundShape from "../assets/mwhite.png"; // 포인트 PNG 배경

function SilvertownList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSilvertowns()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("API 오류:", err);
      });
  }, []);

  return (
    <div className={styles["whole-list"]}>
      <div className={styles["facility-list"]}>
        {/* ✅ quote 이미지: 카드들 뒷배경처럼 고정 */}
        <img
          src={backgroundShape}
          alt="quote"
          className={styles["list-quote-background"]}
        />
        <div className={styles["whole-card"]}>
          {data
            .filter((town) => town.facilityId)
            .map((town) => (
              <div
                key={town.facilityId}
                className={styles["facility-card-wrapper"]}
              >
                <Link
                  to={`/silvertown/${town.facilityId}`}
                  className={styles["facility-card-link"]}
                >
                  <div className={styles["facility-card"]}>
                    <img
                      src={
                        town.photoUrl
                          ? `http://localhost:8080${town.photoUrl}`
                          : "/images/default.png"
                      }
                      alt={town.facilityName}
                      className={styles["card-thumbnail"]}
                    />
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
      </div>
    </div>
  );
}

export default SilvertownList;
