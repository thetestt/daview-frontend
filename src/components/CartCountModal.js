import React from "react";
import styles from "../styles/components/CartCountModal.module.css";

function CartModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles["cart-count-box"]} onClick={onClose}>
      <div
        className={styles["cart-conut-modal"]}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default CartModal;
