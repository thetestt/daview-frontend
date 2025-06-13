import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/components/ChatRoomList.css";

const ChatRoomList = ({ currentUser }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/chat/rooms?memberId=${currentUser.memberId}`)
      .then((res) => setChatRooms(res.data))
      .catch((err) => console.error("❌ 채팅방 목록 로딩 실패:", err));
  }, [currentUser.memberId]);

  const goToChatRoom = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
  };

  return (
    <div className="chat-room-list">
      <h2>💬 채팅 목록</h2>
      {chatRooms.map((room) => (
        <div
          key={room.chatroomId}
          className="chat-room-item"
          onClick={() => goToChatRoom(room.chatroomId)}
        >
          <div className="opponent">{room.opponentName}</div>
          <div className="last-message">
            {room.lastMessage || "대화를 시작해보세요"}
          </div>
          <div className="time">{room.lastTime?.substring(11, 16)}</div>
          {room.unreadCount > 0 && (
            <div className="unread-badge">{room.unreadCount}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
