import React, { useEffect, useState, useRef, useCallback } from "react"; // 🔴❤️ useCallback 추가
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

  // 💬 처음 리스트 불러오기
  const loadChatRooms = useCallback(async () => {
    try {
      const basicRooms = await getChatRooms(memberId);
      console.log("🧾 [기본 채팅방 리스트]", basicRooms);

      // 💬 각 방에 대해 getChatRoomInfo 호출해서 상세 정보로 덮어쓰기
      const detailedRooms = await Promise.all(
        basicRooms.map(async (room) => {
          try {
            const info = await getChatRoomInfo(room.chatroomId, memberId);
            return {
              ...room,
              ...info, // 💬 opponentName, type, userName 등 상세정보 덮어쓰기
            };
          } catch (e) {
            console.warn(`❌ ${room.chatroomId} 상세 정보 가져오기 실패`);
            return room; // 💬 실패 시 기본 정보라도 유지
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
  }, [memberId]);

  // 💬 ✅ 개별 채팅방 정보 갱신
  const updateSingleRoom = useCallback(
    async (roomId) => {
      try {
        const updatedRoom = await getChatRoomInfo(roomId, memberId);
        console.log("📦getchatRoomInfo 메서드 작동하나?:", updatedRoom);
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
    },
    [memberId]
  );

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
        console.log("✅ ChatList WebSocket 연결됨 우루롹끼");

        // 💬 ✅ 채팅방 리스트 갱신용 구독
        stompClient.subscribe(`/sub/chat/roomList/${memberId}`, (msg) => {
          const payload = JSON.parse(msg.body);
          console.log("📩 채팅방 리스드갱신용 chatlist.js :", payload);
          updateSingleRoom(payload.chatroomId);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [memberId, navigate, loadChatRooms, updateSingleRoom]);

  useEffect(() => {
    if (refresh) {
      loadChatRooms(); //  refresh에 반응하도록 loadChatRooms 추가
    }
  }, [refresh, loadChatRooms]); //  의존성 보완

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  const getDisplayName = (room) => {
    // 💬 상대가 방을 나갔는지 확인
    const isSender = memberId === room.senderId;
    const opponentOut =
      (isSender && room.receiverTrashCan) || (!isSender && room.senderTrashCan);

    let name = "";

    if (room.type === "facility") {
      name = room.facilityName || room.opponentName;
    } else if (room.type === "caregiver") {
      name = room.userName ? `${room.userName} 요양사` : room.opponentName;
    } else if (room.type === "user") {
      name = room.userName || room.opponentName;
    } else {
      name = room.opponentName;
    }

    // 💬 상대가 나간 경우 문구 붙이기
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
