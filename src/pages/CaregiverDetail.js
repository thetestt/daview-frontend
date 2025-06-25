import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCaregiverById } from "../api/caregiver";
import styles from "../styles/pages/Detail.module.css";
//import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";

function CaregiverDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCaregiverById(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("❌ 요양사 불러오기 실패:", err));
  }, [id]);

  // // ✅ 간이 채팅 연결용 - 추후 chatroom API 연동 예정
  // const handleChat = () => {
  //   // 예시: 현재 로그인 사용자 (실제 구현 시 context에서 가져올 예정)
  //   // const senderId = currentUser.memberId;
  //   // const receiverId = data.memberId;

  //   // 지금은 목 채팅방 ID 사용
  //   navigate("/chat/room123");
  // };

  if (!data) return <div>Loading...</div>;
  const genderKey = data.userGender?.toLowerCase?.();

  return (
    <>
      <FloatingNavButtons backTo="/caregiver" />
      <div className={styles["layout-container"]}>
        <div className={styles["detail-container"]}>
          <div className={styles["detail-header"]}>
            <div>
              <img
                src={data.photo || "/images/default.png"}
                alt="증명사진"
                className={styles["main-photo"]}
              />
            </div>
            <div className={styles["detail-info"]}>
              <h2>
                <span>{data.username || "이름 미정"}</span>
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
              </h2>
              <p>
                희망 근무지:{" "}
                {`${data.hopeWorkAreaLocation} ${data.hopeWorkAreaCity}`}
              </p>
              <p>희망 근무기관: {data.hopeWorkPlace}</p>
              <p>근무형태: {data.hopeWorkType}</p>
              <p>고용형태: {data.hopeEmploymentType}</p>
              <p>학력: {data.educationLevel}</p>
              <p>보유 자격증: {data.certificates.join(", ")}</p>
              <p className={styles["price"]}>
                {data.hopeWorkAmount.toLocaleString()}원/월
              </p>
              <div className={styles["detail-buttons"]}>
                <ChatButton facilityId={id} receiverId={data.memberId} />
                <HeartButton facilityId={id} />
                <CartButton data={data} productType="caregiver" />
              </div>
            </div>
            <div className={styles["map-box"]}>[지도 API]</div>
          </div>

          <div className={styles["career-section"]}>
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
          </div>

          <div className={styles["intro-section"]}>
            <h3>자기소개</h3>
            <p>{data.introduction}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CaregiverDetail;
