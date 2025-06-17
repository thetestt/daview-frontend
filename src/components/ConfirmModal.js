import React from "react";

function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          minWidth: "320px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
          예약을 진행하시겠습니까?
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <button
            style={{
              backgroundColor: "#007acc",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={onConfirm}
          >
            확인
          </button>
          <button
            style={{
              backgroundColor: "#D3D3D3",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
            onClick={() => {
              alert("예약이 취소되었습니다.");
              onClose();
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
