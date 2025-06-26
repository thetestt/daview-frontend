import React from "react";
import styles from "../styles/components/ChatMessage.module.css";

const ChatMessage = ({ message }) => {
  const isMe = message.sender === "나";

  return (
    <div
      className={`${styles["chat-message"]} ${
        isMe ? styles["me"] : styles["you"]
      }`}
    >
      {isMe && message.isRead === false && (
        <img
          src="/images/icon/paper-plane.png"
          alt="안읽음"
          className={styles["unread-icon"]}
        />
      )}
      <div className={styles["bubble"]}>
        <p className={styles["text"]}>{message.content}</p>

        <div className={styles["bottom-row"]}>
          <p className={styles["time"]}>{message.time}</p>

          {/* ✅ 편지 아이콘: 내가 보낸 메시지이면서 읽지 않은 경우에만 표시 */}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
