import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaregiverById } from "../api/caregiver";
import styles from "../styles/pages/Detail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";
import NaverMap from "../components/common/NaverMap";
import backgroundShape from "../assets/mwhite.png";

function CaregiverDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCaregiverById(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("❌ 요양사 불러오기 실패:", err));
  }, [id]);

  if (!data) return <div>Loading...</div>;
  const genderKey = data.userGender?.toLowerCase?.();
  const address = `${data.hopeWorkAreaLocation} ${data.hopeWorkAreaCity}`;

  return (
    <>
      <FloatingNavButtons backTo="/caregiver" />
      <div className={styles["page-background"]}>
        <div className={styles["detail-wrapper"]}>
          <div className={styles["main-section"]}>
            <div className={styles["tilte-box"]}>
              <div className={styles["title-header"]}>
                <div className={styles["text-group"]}>
                  <div className={styles["title-line"]}>
                    <h2 className={styles["facility-name"]}>
                      {data.name
                        ? data.name.length === 2
                          ? data.name[0] + "*"
                          : data.name[0] + "*" + data.name.slice(-1)
                        : "이름 미정"}
                    </h2>
                    <span
                      className={`${styles["detail-gender"]} ${
                        genderKey === "male"
                          ? styles["gender-male"]
                          : genderKey === "female"
                          ? styles["gender-female"]
                          : styles["gender-unknown"]
                      }`}
                    >
                      {{
                        male: "남",
                        female: "여",
                      }[genderKey] || "미정"}
                    </span>
                  </div>
                </div>

                <HeartButton
                  facilityId={id}
                  className={styles["heart-button"]}
                />
              </div>
              <hr className={styles["divider"]} />
            </div>

            <div className={styles["info_map-box"]}>
              <div className={styles["info-box"]}>
                <div className={styles["info-detail-box"]}>
                  <img
                    src={backgroundShape}
                    alt="quote"
                    className={styles["list-quote-background"]}
                  />
                </div>
                <div className={styles["info-text"]}>
                  <p>희망 근무지: {address}</p>
                  <p>희망 근무기관: {data.hopeWorkPlace}</p>
                  <p>근무형태: {data.hopeWorkType}</p>
                  <p>고용형태: {data.hopeEmploymentType}</p>
                  <p>학력: {data.educationLevel}</p>
                  <p>보유 자격증: {data.certificates.join(", ")}</p>
                </div>
                <div className={styles["tags"]}>
                  #{data.certificates.join(", #")}
                </div>
                <div className={styles["price-box"]}>
                  <p className={styles["price"]}>
                    {data.hopeWorkAmount.toLocaleString()}원
                    <span className={styles["per-month"]}>/ 월</span>
                  </p>
                </div>
                <div className={styles["button-group"]}>
                  <ChatButton
                    facilityId={id}
                    receiverId={data.memberId}
                    className={styles["chat-button"]}
                  />
                  <CartButton
                    data={data}
                    productType="caregiver"
                    className={styles["cart-button"]}
                  />
                </div>
              </div>

              <NaverMap className={styles["map-box"]} address={address} />
            </div>
          </div>


<div className={styles["notice-review-section"]}>
          <div className={styles["career-box"]}>
            <h3>경력사항</h3>
            <ul>
              {data.career.length > 0 ? (
                data.career.map((c, i) => (
                  <li key={i}>
                    ● {c.companyName} ({c.startDate} ~ {c.endDate})
                  </li>
                ))
              ) : (
                <li>경력 없음</li>
              )}
            </ul>

            <h3>자기소개</h3>
            <div className={styles["detail-desc"]}>
              {data.introduction || "자기소개가 없습니다."}
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CaregiverDetail;
