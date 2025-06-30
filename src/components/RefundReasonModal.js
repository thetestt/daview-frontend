// components/RefundReasonModal.js

import React from "react";

const RefundReasonModal = ({
  onClose,
  onConfirm,
  selectReason,
  setSelectReason,
  customReason,
  setCustomReason,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px 20px",
          borderRadius: "10px",
          textAlign: "center",
          minWidth: "280px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#aaa",
          }}
        >
          ×
        </button>
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          환불 사유를 선택해주세요
        </p>
        <select
          value={selectReason}
          onChange={(e) => setSelectReason(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">사유 선택</option>
          <option value="단순 변심">단순 변심</option>
          <option value="상품 정보 불일치">상품 정보 불일치</option>
          <option value="예약 일정 변경">예약 일정 변경</option>
          <option value="기타">기타</option>
        </select>

        {selectReason === "기타" && (
          <textarea
            placeholder="기타 사유를 입력하세요"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "6px",
              resize: "none",
              marginBottom: "10px",
            }}
          />
        )}

        <button
          onClick={onConfirm}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          환불 확정
        </button>
      </div>
    </div>
  );
};

export default RefundReasonModal;
