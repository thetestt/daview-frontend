import React, { useEffect, useState } from "react";
import {
  getPaymentsByMemberId,
  cancelPaymentByImpUid,
} from "../api/paymentApi";
import { useParams, useNavigate } from "react-router-dom";
import RefundReasonModal from "./RefundReasonModal";
import styles from "../styles/components/PaymentList.module.css";

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

  const [expandedPayments, setExpandedPayments] = useState({});

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

  const toggleExpand = (pymId) => {
    setExpandedPayments((prev) => ({
      ...prev,
      [pymId]: !prev[pymId],
    }));
  };

  if (loading)
    return <div className={styles["pay-center-text"]}>로딩중...</div>;
  if (error) return <div className={styles["pay-center-text"]}>{error}</div>;

  return (
    <div className={styles["pay-total-container"]}>
      <div className={styles["pay-container"]}>
        <div className={styles["pay-tab-menu"]}>
          <div
            className={`${styles["pay-tab-box"]} ${styles["pay-active"]}`}
            onClick={() => navigate(`/payments/member/${memberId}`)}
            title="주문 내역 보기"
          >
            <div className={styles["pay-tab-count"]}>
              {visiblePayments.length}건
            </div>
            <div className={styles["pay-tab-label"]}>주문 내역</div>
          </div>
          <div
            className={styles["pay-tab-box"]}
            onClick={() => navigate(`/refunds/${memberId}`)}
            title="환불 내역 보기"
          >
            <div className={styles["pay-tab-count"]}>
              {refundedPayments.length}건
            </div>
            <div className={styles["pay-tab-label"]}>환불 내역</div>
          </div>
        </div>

        {visiblePayments.length === 0 ? (
          <div className={styles["pay-center-text"]}>결제 내역이 없습니다.</div>
        ) : (
          <>
            <h2 className={styles["pay-page-title"]}>
              {memberId} 회원님의 주문 내역
            </h2>
            <h3 className={styles["pay-sub-title"]}>
              총 {visiblePayments.length}건의 주문 내역이 있습니다
            </h3>

            {visiblePayments.map((payment) => {
              const isExpanded = expandedPayments[payment.pymId] || false;
              return (
                <div key={payment.pymId} className={styles["pay-payment-box"]}>
                  <label className={styles["pay-checkbox-label"]}>
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
                  </label>
                  <h4 className={styles["pay-section-title"]}>주문 정보</h4>
                  <div className={styles["pay-info-card"]}>
                    <div className={styles["pay-info-grid"]}>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>주문 번호</span>
                        <span className={styles["pay-value"]}>
                          {payment.merchantUid}
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>상품 금액</span>
                        <span className={styles["pay-value"]}>
                          {(
                            payment.pymPrice + (payment.couponDiscount || 0)
                          ).toLocaleString()}{" "}
                          원
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>주문 일시</span>
                        <span className={styles["pay-value"]}>
                          {new Date(payment.pymDate).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>쿠폰 할인</span>
                        <span className={styles["pay-value"]}>
                          {payment.couponDiscount?.toLocaleString()} 원
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>결제 수단</span>
                        <span className={styles["pay-value"]}>
                          {payment.pymMethod || "미지정"}
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>
                          총 결제 금액
                        </span>
                        <span className={styles["pay-value"]}>
                          {payment.pymPrice?.toLocaleString() || 0} 원
                        </span>
                      </div>
                      <div className={styles["pay-info-row"]}>
                        <span className={styles["pay-label"]}>결제 상태</span>
                        <span
                          className={`${styles["pay-value"]} ${
                            payment.pymStatus === 2
                              ? styles["pay-status-paid"]
                              : payment.pymStatus === 1
                              ? styles["pay-status-pending"]
                              : styles["pay-status-other"]
                          }`}
                        >
                          {payment.pymStatus === 2
                            ? "결제완료"
                            : payment.pymStatus === 1
                            ? "결제대기"
                            : "기타"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4
                    className={styles["pay-section-title"]}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => toggleExpand(payment.pymId)}
                    title={isExpanded ? "결제 상품 숨기기" : "결제 상품 보기"}
                  >
                    주문 상품 정보({payment.reservations?.length || 0}건)
                    <div className={styles["pay-toggle-label"]}>
                      {isExpanded ? "결제 상품 숨기기" : "결제 상품 보기"}
                    </div>
                  </h4>

                  {isExpanded &&
                    (payment.reservations?.length > 0 ? (
                      payment.reservations.map((rsv, idx) => (
                        <div
                          key={rsv.rsvId}
                          className={styles["pay-reservation-box"]}
                        >
                          <img
                            src={rsv.prodPhoto || "/images/default.png"}
                            alt="상품이미지"
                            className={styles["pay-product-img"]}
                          />
                          <div className={styles["pay-product-info"]}>
                            <div className={styles["pay-reservation-header"]}>
                              [{idx + 1}번 예약]
                            </div>

                            <div className={styles["pay-info-row"]}>
                              <span className={styles["pay-label"]}>
                                상품명
                              </span>
                              <span className={styles["pay-value"]}>
                                {rsv.prodNm || "정보 없음"}
                              </span>
                            </div>

                            <div className={styles["pay-info-row"]}>
                              <span className={styles["pay-label"]}>
                                상품 상세
                              </span>
                              <span className={styles["pay-value"]}>
                                {rsv.prodDetail || "정보 없음"}
                              </span>
                            </div>

                            <div className={styles["pay-info-row"]}>
                              <span className={styles["pay-label"]}>
                                예약 인원
                              </span>
                              <span className={styles["pay-value"]}>
                                {rsv.rsvCnt || 1}
                              </span>
                            </div>

                            <div className={styles["pay-info-row"]}>
                              <span className={styles["pay-label"]}>
                                상품 금액
                              </span>
                              <span className={styles["pay-value"]}>
                                {rsv.prodPrice?.toLocaleString() || 0} 원
                              </span>
                            </div>

                            <div className={styles["pay-info-row"]}>
                              <span className={styles["pay-label"]}>
                                예약 일시
                              </span>
                              <span className={styles["pay-value"]}>
                                {new Date(rsv.rsvDate).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>예약 정보 없음</div>
                    ))}
                </div>
              );
            })}

            <div className={styles["pay-btn-group"]}>
              <button
                className={styles["pay-btn"]}
                onClick={() => navigate("/")}
              >
                메인으로 가기
              </button>
              <button
                className={`${styles["pay-btn"]} ${styles["pay-btn-secondary"]}`}
                onClick={() => navigate(`/refunds/${memberId}`)}
              >
                환불 내역 보기
              </button>
              <button
                className={`${styles["pay-btn"]} ${styles["pay-btn-primary"]}`}
                onClick={() => {
                  if (selectedImpUids.length === 0) {
                    alert("환불할 결제를 먼저 선택해주세요");
                    return;
                  }
                  setShowModal(true);
                }}
                disabled={visiblePayments.length === 0}
                title={
                  visiblePayments.length === 0
                    ? "결제 내역이 없습니다."
                    : "선택된 결제를 환불 신청합니다"
                }
              >
                환불 신청
              </button>
            </div>
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
      </div>
    </div>
  );
};

export default PaymentList;
