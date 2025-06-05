import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReservationById } from "../api/reservationApi";
import { deleteReservation, deleteAllReservation } from "../api/reservationApi";

const Reservation = () => {
  const { memberId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});

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

  const handleCheckboxChange = (rsvId, isChecked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [rsvId]: isChecked,
    }));
  };

  const handleSingleDelete = async (rsvId) => {
    if (!checkedItems[rsvId]) {
      alert("삭제할 항목을 체크해주세요.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteReservation(rsvId);
      } catch (err) {
        if (err.response && err.response.status !== 404)
          console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
        return;
      }
    }

    try {
      const res = await getReservationById(memberId);
      const fetchedReservations = Array.isArray(res) ? res : [res];
      setReservations(fetchedReservations.filter((item) => item.rsvType !== 2));
    } catch (err) {
      console.error("예약 정보 갱신 실패", err);
      alert("예약 목록을 불러오는 데 문제가 발생했습니다.");
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("모든 예약을 정말 삭제하시겠습니까?")) {
      try {
        await deleteAllReservation();
        setReservations([]);
        setCheckedItems({});
        alert("모든 예약이 삭제되었습니다.");
      } catch (err) {
        console.error("전체 삭제 실패:", err);
        alert("전체 삭제 중 오류가 발생했습니다.");
      }
    }
  };

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
              <input
                type="checkbox"
                checked={!!checkedItems[reservation.rsvId]}
                onChange={(e) =>
                  handleCheckboxChange(reservation.rsvId, e.target.checked)
                }
              />
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
            <button
              onClick={() => handleSingleDelete(reservation.rsvId)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "8px 12px",
              }}
            >
              삭제
            </button>
          </div>
        ))}
      <button
        onClick={handleDeleteAll}
        style={{
          display: "block",
          margin: "20px auto 0",
          padding: "12px 25px",
          fontSize: "16px",
        }}
      >
        전체 삭제
      </button>
    </div>
  );
};

export default Reservation;
