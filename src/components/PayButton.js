import React from "react";
import { createPayment, mapReservationsToPayment } from "../api/paymentApi";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { updateReservationStatus } from "../api/reservationApi";

const PayButton = ({ reservations, totalPrice, userInfo, memberId }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    const requiredFields =
      !userInfo.name || !userInfo.phone || !userInfo.consultDate;
    if (requiredFields) {
      alert("이름, 연락처, 상담 예정일은 필수 입력입니다.");
      return;
    }

    try {
      const pymId = uuidv4();
      const result = await createPayment({
        pymId,
        impUid: "imp_test_123456789",
        merchantUid: `mid_${new Date().getTime()}`,
        rsvId: reservations[0]?.rsvId,
        prodId: reservations[0]?.prodId,
        memberId: memberId,
        custNm: userInfo.name,
        custTel: userInfo.phone,
        custEmTel: userInfo.emergencyPhone,
        custDate: userInfo.consultDate,
        custMemo: userInfo.message,
        pymPrice: totalPrice,
        pymStatus: 2,
        pymMethod: "card",
        pymNum: "1234-5678-9012",
      });

      const mappingList = reservations.map((rsv) => ({
        pymId,
        rsvId: rsv.rsvId,
      }));

      await mapReservationsToPayment(mappingList);

      for (const rsv of reservations) {
        await updateReservationStatus(rsv.rsvId);
      }

      alert("결제 테스트 완료");
      console.log(result);
      navigate("/payment-result", {
        state: {
          reservations,
          pymId,
          memberId,
        },
        replace: true,
      });
    } catch (error) {
      alert("서버 저장 중 오류 발생: " + error);
    }
  };

  return <button onClick={handlePayment}>결제하기</button>;
};

export default PayButton;
