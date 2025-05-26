import React from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

const ChatRoom = () => {
  const { chatroomId } = useParams(); // /chat/:chatroomId
  const currentUser = { memberId: 100, username: "나" }; // 로그인 사용자라고 가정

  return (
    <div className="chat-room-container">
      <h2>채팅방 (ID: {chatroomId})</h2>
      <ChatWindow chatroomId={chatroomId} currentUser={currentUser} />
    </div>
  );
};

export default ChatRoom;
