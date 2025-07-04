import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import nursingHomes from "../data/nursingHomes";
import { fetchNursinghome } from "../api/nursinghome";
import styles from "../styles/components/MainList.module.css";
import backgroundShape from "../assets/mwhite.png";

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
                  to={`/nursinghome/${town.facilityId}`}
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
      </div>
    </div>
  );
}

export default NursingHomeList;
