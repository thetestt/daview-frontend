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
      <div className={styles["bubble"]}>
        <p className={styles["text"]}>{message.content}</p>
        <p className={styles["time"]}>{message.time}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
