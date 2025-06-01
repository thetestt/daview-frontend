import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReservationById } from "../api/reservationApi";

const Reservation = () => {
  const { memberId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getReservationById(memberId);
        const fetchedReservations = Array.isArray(res) ? res : [res];
        setReservations(
          fetchedReservations.filter((item) => item.rsvType !== 2)
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setReservations([]);
        } else {
          console.error("예약 정보 불러오기 실패:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [memberId]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</div>
    );

  if (reservations.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        예약 정보가 없습니다.
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>예약 목록</h2>

      {reservations
        .filter((item) => item.rsvType !== 2)
        .map((reservation) => (
          <div
            key={reservation.rsvId}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              상품명: {reservation.prodNm}
            </label>
            <div>예약 ID: {reservation.rsvId}</div>
            <div>회원 ID: {reservation.memberId}</div>
            <div>상품 ID: {reservation.prodId}</div>
            <div>
              상품 유형:{" "}
              {reservation.prodType === 1
                ? "요양기관"
                : reservation.prodType === 2
                ? "실버타운"
                : reservation.prodType === 3
                ? "요양사"
                : "알 수 없음"}
            </div>
            <div>
              상품 상세:
              <div
                style={{
                  marginLeft: "10px",
                  marginTop: "5px",
                  whiteSpace: "pre-line",
                }}
              >
                {reservation.prodDetail
                  ? reservation.prodDetail
                      .split(" ")
                      .map((word, idx) => <div key={idx}>{word}</div>)
                  : "정보 없음"}
              </div>
            </div>
            <div>
              상품 가격:{" "}
              {reservation.prodPrice
                ? reservation.prodPrice.toLocaleString()
                : "정보 없음"}
              원
            </div>
            <div>
              예약 유형: {reservation.rsvType === 1 ? "결제전" : "예약취소"}
            </div>
            <div>
              예약일:{" "}
              {reservation.rsvDate
                ? new Date(reservation.rsvDate).toLocaleString()
                : "예약일 정보 없음"}
            </div>
            <div>
              이용일:{" "}
              {reservation.prodDate
                ? new Date(reservation.prodDate).toLocaleDateString()
                : "미정"}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Reservation;
