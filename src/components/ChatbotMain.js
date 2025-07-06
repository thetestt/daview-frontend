import React, { useState } from "react";
import Chatbot from "./Chatbot";
import chatIcon from "../assets/chat-icon.png";

function ChatbotMain() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div
      style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}
    >
      {isOpen && (
        <div
          style={{
            width: "360px",
            height: "560px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <Chatbot onClose={toggleChat} />
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            backgroundColor: "#00334f",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          <img
            src={chatIcon}
            alt="Chat"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
      )}
    </div>
  );
}

export default ChatbotMain;
