import React from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi";
import { v4 as uuidv4 } from "uuid";

function AddToCartButton({ data, productType }) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      // 임시 사용자 ID
      const memberId = localStorage.getItem("memberId") || 1;
      const generatedUuid = uuidv4();

      const reservationData =
        productType === "caregiver"
          ? {
              rsvId: generatedUuid,
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
            }
          : {
              rsvId: generatedUuid,
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

  return <button onClick={handleAddToCart}>예약하기</button>;
}

export default AddToCartButton;
