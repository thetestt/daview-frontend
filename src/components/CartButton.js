import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi";
import CartCountModal from "./CartCountModal";
import CartConfirmModal from "./CartConfirmModal";
import styles from "../styles/components/CartButton.module.css";

function CartButton({ data, productType }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rsvCnt, setRsvCnt] = useState(1);
  const memberId = localStorage.getItem("memberId");

  const handleReservation = () => {
    if (!memberId) {
      alert("로그인 후 예약이 가능합니다.");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddToCart = async () => {
    try {

      const reservationData =
        productType === "caregiver"
          ? {
              memberId,
              prodType: 3, // 요양사
              prodId: data.caregiverId,
              prodNm: data.introduction,
              prodDetail: [
                data.username,
                data.certificates,
                data.educationLevel,
                data.hopeEmploymentType,
                data.hopeWorkAreaLocation,
                data.hopeWorkAreaCity,
                data.hopeWorkPlace,
                data.hopeWorkType,
              ]
                .filter(Boolean)
                .join(" "),
              prodPrice: data.hopeWorkAmount,
              rsvType: 1, // 결제전
              rsvCnt,
              prodPhoto:
                Array.isArray(data.photos) && data.photos.length > 0
                  ? data.photos[0]
                  : "/images/default.png",
            }
          : {
              memberId,
              prodType: productType === "silvertown" ? 2 : 1, // 실버타운:2, 요양원:1
              prodId: data.facilityId,
              prodNm: data.facilityName,
              prodDetail: [
                data.facilityTheme,
                data.facilityPhone,
                data.facilityAddressLocation,
                data.facilityAddressCity,
                data.facilityDetailAddress,
                data.facilityHomepage,
              ]
                .filter(Boolean)
                .join(" "),
              prodPrice: data.facilityCharge,
              rsvType: 1, // 결제전
              rsvCnt,
              prodPhoto:
                Array.isArray(data.photos) && data.photos.length > 0
                  ? data.photos[0]
                  : "/images/default.png",
            };

      const res = await createReservation(reservationData);
      const created = res?.data ?? res;

      console.log("예약 성공:", created);

      navigate(`/reservation/member/${created.memberId}`);
    } catch (err) {
      console.error("예약 실패:", err);
      alert("예약에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <button onClick={handleReservation}>예약하기</button>

      {isModalOpen && (
        <CartCountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className={styles["modal-container"]}>
            <h3 className={styles["modal-title"]}>예약할 인원을 선택하세요.</h3>

            <div className={styles["modal-buttons"]}>
              <button
                className={styles["modal-button-num"]}
                onClick={() => setRsvCnt(Math.max(1, rsvCnt - 1))}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                -
              </button>
              <span className={styles["modal-quantity"]}>{rsvCnt}</span>
              <button
                className={styles["modal-button-num"]}
                onClick={() => setRsvCnt(rsvCnt + 1)}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                +
              </button>
            </div>

            <div className={styles["modal-buttons"]}>
              <button
                className={styles["modal-button-blue"]}
                onClick={() => {
                  setIsModalOpen(false);
                  setIsConfirmOpen(true);
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                확인
              </button>
              <button
                className={styles["modal-button-gray"]}
                onClick={() => {
                  alert("예약이 취소되었습니다.");
                  setIsModalOpen(false);
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                취소
              </button>
            </div>
          </div>
        </CartCountModal>
      )}

      {isConfirmOpen && (
        <CartConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleAddToCart}
        />
      )}
    </>
  );
}

export default CartButton;
