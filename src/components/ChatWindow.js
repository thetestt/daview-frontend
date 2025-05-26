import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import "../styles/components/ChatWindow.css";

const ChatWindow = ({ chatroomId, currentUser }) => {
  const [messages, setMessages] = useState([
    {
      chatroomId: chatroomId,
      senderId: 200,
      sender: "요양사",
      content: "안녕하세요! 무엇을 도와드릴까요?",
      time: "10:00",
    },
  ]);

  const sendMessage = (content) => {
    const msg = {
      chatroomId: chatroomId,
      senderId: currentUser.memberId,
      sender: currentUser.username,
      content: content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;
