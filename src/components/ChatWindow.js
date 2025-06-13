import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getMessages } from "../api/chat"; // 과저 메시지 불러오기 API
import "../styles/components/ChatWindow.css";

const ChatWindow = ({ chatroomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    // ✅ 기존 메시지 불러오기
    getMessages(chatroomId).then((data) => {
      const loaded = data.map((msg) => ({
        ...msg,
        sender: msg.senderId === currentUser.memberId ? "나" : "상대방",
        time: new Date(msg.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(loaded);
    });

    // ✅ WebSocket 연결
    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("✅ WebSocket 연결됨");

        // ✅ 수신 메시지 구독
        stompClient.subscribe(`/sub/chat/room/${chatroomId}`, (message) => {
          const received = JSON.parse(message.body);
          console.log("📩 받은 메시지:", received);

          setMessages((prev) => [
            ...prev,
            {
              ...received,
              sender:
                received.senderId === currentUser.memberId ? "나" : "상대방",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket 오류", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [chatroomId, currentUser.memberId]);

  // ✅ 메시지 전송
  const sendMessage = (content) => {
    const msg = {
      chatroomId: chatroomId,
      senderId: currentUser.memberId,
      content: content,
      sentAt: new Date().toISOString(),
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/pub/chat/send",
        body: JSON.stringify(msg),
      });
    } else {
      console.error("❌ WebSocket이 연결되지 않았습니다.");
    }
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
