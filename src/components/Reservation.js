import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getReservationById,
  updateReservationCount,
} from "../api/reservationApi";
import { deleteReservation, deleteAllReservation } from "../api/reservationApi";

const Reservation = () => {
  const { memberId } = useParams();
  const loginMemberId = localStorage.getItem("memberId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();
  const [totalSelectedPrice, setTotalSelectedPrice] = useState(0);

  useEffect(() => {
    if (!loginMemberId) {
      alert("로그인 후 예약이 가능합니다.");
      return;
    }

    const init = async () => {
      try {
        const res = await getReservationById(memberId);
        const fetchedReservations = Array.isArray(res) ? res : [res];
        setReservations(
          fetchedReservations.filter((item) => item.rsvType === 1)
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
  }, [memberId, loginMemberId]);

  useEffect(() => {
    const selectedReservations = Object.values(checkedItems).some(
      (isChecked) => isChecked
    )
      ? reservations.filter((reservation) => checkedItems[reservation.rsvId])
      : reservations; // 체크된 항목이 없으면 전체 예약을 사용

    setTotalSelectedPrice(
      selectedReservations.reduce(
        (sum, reservation) =>
          sum +
          (Number(reservation.prodPrice) || 0) * (reservation.rsvCnt || 1),
        0
      )
    );
  }, [checkedItems, reservations]);

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

    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteReservation(rsvId);

      setCheckedItems((prev) => {
        const updated = { ...prev };
        delete updated[rsvId];
        return updated;
      });
      const res = await getReservationById(memberId);
      const fetchedReservations = Array.isArray(res) ? res : [res];
      setReservations(fetchedReservations.filter((item) => item.rsvType === 1));
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn("이미 삭제된 예약입니다.");
        alert("해당 예약은 이미 삭제된 상태입니다.");
      } else {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
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

  const handleDecreaseCount = (rsvId) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.rsvId === rsvId
          ? { ...res, rsvCnt: Math.max(1, res.rsvCnt - 1) }
          : res
      )
    );
  };

  const handleIncreaseCount = (rsvId) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.rsvId === rsvId ? { ...res, rsvCnt: (res.rsvCnt || 1) + 1 } : res
      )
    );
  };

  const handlePayment = async () => {
    const selectedReservations = reservations.filter(
      (reservation) => checkedItems[reservation.rsvId]
    );

    if (selectedReservations.length == 0) {
      alert("결제할 예약을 선택해 주세요.");
      return;
    }

    if (!window.confirm("결제를 진행하겠습니까?")) {
      return;
    }
    try {
      await updateReservationCount(selectedReservations);
      const totalSelectedPrice = selectedReservations.reduce(
        (sum, reservation) =>
          sum +
          (Number(reservation.prodPrice) || 0) * (reservation.rsvCnt || 1),
        0
      );

      console.log("선택된 예약:", selectedReservations);
      console.log("총 금액:", totalSelectedPrice);

      navigate(`/payment`, {
        state: {
          reservations: selectedReservations,
          totalPrice: totalSelectedPrice,
        },
      });
    } catch (error) {
      alert("수량 업데이트 중 오류가 발생했습니다.");
      console.error(error);
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
        .filter((item) => item.rsvType === 1)
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
            <input
              type="checkbox"
              checked={!!checkedItems[reservation.rsvId]}
              onChange={(e) =>
                handleCheckboxChange(reservation.rsvId, e.target.checked)
              }
            />
            <div>
              <img
                src={reservation.prodPhoto || "/images/default.png"}
                alt="상품이미지"
                style={{ width: "200px", height: "auto" }}
              />
              <div>상품명: {reservation.prodNm}</div>
            </div>
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
              수량:
              <button onClick={() => handleDecreaseCount(reservation.rsvId)}>
                -
              </button>
              {reservation.rsvCnt || 1}
              <button onClick={() => handleIncreaseCount(reservation.rsvId)}>
                +
              </button>
            </div>
            <div>
              상품 가격:{" "}
              {reservation.prodPrice
                ? reservation.prodPrice.toLocaleString()
                : "정보 없음"}
              원
            </div>
            <div>
              예약 유형:{" "}
              {reservation.rsvType === 1
                ? "결제전"
                : reservation.rsvType === 2
                ? "예약취소"
                : reservation.rsvType === 3
                ? "결제완료"
                : "알 수 없음"}
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
      <div><strong>총 결제 금액: {totalSelectedPrice.toLocaleString()} 원</strong></div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate(-1)}>쇼핑 계속하기</button>
        <button onClick={handlePayment}>결제하기</button>
      </div>
    </div>
  );
};

export default Reservation;
