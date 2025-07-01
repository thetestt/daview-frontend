import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFilteredCaregivers } from "../api/caregiver";
import styles from "../styles/components/MainList.module.css";

function CaregiverSearchResult({ filters }) {
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFilteredCaregivers(filters);
        setCaregivers(data);
        console.log("🔥 요양사 리스트 검색결과 데이터 :", data);
      } catch (error) {
        console.error("요양사 검색 실패:", error);
      }
    };
    if (filters) {
      fetchData();
    }
  }, [filters]);

  return (
    <div className={styles["facility-list"]}>
      요양사 검색결과
      {caregivers.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        caregivers.map((item) => (
          <Link
            key={item.caregiverId}
            to={`/caregiver/${item.caregiverId}`}
            className={styles["facility-card"]}
          >
            <h2 className={styles["caregiver-name-box"]}>
              <span className={styles["caregiver-name"]}>
                {item.name
                  ? item.name.length === 2
                    ? item.name[0] + "*"
                    : item.name[0] + "*" + item.name.slice(-1)
                  : "이름 미정"}
              </span>
              <span
                className={`${styles["caregiverGender"]} ${
                  styles[
                    item.userGender === "male"
                      ? "genderMale"
                      : item.userGender === "female"
                      ? "genderFemale"
                      : "genderUnknown"
                  ]
                }`}
              >
                {item.userGender === "male"
                  ? "남"
                  : item.userGender === "female"
                  ? "여"
                  : "미정"}
              </span>
            </h2>
            <p>
              {item.hopeWorkAreaLocation} {item.hopeWorkAreaCity}
            </p>
            <p>근무형태: {item.hopeWorkType || "정보 없음"}</p>
            <p>
              자격증:{" "}
              {Array.isArray(item.certificates)
                ? item.certificates.join(", ")
                : "없음"}
            </p>
            <p>경력: {Array.isArray(item.career) ? item.career.length : 0}건</p>
          </Link>
        ))
      )}
    </div>
  );
}

export default CaregiverSearchResult;
