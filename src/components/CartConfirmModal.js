import React from "react";
import styles from "../styles/components/CartConfirmModal.module.css";

function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={styles["cart-confirm-box"]}>
      <div className={styles["cart-confirm-modal"]}>
        <h3 className={styles["cart-confirm-title"]}>
          예약을 진행하시겠습니까?
        </h3>
        <div className={styles["cart-confirm-title-button-box"]}>
          <button
            className={styles["cart-confirm-title-button"]}
            onClick={onConfirm}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            확인
          </button>
          <button
            className={styles["cart-confirm-title-cancel"]}
            onClick={() => {
              alert("예약이 취소되었습니다.");
              onClose();
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
