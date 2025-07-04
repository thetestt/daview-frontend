import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPaymentById } from "../api/paymentApi";
import { getReservationByPaymentId } from "../api/reservationApi";
import styles from "../styles/components/PaymentResult.module.css";

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

  const {
    merchantUid,
    pymMethod,
    pymDate,
    pymStatus,
    pymPrice,
    couponDiscount,
  } = paymentData;

  return (
    <div className={styles["pay-container"]}>
      <div className={styles["pay-notice-box"]}>
        <div className={styles["pay-complete-notice"]}>
          주문이 완료되었습니다
        </div>
        <div className={styles["pay-detail-notice"]}>
          주문해주셔서 감사합니다.
          <br />
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </div>
      </div>
      <div className={styles["pay-call-notice"]}>
        *** 결제 완료 후, 영업일 기준 1~3일 이내 담당자 배정 후 [전화 안내]
        드립니다. ***
      </div>
      <div className={styles["pay-complete-box"]}>
        <div className={styles["pay-complete-title"]}>주문 요약 정보</div>
        <div className={styles["pay-payinfo"]}>
          <div className={styles["pay-order-box"]}>
            <div className={styles["pay-order-row"]}>
              <span className={styles["pay-label"]}>주문 번호</span>
              <span className={styles["pay-value"]}>{merchantUid}</span>
              <span className={styles["pay-label2"]}>결제 수단</span>
              <span className={styles["pay-value2"]}>
                {pymMethod === "card" ? "카드결제" : pymMethod}
              </span>
            </div>
            <div className={styles["pay-order-row"]}>
              <span className={styles["pay-label"]}>주문 일시</span>
              <span className={styles["pay-value"]}>
                {new Date(pymDate).toLocaleString()}
              </span>
              <span className={styles["pay-label2"]}>상품 금액</span>
              <span className={styles["pay-value2"]}>
                {(pymPrice + (couponDiscount || 0)).toLocaleString()}원
              </span>
            </div>
            <div className={styles["pay-order-row"]}>
              <span className={styles["pay-label"]}>주문 상태</span>
              <span
                className={`${styles["pay-value"]} ${styles["pay-status"]}`}
              >
                {pymStatus === 2
                  ? "결제 완료"
                  : pymStatus === 1
                  ? "결제 대기"
                  : "기타"}
              </span>
              <span className={styles["pay-label2"]}>총 결제 금액</span>
              <span
                className={`${styles["pay-value2"]} ${styles["pay-total"]}`}
              >
                {pymPrice.toLocaleString()}원
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className={styles["pay-order-row"]}>
                <span className={styles["pay-label"]}>쿠폰 할인</span>
                <span className={styles["pay-value"]}>
                  -{couponDiscount.toLocaleString()}원
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles["pay-product-title"]}>주문 상품 정보</div>
        <div className={styles["pay-product-box"]}>
          <table className={styles["pay-reservation-table"]}>
            <thead>
              <tr>
                <th className={styles["pay-img-row"]}>상품 이미지</th>
                <th className={styles["pay-info-row"]}>상품 정보</th>
                <th className={styles["pay-count-row"]}>수량</th>
                <th className={styles["pay-price-row"]}>상품 금액</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr
                  className={styles["pay-reservation-row"]}
                  key={reservation.rsvId || index}
                >
                  <td className={styles["pay-img-row"]}>
                    <img
                      src={reservation.prodPhoto || "/images/default.png"}
                      alt="상품 이미지"
                      className={styles["pay-product-img"]}
                    />
                  </td>
                  <td className={styles["pay-info-row"]}>
                    <div className={styles["pay-name-title"]}>
                      {reservation.prodNm}
                    </div>
                    <ul>
                      {(reservation.prodDetail || "")
                        .split(" ")
                        .map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                    </ul>
                  </td>
                  <td className={styles["pay-count-row"]}>
                    {reservation.rsvCnt || 1}
                  </td>
                  <td className={styles["pay-price-row"]}>
                    {reservation.prodPrice?.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles["pay-action"]}>
          <button
            className={styles["pay-shopping-btn"]}
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
            className={styles["pay-mypage-btn"]}
            onClick={() => {
              if (memberId) navigate(`/payments/member/${memberId}`);
              else alert("회원 정보를 찾을 수 없습니다.");
            }}
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentResult;
