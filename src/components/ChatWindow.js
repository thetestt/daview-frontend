import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  getMessages,
  exitChatRoom,
  verifyChatAccess,
  //markMessagesAsRead,
} from "../api/chat";
import styles from "../styles/components/ChatWindow.module.css";
//import { useNavigate } from "react-router";

const ChatWindow = ({
  chatroomId,
  currentUser,
  chatTargetInfo,
  onExitChat,
  onRead,
}) => {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isActivatedRef = useRef(false);
  //const navigate = useNavigate();
  // ✅ 메시지 중복 방지용
  //const receivedMessageCacheRef = useRef(new Set());
  //const messageCache = receivedMessageCacheRef.current;
  const [isAllowed, setIsAllowed] = useState(null);
  const [isOpponentOut, setIsOpponentOut] = useState(false);

  //const [accessGranted, setAccessGranted] = useState(false);

  // ✅ 읽음 상태를 서버에 WebSocket으로 알림
  const sendReadReceipt = (retry = 0) => {
    const msg = {
      type: "READ",
      chatroomId,
      readerId: currentUser.memberId,
    };
    const client = stompClientRef.current;

    if (client && client.connected) {
      console.log("✅ WebSocket 연결됨 → 읽음 메시지 보냄", msg);
      client.publish({
        destination: "/pub/read",
        body: JSON.stringify(msg),
      });

      onRead?.(chatroomId);

      console.log("📩 읽음 상태 전송!", msg);
    } else if (retry < 3) {
      console.warn("⏳ 아직 연결 안됨 → 100ms 후 재시도");
      setTimeout(() => sendReadReceipt(retry + 1), 100);
    } else {
      console.error("❌ 읽음 전송 실패: WebSocket 미연결");
    }
  };

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

      // ✅ WebSocket 연결 및 구독
      if (!stompClientRef.current) {
        const socket = new SockJS("http://localhost:8080/ws-chat");
        const stompClient = new Client({
          webSocketFactory: () => socket,
          debug: (str) => console.log("[WebSocket]", str),
          onConnect: () => {
            console.log("✅ 76 WebSocket 연결됨");

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

              endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });

              // 메세지 읽음
              // ✅ 여기서 읽지 않은 메시지 확인 후 읽음 처리
              const hasUnreadFromOpponent = loaded.some(
                (msg) => msg.senderId !== currentUser.memberId && !msg.isRead
              );
              if (hasUnreadFromOpponent) {
                // ✅ 2. 연결 직후 약간의 딜레이 주고 보내기
                setTimeout(() => {
                  console.log("⏳ 읽음 전송 시작");
                  sendReadReceipt();
                }, 300); // 300ms 지연
              }
            });
            //읽음 알린 받기
            const readSub = stompClient.subscribe(
              `/sub/chat/read/${chatroomId}`, //읽음 알림 구독채널
              (message) => {
                const { readerId, chatMessageIds } = JSON.parse(message.body); //누가 읽었는지 확인
                console.log("📬 읽음수신", message.body);
                if (
                  readerId !== currentUser.memberId &&
                  Array.isArray(chatMessageIds)
                ) {
                  // 상대방이 읽었으면 내 메시지 중 읽힘 표시가 필요한 것들 반영
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.senderId === currentUser.memberId &&
                      chatMessageIds.includes(msg.chatMessageId)
                        ? { ...msg, isRead: true }
                        : msg
                    )
                  );
                  console.log("📬 읽음수신");
                  console.log("🧪 chatroomId", chatroomId);
                }
              }
            );

            console.log("✅ 128 WebSocket 연결됨");

            //중복코드방지
            if (!subscriptionRef.current) {
              console.log("📡 새 구독 시작:", chatroomId);

              const sub = stompClient.subscribe(
                `/sub/chat/room/${chatroomId}`,
                (message) => {
                  const received = JSON.parse(message.body);
                  console.log("📩 받은 메시지:", received);

                  // ✅ chatMessageId 기준 중복 메시지 방지
                  setMessages((prev) => {
                    const isDuplicate = prev.some(
                      (msg) => msg.chatMessageId === received.chatMessageId
                    );
                    if (isDuplicate) {
                      console.log(
                        "🚫 중복 메시지 무시됨:",
                        received.chatMessageId
                      );
                      return prev;
                    }

                    const updated = [
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
                    ];

                    // 🔴 내가 받은 메시지면 즉시 읽음 전송
                    if (received.senderId !== currentUser.memberId) {
                      sendReadReceipt();
                    }

                    return updated;
                  });
                }
              );

              subscriptionRef.current = sub;
            }

            console.log("📡 구독 설정 완료: /sub/chat/read/" + chatroomId);
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

      //messageCache.clear(); // ✅ 캐시도 초기화
    };
  }, [chatroomId, currentUser.memberId]);

  // ✅ 메시지 전송 함수
  const sendMessage = (content) => {
    const msg = {
      chatroomId,
      senderId: currentUser.memberId,
      receiverId: chatTargetInfo.opponentId,
      content,
      sentAt: new Date().toISOString(),
    };
    console.log(messages.map((msg) => msg.chatMessageId));
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

  // // ✅ 읽지 않은 메시지 실시간으로 감지해서 읽음 전송
  // const hasSentReadRef = useRef(false);
  // useEffect(() => {
  //   if (
  //     messages.length > 0 &&
  //     chatroomId &&
  //     currentUser.memberId &&
  //     !hasSentReadRef.current
  //   ) {
  //     const hasUnreadFromOpponent = messages.some(
  //       (msg) => msg.senderId !== currentUser.memberId && msg.isRead === false
  //     );

  //     if (hasUnreadFromOpponent) {
  //       sendReadReceipt();
  //       hasSentReadRef.current = true;
  //     }
  //   }
  // }, [messages, chatroomId, currentUser.memberId]);

  //상대방 정보 상단에 배치
  useEffect(() => {
    console.log("받은 채팅 상대 정보:", chatTargetInfo);

    if (chatTargetInfo && currentUser) {
      const isSender = chatTargetInfo.senderId === currentUser.memberId;
      const opponentOut = isSender
        ? chatTargetInfo.receiverTrashCan
        : chatTargetInfo.senderTrashCan;

      setIsOpponentOut(opponentOut === true);
    }

    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatTargetInfo, chatroomId]);

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

  useEffect(() => {
    messages.forEach((msg, index) => {
      messages.forEach((msg, idx) => {});
    });
  }, [messages]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (isAllowed === null) return <div>채팅방 접근 확인 중...</div>;
  if (isAllowed === false) return null;

  return (
    <div className={styles["chat-window"]}>
      {chatTargetInfo && (
        <div className={styles["chatroom-header"]}>
          <div className={styles["header-content"]}>
            {/* 상대방 정보 */}
            {chatTargetInfo.type === "facility" ? (
              <div>
                <h3>
                  {chatTargetInfo.opponentName}
                  <span className={styles["facility-type"]}></span>
                </h3>
              </div>
            ) : chatTargetInfo.type === "caregiver" ? (
              <div>
                <h3>{chatTargetInfo.opponentName} 요양사</h3>
              </div>
            ) : chatTargetInfo.type === "admin" ? (
              <div>
                <h3>{chatTargetInfo.opponentName} </h3>
              </div>
            ) : chatTargetInfo.type === "user" ? (
              <div>
                <h3>{chatTargetInfo.opponentName}</h3>
                <p>일반 사용자</p>
              </div>
            ) : (
              <div>정보가 없습니다</div>
            )}

            {/* 우측 상단 나가기 버튼 */}
            <button className={styles["exit-chat-btn"]} onClick={handleExit}>
              채팅방 나가기
            </button>
          </div>
        </div>
      )}

      <div className={styles["message-list"]}>
        {messages.map((msg, index) => (
          <ChatMessage key={`${msg.chatMessageId}`} message={msg} />
        ))}
        <div ref={endOfMessagesRef} />
        {/* ❤️ 상대방 나감 안내 & 입력창 처리 */}
        {isOpponentOut && (
          <div className={styles["opponent-left"]}>
            상대방이 방을 나갔습니다.
          </div>
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={isOpponentOut}
        className={styles["chat-input"]}
      />
    </div>
  );
};

export default ChatWindow;
