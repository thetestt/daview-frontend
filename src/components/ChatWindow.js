import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getMessages } from "../api/chat";
import "../styles/components/ChatWindow.css";

const ChatWindow = ({ chatroomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isActivatedRef = useRef(false);

  // ✅ 메시지 중복 방지용 ref 깃수정테스트
  const receivedMessageCacheRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    // ✅ 기존 메시지 불러오기
    getMessages(chatroomId).then((data) => {
      if (!isMounted) return;
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

    // ✅ WebSocket 연결 및 구독
    if (!stompClientRef.current) {
      const socket = new SockJS("http://localhost:8080/ws-chat");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("[WebSocket]", str),
        onConnect: () => {
          console.log("✅ WebSocket 연결됨");

          // ✅ 구독 중복 방지
          if (!subscriptionRef.current) {
            console.log("📡 새 구독 시작:", chatroomId);

            const sub = stompClient.subscribe(
              `/sub/chat/room/${chatroomId}`,
              (message) => {
                const received = JSON.parse(message.body);
                console.log("📩 받은 메시지:", received);

                const cacheKey = `${received.senderId}_${received.sentAt}_${received.content}`;
                if (receivedMessageCacheRef.current.has(cacheKey)) {
                  return; // ✅ 이미 처리한 메시지라면 무시
                }
                receivedMessageCacheRef.current.add(cacheKey);

                setMessages((prev) => [
                  ...prev,
                  {
                    ...received,
                    sender:
                      received.senderId === currentUser.memberId
                        ? "나"
                        : "상대방",
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ]);
              }
            );

            subscriptionRef.current = sub;
          }
        },
        onStompError: (frame) => {
          console.error("❌ WebSocket 오류:", frame);
        },
      });

      stompClientRef.current = stompClient;

      if (!isActivatedRef.current) {
        stompClient.activate();
        isActivatedRef.current = true;
      }
    }

    // ✅ 언마운트 시 정리
    return () => {
      isMounted = false;

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        console.log("🔌 구독 해제됨");
      }

      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        isActivatedRef.current = false;
        console.log("🧹 WebSocket 연결 해제");
      }

      receivedMessageCacheRef.current.clear(); // ✅ 캐시도 초기화
    };
  }, [chatroomId]);

  // ✅ 메시지 전송 함수
  const sendMessage = (content) => {
    const msg = {
      chatroomId,
      senderId: currentUser.memberId,
      content,
      sentAt: new Date().toISOString(),
    };

    console.log("📤 보낼 메시지 객체:", msg);

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/pub/send",
        body: JSON.stringify(msg),
      });
      console.log("📡 메시지 WebSocket으로 발행함!");

      // 👇 프론트에서는 메시지를 직접 추가하지 않음!
      // 서버에서 받은 WebSocket 메시지로만 출력
    } else {
      console.error("❌ WebSocket 연결되지 않음");
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;
