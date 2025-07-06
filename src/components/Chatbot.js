import React, { useState } from "react";
import { sendMessage } from "../api/ChatbotApi";
import logo from "../assets/daview-logo.png";

export default function Chatbot({ onClose }) {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "bot", text: "무엇을 도와드릴까요?" },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = { sender: "user", text: input };
    setChatLog((prev) => [...prev, newUserMsg]);
    setInput("");

    try {
      const res = await sendMessage(input);
      const newBotMsg = { sender: "bot", text: res.data };
      setChatLog((prev) => [...prev, newBotMsg]);
    } catch {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했습니다." },
      ]);
    }
  };

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ backgroundColor: "#fff" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold" }}>Daview(다뷰)</div>
            <div style={{ fontSize: "11px", color: "#888" }}>
              문의량이 많아 답변이 지연되고 있어요
            </div>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgb(0, 139, 139)";
              e.currentTarget.style.textShadow =
                "0 0 6px rgba(0, 139, 139, 0.6)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.textShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#000",
              fontSize: "18px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            textAlign: "center",

            padding: "30px 0",
            height: "60px",
          }}
        >
          <img
            src={logo}
            alt="로고"
            style={{ width: "75px", height: "40px", marginRight: "10px" }}
          />
          <div style={{ fontWeight: "bold" }}>다뷰(Daview)에 문의하기</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          fontSize: "14px",
          background: "#ffffff",
        }}
      >
        <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
          {getTime()}
        </div>

        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            {msg.sender === "bot" && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginBottom: "4px",
                  marginLeft: "12px",
                }}
              >
                Daview(다뷰)
              </div>
            )}
            <span
              style={{
                display: "inline-block",
                backgroundColor: msg.sender === "user" ? "#00334f" : "#e5e5ea",
                color: msg.sender === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "20px",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            transition: "box-shadow 0.3s ease-in-out",
          }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 0 2px rgb(0, 139, 139)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <button
          type="submit"
          style={{
            marginLeft: "8px",
            padding: "10px 14px",
            backgroundColor: "#00334f",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#005777")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#00334f")
          }
        >
          전송
        </button>
      </form>
    </div>
  );
}
