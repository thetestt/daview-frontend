import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms } from "../api/chat";
import styles from "../styles/pages/ChatList.module.css";

const ChatList = ({ refresh }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const memberId = Number(localStorage.getItem("memberId"));
  const { chatroomId: selectedIdFromParams } = useParams();
  const location = useLocation();

  const selectedChatroomId =
    location.pathname.startsWith("/chat/") && selectedIdFromParams
      ? selectedIdFromParams
      : null;

  // 💬 채팅방 리스트 불러오기
  const loadChatRooms = useCallback(async () => {
    try {
      const rooms = await getChatRooms(memberId);
      const uniqueRooms = Array.from(
        new Map(rooms.map((room) => [room.chatroomId, room])).values()
      );
      const sortedRooms = uniqueRooms.sort(
        (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
      );
      setChatRooms(sortedRooms);
    } catch (err) {
      console.error("❌ 채팅방 목록 로딩 실패:", err);
    }
  }, [memberId]);

  // ✅ WebSocket 연결 및 채팅방 갱신 처리
  useEffect(() => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    loadChatRooms();

    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ ChatList WebSocket 연결됨");
        stompClient.subscribe(`/sub/chat/roomList/${memberId}`, () => {
          loadChatRooms(); // 수신 시 전체 새로고침
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [memberId, navigate, loadChatRooms]);

  useEffect(() => {
    if (refresh) {
      loadChatRooms();
    }
  }, [refresh, loadChatRooms]);

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  const getDisplayName = (room) => {
    const isSender = memberId === room.senderId;
    const opponentOut =
      (isSender && room.receiverTrashCan) || (!isSender && room.senderTrashCan);

    let name = "";
    if (room.type === "facility") {
      name = room.facilityName || room.opponentName || "이름없음";
    } else if (room.type === "caregiver") {
      name = room.opponentName
        ? `${room.opponentName} 요양사`
        : "이름없는 요양사";
    } else if (room.type === "user") {
      name = room.opponentName || "사용자";
    } else {
      name = room.opponentName || "알 수 없음";
    }

    return (
      <>
        {name}
        {opponentOut && (
          <span className={styles["opponent-out-text"]}>
            {" "}
            (채팅불가 사용자)
          </span>
        )}
      </>
    );
  };

  return (
    <div className={styles["chat-list-container"]}>
      {chatRooms.map((room) => {
        const isActive = String(room.chatroomId) === selectedChatroomId;
        return (
          <div
            key={room.chatroomId}
            className={`${styles["chat-list-item"]} ${
              isActive ? styles["active"] : ""
            }`}
            onClick={() => handleEnterRoom(room.chatroomId)}
          >
            <div className={styles["chat-title"]}>{getDisplayName(room)}</div>
            <div className={styles["chat-preview"]}>
              <span>
                {room.lastMessage
                  ? room.lastMessage.length > 38
                    ? `${room.lastMessage.slice(0, 38)}...`
                    : room.lastMessage
                  : ""}
              </span>
              <span className={styles["chat-time"]}>
                {room.sentAt
                  ? new Date(room.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
            {room.unreadCount > 0 && (
              <div className={styles["unread-badge"]}>{room.unreadCount}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
