import React, { useEffect, useState } from "react";
import {
  getPaymentsByMemberId,
  cancelPaymentByImpUid,
} from "../api/paymentApi";
import { useParams, useNavigate } from "react-router-dom";
import RefundReasonModal from "./RefundReasonModal";

const PaymentList = () => {
  const { memberId } = useParams();
  const [payments, setPayments] = useState([]);
  const visiblePayments = payments.filter((p) => p.pymStatus !== 4);
  const refundedPayments = payments.filter((p) => p.pymStatus === 4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedImpUids, setSelectedImpUids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectReason, setSelectReason] = useState("");
  const [customReason, setCustomReason] = useState("");

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

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "30px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        <div
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate(`/payments/member/${memberId}`)}
          title="주문 내역 보기"
        >
          주문 &nbsp;|&nbsp; {visiblePayments.length}건
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/refunds/${memberId}`)}
          title="환불 내역 보기"
        >
          환불 &nbsp;|&nbsp; {refundedPayments.length}건
        </div>
      </div>

      {visiblePayments.length === 0 ? (
        <div style={{ textAlign: "center" }}>결제 내역이 없습니다.</div>
      ) : (
        <>
          <h2 style={{ marginBottom: "30px" }}>
            {memberId} 회원님의 주문 내역
          </h2>
          <h3>총 {visiblePayments.length}건의 주문 내역이 있습니다.</h3>

          {visiblePayments.map((payment) => (
            <div
              key={payment.pymId}
              style={{
                border: "1px solid #000",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ marginTop: "15px" }}>주문 정보</h4>
              <input
                type="checkbox"
                checked={selectedImpUids.includes(payment.impUid)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setSelectedImpUids((prev) =>
                    checked
                      ? [...prev, payment.impUid]
                      : prev.filter((id) => id !== payment.impUid)
                  );
                }}
              />
              <div>주문번호: {payment.merchantUid}</div>
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
              <div>
                쿠폰 할인 금액: {payment.couponDiscount?.toLocaleString()} 원
              </div>
              <div>총 결제금액: {payment.pymPrice?.toLocaleString()} 원</div>

              <h4 style={{ marginTop: "15px" }}>주문 상품 정보</h4>
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
                      src={rsv.prodPhoto || "/images/default.png"}
                      alt="상품이미지"
                      style={{ width: "200px", height: "auto" }}
                    />
                    <div>상품명: {rsv.prodNm || "정보 없음"}</div>
                    <div>상품상세: {rsv.prodDetail || "정보 없음"}</div>
                    <div>예약 인원: {rsv.rsvCnt || 1}</div>
                    <div>
                      상품금액: {rsv.prodPrice?.toLocaleString() || 0} 원
                    </div>
                    <div>
                      예약일시: {new Date(rsv.rsvDate).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div>예약 정보 없음</div>
              )}
            </div>
          ))}

          <button onClick={() => navigate("/")}>메인으로 가기</button>
          <button
            onClick={() => navigate(`/refunds/${memberId}`)}
            style={{ marginLeft: "10px" }}
          >
            환불 내역 보기
          </button>
          <button
            onClick={() => {
              if (selectedImpUids.length === 0) {
                alert("환불할 결제를 먼저 선택해주세요");
                return;
              }
              setShowModal(true);
            }}
            style={{ marginLeft: "10px" }}
            disabled={visiblePayments.length === 0}
            title={
              visiblePayments.length === 0
                ? "결제 내역이 없습니다."
                : "선택된 결제를 환불 신청합니다"
            }
          >
            환불 신청
          </button>
        </>
      )}

      {showModal && (
        <RefundReasonModal
          onClose={() => setShowModal(false)}
          onConfirm={async () => {
            const refundReason =
              selectReason === "기타" ? customReason : selectReason;

            if (!refundReason) {
              alert("환불 사유를 입력해주세요.");
              return;
            }

            const confirm = window.confirm("정말 환불을 진행하시겠습니까?");
            if (!confirm) return;

            try {
              for (const impUid of selectedImpUids) {
                await cancelPaymentByImpUid({ impUid, refundReason });
              }
              alert("선택된 결제가 환불되었습니다.");
              setSelectedImpUids([]);
              setShowModal(false);
              window.location.reload();
            } catch (err) {
              console.error("환불 실패", err);
              alert("환불 중 오류가 발생했습니다.");
              setShowModal(false);
            }
          }}
          selectReason={selectReason}
          setSelectReason={setSelectReason}
          customReason={customReason}
          setCustomReason={setCustomReason}
        />
      )}
      {showModal && (
        <RefundReasonModal
          onClose={() => setShowModal(false)}
          onConfirm={async () => {
            const refundReason =
              selectReason === "기타" ? customReason : selectReason;

            if (!refundReason) {
              alert("환불 사유를 입력해주세요.");
              return;
            }

            const confirm = window.confirm("정말 환불을 진행하시겠습니까?");
            if (!confirm) return;

            try {
              for (const impUid of selectedImpUids) {
                await cancelPaymentByImpUid({ impUid, refundReason });
              }
              alert("선택된 결제가 환불되었습니다.");
              setSelectedImpUids([]);
              setShowModal(false);
              window.location.reload();
            } catch (err) {
              console.error("환불 실패", err);
              alert("환불 중 오류가 발생했습니다.");
              setShowModal(false);
            }
          }}
          selectReason={selectReason}
          setSelectReason={setSelectReason}
          customReason={customReason}
          setCustomReason={setCustomReason}
        />
      )}
    </div>
  );
};

export default PaymentList;
