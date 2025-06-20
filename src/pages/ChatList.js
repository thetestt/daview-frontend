import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms } from "../api/chat";
import "../styles/pages/ChatList.css";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const memberId = Number(localStorage.getItem("memberId"));

  // ✅ 채팅방 불러오기 함수
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const data = await getChatRooms(memberId);
      console.log("🔥 전체 채팅방 수:", data.length);
      console.log("🔥 채팅방 전체 목록:", data);
      const uniqueRooms = Array.from(
        new Map(data.map((room) => [room.chatroomId, room])).values()
      );
      const sortedRooms = uniqueRooms.sort(
        (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
      );
      setChatRooms(sortedRooms);
      setError(null);
    } catch (err) {
      console.error("❌ 채팅방 목록 로딩 실패:", err);
      setError("채팅방 목록을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ 로그인 안 했을 경우 접근 제한
    if (!memberId) {
      alert("권한이 없습니다. 로그인 후 이용해주세요.");
      navigate("/login"); // 또는 navigate("/")로 홈으로 이동 가능
      return;
    }

    loadChatRooms();

    // ✅ WebSocket 연결
    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("✅ ChatList WebSocket 연결됨");

        stompClient.subscribe("/sub/chat/room", () => {
          console.log("📩 새로운 메시지 도착!");
          loadChatRooms();
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [memberId]);

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">📂 내 채팅방</h2>

      {loading ? (
        <div className="chat-loading">불러오는 중...</div>
      ) : error ? (
        <div className="chat-error">{error}</div>
      ) : chatRooms.length === 0 ? (
        <div className="chat-empty">채팅방이 없습니다.</div>
      ) : (
        chatRooms.map((room) => (
          <div
            key={room.chatroomId}
            className="chat-list-item"
            onClick={() => handleEnterRoom(room.chatroomId)}
          >
            <div className="chat-title">{room.opponentName}</div>
            <div className="chat-preview">
              <span>{room.lastMessage}</span>
              <span className="chat-time">
                {new Date(room.lastTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {room.unreadCount > 0 && (
              <div className="unread-badge">{room.unreadCount}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
