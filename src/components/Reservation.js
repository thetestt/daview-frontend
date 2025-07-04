import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getReservationById,
  updateReservationCount,
  deleteReservation,
  deleteAllReservation,
} from "../api/reservationApi";
import styles from "../styles/components/Reservation.module.css";

const Reservation = () => {
  const { memberId } = useParams();
  const loginMemberId = localStorage.getItem("memberId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [totalSelectedPrice, setTotalSelectedPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginMemberId) {
      alert("로그인 후 예약이 가능합니다.");
      return;
    }

    const init = async () => {
      try {
        const res = await getReservationById(memberId);
        const fetched = Array.isArray(res) ? res : [res];
        setReservations(fetched.filter((item) => item.rsvType === 1));
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
    const selected = Object.values(checkedItems).some((v) => v)
      ? reservations.filter((r) => checkedItems[r.rsvId])
      : reservations;

    setTotalSelectedPrice(
      selected.reduce(
        (sum, r) => sum + (Number(r.prodPrice) || 0) * (r.rsvCnt || 1),
        0
      )
    );
  }, [checkedItems, reservations]);

  const handleCheckboxChange = (rsvId, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [rsvId]: isChecked }));
  };

  const handleSingleDelete = async (rsvId) => {
    if (!checkedItems[rsvId]) {
      alert("삭제할 항목을 체크해주세요.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteReservation(rsvId);
      setCheckedItems((prev) => {
        const updated = { ...prev };
        delete updated[rsvId];
        return updated;
      });
      const res = await getReservationById(memberId);
      const fetched = Array.isArray(res) ? res : [res];
      setReservations(fetched.filter((item) => item.rsvType === 1));
    } catch (err) {
      if (err?.response?.status === 404) {
        alert("해당 예약은 이미 삭제된 상태입니다.");
      } else {
        alert("삭제 중 오류가 발생했습니다.");
        console.error("삭제 실패:", err);
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
        alert("전체 삭제 중 오류가 발생했습니다.");
        console.error("전체 삭제 실패:", err);
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
    const selected = reservations.filter((r) => checkedItems[r.rsvId]);
    if (selected.length === 0) {
      alert("결제할 예약을 선택해 주세요.");
      return;
    }
    if (!window.confirm("결제를 진행하겠습니까?")) return;
    try {
      await updateReservationCount(selected);
      const totalPrice = selected.reduce(
        (sum, r) => sum + (Number(r.prodPrice) || 0) * (r.rsvCnt || 1),
        0
      );
      navigate(`/payment`, {
        state: { reservations: selected, totalPrice },
      });
    } catch (err) {
      alert("예약 인원 업데이트 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const getProdTypePath = (prodType) => {
    switch (prodType) {
      case 1:
        return "nursinghome";
      case 2:
        return "silvertown";
      case 3:
        return "caregiver";
      default:
        return "unknown";
    }
  };

  const latestProdType =
    reservations.length > 0
      ? getProdTypePath(reservations[0].prodType)
      : "nursinghome";

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</div>
    );

  if (reservations.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        예약 정보가 없습니다.
      </p>
    );

  return (
    <div className={styles["rsv-container"]}>
      <div className={styles["rsv-notice"]}>
        *** 해당 상품 금액은 [ 예약금 ]이며, 추후 차액은 상담 후 센터에서
        도와드립니다. ***
      </div>
      <div className={styles["rsv-box"]}>
        <div className={styles["rsv-write-box"]}>
          <h2 className={styles["rsv-box-title"]}>예약 확인</h2>
          <table className={styles["rsv-table"]}>
            <thead>
              <tr>
                <th className={styles["rsv-checkbox-row"]}></th>
                <th className={styles["rsv-img-row"]}>상품 이미지</th>
                <th className={styles["rsv-info-col"]}>상품 정보</th>
                <th className={styles["rsv-count-row"]}>수량</th>
                <th className={styles["rsv-price-row"]}>상품 금액</th>
                <th className={styles["rsv-delete-row"]}>상품 삭제</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.rsvId} className={styles["rsv-row"]}>
                  <td className={styles["rsv-checkbox-row"]}>
                    <input
                      type="checkbox"
                      checked={!!checkedItems[reservation.rsvId]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          reservation.rsvId,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td className={styles["rsv-img-row"]}>
                    <img
                      src={reservation.prodPhoto || "#"}
                      alt="상품 이미지"
                      className={styles["rsv-product-img"]}
                    />
                  </td>
                  <td className={styles["rsv-info-row"]}>
                    <Link
                      to={`/${getProdTypePath(reservation.prodType)}/${
                        reservation.prodId
                      }`}
                      className={styles["rsv-product-title"]}
                    >
                      {reservation.prodNm}
                    </Link>
                    <ul>
                      {(reservation.prodDetail || "")
                        .split(" ")
                        .map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                    </ul>
                  </td>
                  <td className={styles["rsv-count-row"]}>
                    <button
                      className={styles["rsv-count-btn"]}
                      onClick={() => handleDecreaseCount(reservation.rsvId)}
                    >
                      -
                    </button>
                    {reservation.rsvCnt || 1}
                    <button
                      className={styles["rsv-count-btn"]}
                      onClick={() => handleIncreaseCount(reservation.rsvId)}
                    >
                      +
                    </button>
                  </td>
                  <td className={styles["rsv-price-row"]}>
                    ₩ {(Number(reservation.prodPrice) || 0).toLocaleString()}
                  </td>
                  <td className={styles["rsv-delete-row"]}>
                    <button
                      onClick={() => handleSingleDelete(reservation.rsvId)}
                      className={styles["rsv-delete-btn"]}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles["rsv-summary-line"]}></div>
          <div className={styles["rsv-summary"]}>
            <button
              className={styles["rsv-delete-all-btn"]}
              onClick={handleDeleteAll}
            >
              전체 삭제
            </button>
            <div className={styles["rsv-total"]}>
              총 {reservations.length}개 상품 합계{" "}
              <span className={styles["rsv-price"]}>
                ₩ {totalSelectedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className={styles["rsv-action"]}>
          <button
            className={styles["rsv-shopping-btn"]}
            onClick={() => navigate(`/${latestProdType}`)}
          >
            쇼핑 계속하기
          </button>
          <button className={styles["rsv-pay-btn"]} onClick={handlePayment}>
            결제
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
