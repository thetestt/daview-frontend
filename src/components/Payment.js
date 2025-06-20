import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PayButton from "./PayButton";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");
  const reservations = location.state?.reservations || [];
  const totalPrice = location.state?.totalPrice || 0;
  const [loading, setLoading] = useState(true);

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

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredReservations = reservations.filter(
    (reservation) => reservation.rsvType === 1 && reservation.rsvType !== 3
  );

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>결제 페이지</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>로딩 중...</p>
      ) : (
        <>
          {filteredReservations.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              결제할 예약 정보가 없습니다.
            </p>
          ) : (
            reservations.map((reservation) => (
              <div
                key={reservation.rsvId}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <img
                    src={reservation.prodPhoto || "/images/default.png"}
                    alt="상품이미지"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <div>예약 ID: {reservation.rsvId}</div>
                <div>회원 ID: {reservation.memberId}</div>
                <div>상품명: {reservation.prodNm}</div>
                <div>상품 상세: {reservation.prodDetail}</div>
                <div>수량: {reservation.rsvCnt}</div>
                <div>
                  상품 가격:{" "}
                  {reservation.prodPrice
                    ? reservation.prodPrice.toLocaleString()
                    : "정보 없음"}{" "}
                  원
                </div>
              </div>
            ))
          )}
          <div style={{ marginTop: "30px" }}>
            <h3>상담자 정보</h3>
            <div>
              <label>이름 *</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>연락처 *</label>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>비상 연락처</label>
              <input
                type="text"
                name="emergencyPhone"
                value={userInfo.emergencyPhone}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>상담 예정일 *</label>
              <input
                type="date"
                name="consultDate"
                value={userInfo.consultDate}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div>
              <label>기타 문의사항</label>
              <textarea
                name="message"
                value={userInfo.message}
                onChange={handleChange}
                rows={4}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "30px" }}>
            <strong>총 결제 금액: {totalPrice.toLocaleString()} 원</strong>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => {
                const confirmed = window.confirm(
                  "이전 페이지로 돌아가면 결제 내용은 초기화됩니다.\n이동하시겠습니까?"
                );
                if (confirmed) {
                  navigate(-1);
                }
              }}
            >
              예약 페이지로 돌아가기
            </button>
            <PayButton
              reservations={reservations}
              totalPrice={totalPrice}
              userInfo={userInfo}
              memberId={memberId}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Payment;
