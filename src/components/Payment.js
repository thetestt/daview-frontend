import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PayButton from "./PayButton";
import { getMyCoupons } from "../api/paymentApi";
import styles from "../styles/components/Payment.module.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");
  const reservations = location.state?.reservations || [];
  const totalPrice = location.state?.totalPrice || 0;
  const [loading, setLoading] = useState(true);
  const [isAgreed, setIsAgreed] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    emergencyPhone: "",
    consultDate: "",
    message: "",
  });

  useEffect(() => {
    if (!memberId) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    const fetchCoupons = async () => {
      try {
        const data = await getMyCoupons();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoupons();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCouponChange = (e) => {
    const selectedId = Number(e.target.value);
    setSelectedCouponId(selectedId);
    const selected = coupons.find((c) => c.couponId === selectedId);
    setDiscount(selected?.discount ?? 0);
  };

  const discountedPrice = discount
    ? Math.floor(totalPrice * (1 - discount / 100))
    : totalPrice;
  const discountAmount = totalPrice - discountedPrice;

  if (loading) return <p>잠시만 기다려주세요...</p>;

  return (
    <div className={styles["pay-container"]}>
      <div className={styles["pay-title-box"]}>
        <h2 className={styles["pay-page-title"]}>주문 / 결제</h2>
        <div className={styles["pay-notice"]}>
          *** 해당 상품 금액은 [ 예약금 ]이며 추후 차액은 상담 후 센터에서
          도와드립니다. ***
        </div>
      </div>

      <div className={styles["pay-box"]}>
        <div className={styles["pay-title"]}>주문 상품 정보</div>
        <table className={styles["pay-reservation-table"]}>
          <thead>
            <tr>
              <th className={styles["pay-img-row"]}>상품 이미지</th>
              <th className={styles["pay-info-row"]}>상품 정보</th>
              <th className={styles["pay-count-row"]}>인원</th>
              <th className={styles["pay-price-row"]}> 상품 금액</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr
                className={styles["pay-reservation-row"]}
                key={reservation.rsvId}
              >
                <td className={styles["pay-img-row"]}>
                  <img
                    src={reservation.prodPhoto || "/images/default.png"}
                    alt="상품 이미지"
                    className={styles["pay-product-img"]}
                  />
                </td>
                <td className={styles["pay-info-row"]}>
                  <div className={styles["pay-product-title"]}>
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
                  {reservation.rsvCnt}
                </td>
                <td className={styles["pay-price-row"]}>
                  ₩ {reservation.prodPrice?.toLocaleString() ?? "정보 없음"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles["pay-user-title"]}>주문자 정보</div>
        <div className={styles["pay-user-info"]}>
          <div className={styles["pay-name-consult-group"]}>
            <div className={styles["pay-input-group"]}>
              <span className={styles["pay-user-name"]}>
                이름<span className={styles["pay-red-star"]}>*</span>
              </span>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                placeholder="이름"
              />
            </div>

            <div className={styles["pay-input-group"]}>
              <span className={styles["pay-facility-date"]}>
                상담 예정일<span className={styles["pay-red-star"]}>*</span>
              </span>
              <input
                type="date"
                name="consultDate"
                value={userInfo.consultDate}
                min={
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                }
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles["pay-contact-group"]}>
            <div className={styles["pay-input-group"]}>
              <span className={styles["pay-user-name"]}>
                연락처<span className={styles["pay-red-star"]}>*</span>
              </span>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleChange}
                placeholder="연락처"
              />
            </div>

            <div className={styles["pay-input-group"]}>
              <span className={styles["pay-user-name"]}>
                비상 연락처<span className={styles["pay-red-star"]}>*</span>
              </span>
              <input
                type="text"
                name="emergencyPhone"
                value={userInfo.emergencyPhone}
                onChange={handleChange}
                placeholder="비상 연락처"
              />
            </div>
          </div>

          <div className={styles["pay-input-group"]}>
            <span className={styles["pay-user-name"]}>
              기타 문의 사항<span className={styles["pay-red-star"]}>*</span>
            </span>
            <textarea
              name="message"
              value={userInfo.message}
              onChange={handleChange}
              className={styles["pay-etc"]}
              placeholder="기타 문의 사항"
            ></textarea>
          </div>
        </div>

        <div className={styles["pay-card-title"]}>결제 수단</div>
        <div className={styles["pay-card-group"]}>
          <div className={styles["pay-radio-group"]}>
            <label>
              <input type="radio" name="payment" defaultChecked /> 신용카드
            </label>
            <label>
              <input type="radio" name="payment" /> 무통장 입금
            </label>
            <label>
              <input type="radio" name="payment" /> 카카오페이
            </label>
            <label>
              <input type="radio" name="payment" /> 네이버페이
            </label>
          </div>
        </div>

        <div className={styles["pay-right-box"]}>
          <div className={styles["pay-payinfo-title"]}>결제 정보</div>
          <div className={styles["pay-price-row"]}>
            <span>상품 금액</span>
            <span>₩{totalPrice.toLocaleString()}</span>
          </div>

          <div className={styles["pay-total-box"]}>
            <div className={styles["coupon-box"]}>
              <label>사용할 쿠폰 선택</label>
              <select
                value={selectedCouponId || ""}
                onChange={handleCouponChange}
                className={styles["coupon-info"]}
              >
                <option value="">-- 쿠폰 선택 안함 --</option>
                {coupons
                  .filter((c) => !c.used)
                  .map((c) => (
                    <option key={c.couponId} value={c.couponId}>
                      {c.description} (-{c.discount}% 할인)
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles["pay-totalprice-row"]}>
              <span>총 결제 금액</span>
              <span>₩{discountedPrice.toLocaleString()}</span>
            </div>

            <label className={styles["pay-agreement"]}>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              예약에 관한 내용을 확인하였으며, <br />
              결제에 동의합니다.
            </label>

            <div className={styles["pay-btn-box"]}>
              <PayButton
                className={styles["pay-btn"]}
                reservations={reservations}
                totalPrice={discountedPrice}
                userInfo={userInfo}
                memberId={memberId}
                isAgreed={isAgreed}
                selectedCouponId={selectedCouponId}
                couponDiscount={discountAmount}
              />
              <button
                className={styles["pay-back-link"]}
                onClick={() => {
                  const confirmed = window.confirm(
                    "이전 페이지로 돌아가면 결제 내용은 초기화됩니다.\n이동하시겠습니까?"
                  );
                  if (confirmed) navigate(-1);
                }}
              >
                예약 페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
