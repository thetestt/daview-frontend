import React from "react";
import { createPayment, mapReservationsToPayment } from "../api/paymentApi";
import { useNavigate } from "react-router-dom";
import { updateReservationStatus } from "../api/reservationApi";

const PayButton = ({
  reservations,
  totalPrice,
  userInfo,
  memberId,
  isAgreed,
}) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    const requiredFields =
      !userInfo.name || !userInfo.phone || !userInfo.consultDate;
    if (requiredFields) {
      alert("이름, 연락처, 상담 예정일은 필수 입력입니다.");
      return;
    }
    if (!isAgreed) {
      alert("유의사항에 동의하셔야 결제할 수 있습니다.");
      return;
    }

    try {
      const result = await createPayment({
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

      const updated = result?.data ?? result;
      const pymId = updated.pymId;

      const mappingList = reservations.map((rsv) => ({
        pymId,
        rsvId: rsv.rsvId,
      }));

      await mapReservationsToPayment(mappingList);

      const rsvIds = reservations.map(rsv => rsv.rsvId);
      await updateReservationStatus(rsvIds);

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
