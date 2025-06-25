import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getMessages, exitChatRoom, verifyChatAccess } from "../api/chat";
import "../styles/components/ChatWindow.css";
//import { useNavigate } from "react-router";

const ChatWindow = ({
  chatroomId,
  currentUser,
  chatTargetInfo,
  onExitChat,
}) => {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isActivatedRef = useRef(false);
  //const navigate = useNavigate();
  // ✅ 메시지 중복 방지용
  const receivedMessageCacheRef = useRef(new Set());
  const messageCache = receivedMessageCacheRef.current;
  const [isAllowed, setIsAllowed] = useState(null);

  //const [accessGranted, setAccessGranted] = useState(false);

  //백앤드에서 웹소켓 접속가능 여부 확인
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      const allowed = await verifyChatAccess(chatroomId, currentUser.memberId);
      if (!allowed) {
        console.warn("🚫 채팅방 접근 권한 없음");
        //setAccessGranted(false);
        setIsAllowed(false);
        return;
      }
      setIsAllowed(true);
      //setAccessGranted(true);

      // ✅ 기존 메시지 불러오기
      getMessages(chatroomId, currentUser.memberId).then((data) => {
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

            //중복코드방지
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
    };

    initChat();

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

      messageCache.clear(); // ✅ 캐시도 초기화
    };
  }, [chatroomId, currentUser.memberId]);

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

  //상대방 정보 상단에 배치
  useEffect(() => {
    console.log("받은 채팅 상대 정보:", chatTargetInfo);

    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatTargetInfo]);

  //나가기
  const handleExit = async () => {
    if (window.confirm("정말 이 채팅방에서 나가시겠습니까?")) {
      try {
        const res = await exitChatRoom(chatroomId, currentUser.memberId);
        if (res.success) {
          alert("채팅방에서 나갔습니다.");
          onExitChat(); // ✅ 채팅 목록으로 이동
        }
      } catch (error) {
        alert("채팅방 나가기 실패");
        console.error(error);
      }
    }
  };

  if (isAllowed === null) return <div>채팅방 접근 확인 중...</div>;
  if (isAllowed === false) return null;

  return (
    <div className="chat-window">
      {chatTargetInfo && (
        <div className="chatroom-header">
          {chatTargetInfo.type === "facility" ? (
            <div>
              <h3>{chatTargetInfo.facilityName}</h3>
              <p>
                {chatTargetInfo.facilityAddressLocation}{" "}
                {chatTargetInfo.facilityAddressCity}
              </p>
              <p>{chatTargetInfo.facilityPhone}</p>
            </div>
          ) : chatTargetInfo.type === "caregiver" ? (
            <div>
              <h3>{chatTargetInfo.userName} 요양사</h3>
              <p>
                희망근무지 :{chatTargetInfo.hopeWorkAreaLocation}{" "}
                {chatTargetInfo.hopeWorkAreaCity}
              </p>
            </div>
          ) : chatTargetInfo.type === "user" ? (
            <div>
              <h3>{chatTargetInfo.userName}</h3>
              <p>일반 사용자</p>
            </div>
          ) : (
            <div>정보가 없습니다</div>
          )}

          <button className="exit-chat-btn" onClick={handleExit}>
            채팅방 나가기
          </button>
        </div>
      )}

      <div className="message-list">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <ChatInput onSend={sendMessage} className="chat-input" />
    </div>
  );
};

export default ChatWindow;
