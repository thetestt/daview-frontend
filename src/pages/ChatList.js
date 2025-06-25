import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms, getChatRoomInfo } from "../api/chat";
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

  // 처음 리스트 불러오기
  const loadChatRooms = async () => {
    try {
      const basicRooms = await getChatRooms(memberId);

      // 각 방에 대해 getChatRoomInfo 호출해서 상세 정보로 덮어쓰기
      const detailedRooms = await Promise.all(
        basicRooms.map(async (room) => {
          try {
            const info = await getChatRoomInfo(room.chatroomId, memberId);
            return {
              ...room,
              ...info, // opponentName, type, userName 등 상세정보 덮어쓰기
            };
          } catch (e) {
            console.warn(`❌ ${room.chatroomId} 상세 정보 가져오기 실패`);
            return room; // 실패 시 기본 정보라도 유지
          }
        })
      );

      const uniqueRooms = Array.from(
        new Map(detailedRooms.map((room) => [room.chatroomId, room])).values()
      );
      const sortedRooms = uniqueRooms.sort(
        (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
      );
      setChatRooms(sortedRooms);
    } catch (err) {
      console.error("❌ 채팅방 목록 로딩 실패:", err);
    }
  };

  // ✅ 개별 채팅방 정보 갱신
  const updateSingleRoom = async (roomId) => {
    try {
      const updatedRoom = await getChatRoomInfo(roomId, memberId);
      if (!updatedRoom) return;

      setChatRooms((prevRooms) => {
        const filtered = prevRooms.filter((r) => r.chatroomId !== roomId);
        const updated = [updatedRoom, ...filtered];
        return updated.sort(
          (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
        );
      });
    } catch (err) {
      console.error("❌ 개별 채팅방 업데이트 실패:", err);
    }
  };

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

        // ✅ 채팅방 리스트 갱신용 구독
        stompClient.subscribe(`/sub/chat/roomList/${memberId}`, (msg) => {
          const payload = JSON.parse(msg.body);
          console.log("📩 채팅방 업데이트 수신:", payload);
          updateSingleRoom(payload.chatroomId);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [memberId]);

  useEffect(() => {
    if (refresh) {
      loadChatRooms();
    }
  }, [refresh]);

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  const getDisplayName = (room) => {
    if (room.type === "facility") {
      return room.facilityName || room.opponentName;
    } else if (room.type === "caregiver") {
      return room.userName ? `${room.userName} 요양사` : room.opponentName;
    } else if (room.type === "user") {
      return room.userName || room.opponentName;
    } else {
      return room.opponentName;
    }
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
                {room.lastTime
                  ? new Date(room.lastTime).toLocaleTimeString([], {
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
