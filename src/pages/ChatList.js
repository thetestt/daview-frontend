import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms, getChatRoomInfo } from "../api/chat";
import "../styles/pages/ChatList.css";

const ChatList = () => {
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

  // ✅ 채팅방 목록 초기 불러오기
  const loadChatRooms = async () => {
    try {
      const data = await getChatRooms(memberId);
      const uniqueRooms = Array.from(
        new Map(data.map((room) => [room.chatroomId, room])).values()
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
  }, [memberId]); // ✅ chatroomId 제거

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  return (
    <div className="chat-list-container">
      {chatRooms.map((room) => {
        const isActive = String(room.chatroomId) === selectedChatroomId;
        return (
          <div
            key={room.chatroomId}
            className={`chat-list-item ${isActive ? "active" : ""}`}
            onClick={() => handleEnterRoom(room.chatroomId)}
          >
            <div className="chat-title">{room.opponentName}</div>
            <div className="chat-preview">
              <span>{room.lastMessage}</span>
              <span className="chat-time">
                {room.lastTime
                  ? new Date(room.lastTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
            {room.unreadCount > 0 && (
              <div className="unread-badge">{room.unreadCount}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
