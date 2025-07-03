import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCaregivers } from "../api/caregiver";
import styles from "../styles/components/MainList.module.css";
import backgroundShape from "../assets/mwhite.png";
import maleImg from "../assets/male.png";
import femaleImg from "../assets/female.png";
import userImg from "../assets/user.png";

function CaregiverList() {
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    getCaregivers()
      .then((res) => {
        setCaregivers(res.data);
        console.log("🔥 요양사 리스트  받아오는 데이터 :", res.data);
      })
      .catch((err) => {
        console.error("❌ 요양사 목록 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className={styles["whole-list"]}>
      <div className={styles["facility-list"]}>
        <img
          src={backgroundShape}
          alt="quote"
          className={styles["list-quote-background"]}
        />
        <div className={styles["whole-card"]}>
          {caregivers.map((item) => (
            <div
              key={item.caregiverId}
              className={styles["facility-card-wrapper"]}
            >
              <Link
                to={`/caregiver/${item.caregiverId}`}
                className={styles["facility-card-link"]}
              >
                <div className={styles["facility-card"]}>
                  {/* 👤 성별에 따라 고정 이미지 출력 */}
                  <img
                    src={
                      item.userGender === "male"
                        ? maleImg
                        : item.userGender === "female"
                        ? femaleImg
                        : userImg
                    }
                    alt="프로필 이미지"
                    className={styles["card-thumbnail"]}
                  />

                  <h2 className={styles["caregiver-name-box"]}>
                    <span className={styles["caregiver-name"]}>
                      {item.name
                        ? item.name.length === 2
                          ? item.name[0] + "*"
                          : item.name[0] + "*" + item.name.slice(-1)
                        : "이름 미정"}
                    </span>
                    {/* <span
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
                    </span> */}
                  </h2>

                  <p>
                    {item.hopeWorkAreaLocation} {item.hopeWorkAreaCity}
                  </p>
                  <div className={styles["card-info-box"]}>
                    <p>희망근무형태: {item.hopeWorkType}</p>
                    <p>자격증: {item.certificates?.join(", ")}</p>
                    <p>경력: {item.career?.length || 0}건</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaregiverList;
