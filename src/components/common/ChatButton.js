import React from "react";
import { useNavigate } from "react-router-dom";
import { createOrGetChatRoom } from "../../api/chat"; // API 함수

const ChatButton = ({ facilityId, receiverId }) => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");

  const handleChatClick = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await createOrGetChatRoom({
        memberId,
        receiverId,
      });

      console.log("🔥 ChatButton Props:", { memberId, receiverId });

      navigate(`/chat/${res.chatroomId}`);
    } catch (err) {
      console.error("❌ 채팅방 진입 실패:", err);
      alert("채팅방 열기에 실패했습니다.");
    }
  };

  return <button onClick={handleChatClick}>1:1 문의</button>;
};

export default ChatButton;
