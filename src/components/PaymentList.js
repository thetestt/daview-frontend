import React, { useEffect, useState } from "react";
import { getPaymentsByMemberId } from "../api/paymentApi";
import { useParams, useNavigate } from "react-router-dom";

const PaymentList = () => {
  const { memberId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const result = await getPaymentsByMemberId(memberId);
        setPayments(result ?? []);
      } catch (err) {
        console.error("결제 내역 가져오기 실패:", err);
        setError("결제 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchPayments();
    }
  }, [memberId]);

  if (loading) return <div style={{ textAlign: "center" }}>로딩중...</div>;
  if (error) return <div style={{ textAlign: "center" }}>{error}</div>;
  if (!payments.length)
    return <div style={{ textAlign: "center" }}>결제 내역이 없습니다.</div>;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "10px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>{memberId} 회원님의 주문 내역</h2>
      <h3>총 {payments.length}건의 주문 내역이 있습니다.</h3>
      {payments.map((payment) => (
        <div
          key={payment.pymId}
          style={{
            border: "1px solid #000",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              marginTop: "15px",
            }}
          >
            주문 정보
          </h4>
          <div>주문번호: {payment.pymId}</div>
          <div>결제수단: {payment.pymMethod || "미지정"}</div>
          <div>주문일시: {new Date(payment.pymDate).toLocaleString()}</div>
          <div>
            결제상태:{" "}
            {payment.pymStatus === 2
              ? "결제완료"
              : payment.pymStatus === 1
              ? "결제대기"
              : "기타"}
          </div>
          <div>총 결제금액: {payment.pymPrice?.toLocaleString()} 원</div>
          <h4
            style={{
              marginTop: "15px",
            }}
          >
            주문 상품 정보
          </h4>
          {payment.reservations?.length > 0 ? (
            payment.reservations.map((rsv, idx) => (
              <div
                key={rsv.rsvId}
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                }}
              >
                <div>[{idx + 1}번 예약]</div>
                <img
                  src={rsv.prodPhoto || "/images.default.png"}
                  alt="상품이미지"
                  style={{ width: "200px", height: "auto" }}
                />
                <div>상품명: {rsv.prodNm || "정보 없음"}</div>
                <div>상품상세: {rsv.prodDetail || "정보 없음"}</div>
                <div>예약 인원: {rsv.prodCnt || 1}</div>
                <div>상품금액: {rsv.prodPrice?.toLocaleString() || 0} 원</div>
                <div>예약일시: {new Date(rsv.rsvDate).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div>예약 정보 없음</div>
          )}
        </div>
      ))}
      <button onClick={() => navigate("/")}>메인으로 가기</button>
    </div>
  );
};

export default PaymentList;
