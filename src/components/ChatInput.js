import React, { useState } from "react";
import styles from "../styles/components/ChatInput.module.css";

const ChatInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      console.log("✅ 전송할 메시지:", text);
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles["chat-input"]}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? " " : "메시지를 입력하세요"}
        disabled={disabled}
      />

      <button onClick={handleSend} disabled={disabled}>
        전송
      </button>
    </div>
  );
};

export default ChatInput;
