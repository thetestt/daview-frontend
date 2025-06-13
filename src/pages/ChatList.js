import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms } from "../api/chat";

const ChatList = ({ currentUser }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);

  useEffect(() => {
    // ✅ 최초 채팅방 목록 로드
    getChatRooms(currentUser.memberId).then((data) => {
      const uniqueRooms = Array.from(
        new Map(data.map((room) => [room.chatroomId, room])).values()
      );
      setChatRooms(uniqueRooms);
    });

    // ✅ WebSocket 연결
    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("✅ ChatList WebSocket 연결됨");

        // ✅ 새 메시지 도착하면 채팅 목록 갱신
        stompClient.subscribe("/sub/chat/room", (message) => {
          console.log("📩 ChatList 받은 메시지!", message.body);

          getChatRooms(currentUser.memberId).then((data) => {
            const uniqueRooms = Array.from(
              new Map(data.map((room) => [room.chatroomId, room])).values()
            );
            setChatRooms(uniqueRooms);
          });
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [currentUser.memberId]);

  const handleEnterRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
  };

  return (
    <div className="chat-list-container">
      <h2>📂 채팅 목록</h2>
      {chatRooms.map((room) => (
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
      ))}
    </div>
  );
};

export default ChatList;
