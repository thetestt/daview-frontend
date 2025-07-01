import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRefundedPaymentsByMemberId } from "../api/paymentApi";

const RefundList = () => {
  const { memberId } = useParams();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const data = await getRefundedPaymentsByMemberId(memberId);
        setRefunds(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("환불 내역 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchRefunds();
  }, [memberId]);

  if (loading) return <div style={{ textAlign: "center" }}>로딩중...</div>;
  if (!refunds.length)
    return (
      <div style={{ textAlign: "center" }}>
        환불 내역이 없습니다.
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "10px" }}>
      <h2 style={{ marginBottom: "30px" }}>{memberId} 회원님의 환불 내역</h2>
      {refunds.map((refund) => (
        <div
          key={refund.pymId}
          style={{
            border: "1px solid #000",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <div>주문번호: {refund.merchantUid}</div>
          <div>결제수단: {refund.pymMethod || "미지정"}</div>
          <div>환불 일시: {new Date(refund.refundDate).toLocaleString()}</div>
          <div>환불 금액: {refund.pymPrice?.toLocaleString()} 원</div>
          <div>환불 사유: {refund.refundReason || "없음"}</div>
        </div>
      ))}

      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </div>
  );
};

export default RefundList;
