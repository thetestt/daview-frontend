import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPaymentById } from "../api/paymentApi";
import { getReservationByPaymentId } from "../api/reservationApi";

function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pymId, memberId } = location.state || {};
  const [paymentData, setPaymentData] = useState(null);
  const [reservations, setReservations] = useState(
    location.state?.reservations || []
  );

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const paymentResult = await getPaymentById(pymId);
        setPaymentData(paymentResult?.data || paymentResult);

        if (!location.state?.reservations) {
          const resResult = await getReservationByPaymentId(pymId);
          setReservations(resResult?.data || resResult || []);
        }
      } catch (error) {
        console.error("결제 정보 조회 실패: ", error);
      }
    };
    fetchPaymentData();
  }, [pymId, location.state?.reservations]);

  if (!pymId) return <div>주문 내역이 없습니다.</div>;
  if (!paymentData) return <div>결제 정보를 불러오는 중...</div>;

  const { merchantUid, pymMethod, pymDate, pymStatus, pymPrice } = paymentData;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        주문이 완료되었습니다
      </h2>

      <h3>주문 요약 정보</h3>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <div>주문번호: {merchantUid}</div>
        <div>결제 수단: {pymMethod === "card" ? "카드결제" : pymMethod}</div>
        <div>주문 일시: {new Date(pymDate).toLocaleString()}</div>
        <div></div>
        주문 상태:{" "}
        {pymStatus === 2 ? "결제 완료" : pymStatus === 1 ? "결제 대기" : "기타"}
        <div>총 경제 금액 : {pymPrice?.toLocaleString()} 원</div>
      </div>

      <h3 style={{ marginTop: "30px" }}>주문 상품 정보</h3>
      {reservations.length > 0 ? (
        reservations.map((reservation, index) => (
          <div
            key={reservation.rsvId || index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <div>
              <img
                src={reservation.prodPhoto || "/images/default.png"}
                alt="상품 이미지"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
            <div>상품명: {reservation.prodNm}</div>
            <div>상품상세: {reservation.prodDetail}</div>
            <div>예약 인원: {reservation.rsvCnt || 1}</div>
            <div>상품 금액: {reservation.prodPrice?.toLocaleString()} 원</div>
          </div>
        ))
      ) : (
        <div>주문 상품 정보가 없습니다.</div>
      )}
      <div>
        <button
          onClick={() => {
            const type = reservations[0]?.prodType;
            if (type === 1) navigate("/nursinghome");
            else if (type === 2) navigate("/silvertown");
            else if (type === 3) navigate("/caregiver");
            else navigate("/");
          }}
        >
          쇼핑 계속하기
        </button>
        <button
          onClick={() => {
            if (memberId) {
              navigate(`/payments/member/${memberId}`);
            } else {
              alert("회원 정보를 찾을 수 없습니다.");
            }
          }}
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  );
}

export default PaymentResult;
