import React from "react";
import "../styles/components/ChatMessage.css";

const ChatMessage = ({ message }) => {
  const isMe = message.sender === "나";

  return (
    <div className={`chat-message ${isMe ? "me" : "you"}`}>
      <div className="bubble">
        <p className="text">{message.content}</p>
        <p className="time">{message.time}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
