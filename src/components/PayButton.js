import React from "react";
import {
  createPayment,
  mapReservationsToPayment,
  applyCoupon,
} from "../api/paymentApi";
import { useNavigate } from "react-router-dom";
import { updateReservationStatus } from "../api/reservationApi";

const PayButton = ({
  reservations,
  totalPrice,
  userInfo,
  memberId,
  isAgreed,
  selectedCouponId,
}) => {
  const navigate = useNavigate();

  const merchant_uid = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomPart = Math.floor(100000 + Math.random() * 900000);

    return `ORD-${year}${month}${day}-${randomPart}`;
  };

  const generatedMerchantUid = merchant_uid();

  const handlePayment = async () => {
    const requiredFields =
      !userInfo.name || !userInfo.phone || !userInfo.consultDate;

    if (requiredFields) {
      alert("이름, 연락처, 상담 예정일은 필수 입력입니다.");
      return;
    }

    if (!isAgreed) {
      alert("유의사항 동의 후에 결제가 가능합니다.");
      return;
    }

    const { IMP } = window;
    IMP.init("test");

    IMP.request_pay(
      {
        channelKey: "test",
        pay_method: "card",
        merchant_uid: generatedMerchantUid,
        name: reservations.map((r) => r.prodNm).join(", "),
        amount: totalPrice,
        buyer_name: userInfo.name,
        buyer_tel: userInfo.phone,
      },
      async function (rsp) {
        if (rsp.success) {
          try {
            const result = await createPayment({
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              rsvId: reservations[0]?.rsvId,
              prodId: reservations[0]?.prodId,
              memberId: memberId,
              custNm: rsp.buyer_name,
              custTel: rsp.buyer_tel,
              custEmTel: userInfo.emergencyPhone,
              custDate: userInfo.consultDate,
              custMemo: userInfo.message,
              pymPrice: rsp.paid_amount,
              pymStatus: 2,
              pymMethod: rsp.pay_method,
              pymNum: rsp.apply_num,
            });

            const updated = result?.data ?? result;
            const pymId = updated.pymId;

            const mappingList = reservations.map((rsv) => ({
              pymId,
              rsvId: rsv.rsvId,
            }));
            await mapReservationsToPayment(mappingList);

            const rsvIds = reservations.map((rsv) => rsv.rsvId);
            await updateReservationStatus(rsvIds);

            if (selectedCouponId) {
              await applyCoupon(selectedCouponId);
            }

            alert("결제 완료!");
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
        } else {
          alert("결제에 실패했습니다: " + rsp.error_msg);
        }
      }
    );
  };

  return <button onClick={handlePayment}>결제하기</button>;
};

export default PayButton;
