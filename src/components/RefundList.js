import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRefundedPaymentsByMemberId,
  getPaymentsByMemberId,
} from "../api/paymentApi";
import styles from "../styles/components/RefundList.module.css";

const RefundList = () => {
  const { memberId } = useParams();
  const [refunds, setRefunds] = useState([]);
  const [payments, setPayments] = useState([]);
  const visiblePayments = payments.filter((p) => p.pymStatus !== 4);
  const refundedPayments = payments.filter((p) => p.pymStatus === 4);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [expandedRefunds, setExpandedRefunds] = useState({});

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const data = await getRefundedPaymentsByMemberId(memberId);
        setRefunds(Array.isArray(data) ? data : []);

        const result = await getPaymentsByMemberId(memberId);
        setPayments(result ?? []);
      } catch (err) {
        console.error("환불 내역 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchRefunds();
  }, [memberId]);

  const toggleExpand = (pymId) => {
    setExpandedRefunds((prev) => ({
      ...prev,
      [pymId]: !prev[pymId],
    }));
  };

  if (loading)
    return <div className={styles["refund-center-text"]}>로딩중...</div>;
  if (!refunds.length)
    return (
      <div className={styles["refund-center-text"]}>
        환불 내역이 없습니다.
        <br />
        <button
          className={styles["refund-btn"]}
          onClick={() => navigate(-1)}
          style={{ marginTop: "15px" }}
        >
          뒤로 가기
        </button>
      </div>
    );

  return (
    <div className={styles["refund-total-container"]}>
      <div className={styles["refund-container"]}>
        <div className={styles["refund-tab-menu"]}>
          <div
            className={styles["refund-tab-box"]}
            onClick={() => navigate(`/payments/member/${memberId}`)}
            title="주문 내역 보기"
          >
            <div className={styles["refund-tab-count"]}>
              {visiblePayments.length}건
            </div>
            <div className={styles["refund-tab-label"]}>주문 내역</div>
          </div>
          <div
            className={`${styles["refund-tab-box"]} ${styles["refund-active"]}`}
            onClick={() => navigate(`/refunds/${memberId}`)}
            title="환불 내역 보기"
          >
            <div className={styles["refund-tab-count"]}>
              {refundedPayments.length}건
            </div>
            <div className={styles["refund-tab-label"]}>환불 내역</div>
          </div>
        </div>
        <h2 className={styles["refund-page-title"]}>
          {memberId} 회원님의 환불 내역
        </h2>

        {refunds.map((refund) => {
          const isExpanded = expandedRefunds[refund.pymId] || false;
          return (
            <div key={refund.pymId} className={styles["refund-payment-box"]}>
              <h4 className={styles["refund-section-title"]}>환불 정보</h4>
              <div className={styles["refund-info-card"]}>
                <div className={styles["refund-info-grid"]}>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>주문 번호</span>
                    <span className={styles["refund-value"]}>
                      {refund.merchantUid}
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>상품 금액</span>
                    <span className={styles["refund-value"]}>
                      {(
                        refund.pymPrice + (refund.couponDiscount || 0)
                      ).toLocaleString()}{" "}
                      원
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>환불 일시</span>
                    <span className={styles["refund-value"]}>
                      {new Date(refund.refundDate).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>쿠폰 할인</span>
                    <span className={styles["refund-value"]}>
                      {refund.couponDiscount?.toLocaleString() || 0} 원
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>결제 수단</span>
                    <span className={styles["refund-value"]}>
                      {refund.pymMethod || "미지정"}
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>환불 금액</span>
                    <span className={styles["refund-value"]}>
                      {refund.pymPrice?.toLocaleString() || 0} 원
                    </span>
                  </div>
                  <div className={styles["refund-info-row"]}>
                    <span className={styles["refund-label"]}>환불 사유</span>
                    <span className={styles["refund-value"]}>
                      {refund.refundReason || "없음"}
                    </span>
                  </div>
                </div>
              </div>

              <h4
                className={styles["refund-section-title"]}
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => toggleExpand(refund.pymId)}
                title={isExpanded ? "환불 상품 숨기기" : "환불 상품 보기"}
              >
                환불 상품 정보({refund.reservations?.length || 0}건)
                <div className={styles["refund-toggle-label"]}>
                  {isExpanded ? "환불 상품 숨기기" : "환불 상품 보기"}
                </div>
              </h4>

              {isExpanded &&
                (refund.reservations?.length > 0 ? (
                  refund.reservations.map((rsv, idx) => (
                    <div
                      key={rsv.rsvId}
                      className={styles["refund-reservation-box"]}
                    >
                      <img
                        src={rsv.prodPhoto || "/images/default.png"}
                        alt="상품이미지"
                        className={styles["refund-product-img"]}
                      />
                      <div className={styles["refund-product-info"]}>
                        <div className={styles["refund-reservation-header"]}>
                          [{idx + 1}번 예약]
                        </div>
                        <div className={styles["refund-info-row"]}>
                          <span className={styles["refund-label"]}>상품명</span>
                          <span className={styles["refund-value"]}>
                            {rsv.prodNm || "정보 없음"}
                          </span>
                        </div>
                        <div className={styles["refund-info-row"]}>
                          <span className={styles["refund-label"]}>
                            상품 상세
                          </span>
                          <span className={styles["refund-value"]}>
                            {rsv.prodDetail || "정보 없음"}
                          </span>
                        </div>
                        <div className={styles["refund-info-row"]}>
                          <span className={styles["refund-label"]}>
                            예약 인원
                          </span>
                          <span className={styles["refund-value"]}>
                            {rsv.rsvCnt || 1}
                          </span>
                        </div>
                        <div className={styles["refund-info-row"]}>
                          <span className={styles["refund-label"]}>
                            상품 금액
                          </span>
                          <span className={styles["refund-value"]}>
                            {rsv.prodPrice?.toLocaleString() || 0} 원
                          </span>
                        </div>
                        <div className={styles["refund-info-row"]}>
                          <span className={styles["refund-label"]}>
                            예약 일시
                          </span>
                          <span className={styles["refund-value"]}>
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

        <div className={styles["refund-btn-group"]}>
          <button className={styles["refund-btn"]} onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundList;
