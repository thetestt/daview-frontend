import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import axios from "../api/axiosInstance";

const ChatRoom = () => {
  const { chatroomId } = useParams();
  const [searchParams] = useSearchParams(); // 👈 URL 파라미터 접근
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(null); // 초기 null 상태
  const memberId = Number(localStorage.getItem("memberId"));
  const username = localStorage.getItem("username");

  const skipValidation = searchParams.get("skipValidation") === "true"; // 👈 검증 생략 여부 확인

  useEffect(() => {
    console.log("🚀 useEffect 실행 되는지 한번보자고");
    // ✅ 로그인하지 않았을 경우 접근 제한
    if (!memberId) {
      alert("권한이 없습니다.로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (skipValidation) {
      // 👈 ChatButton 통해 이동 시 validate 생략
      setAccessGranted(true);
      return;
    }

    const checkAccess = async () => {
      try {
        console.log("🔑 검사 요청 memberId:", memberId);
        console.log("🧾 memberId:", memberId, typeof memberId);
        const res = await axios.get(`/api/chat/rooms/${chatroomId}/validate`, {
          params: { memberId },
        });

        if (res.status === 200) {
          setAccessGranted(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          alert("🚫 이 채팅방에 접근할 수 없습니다.");
          setAccessGranted(false);
          navigate("/");
        } else {
          console.error("❌ 서버 오류 발생", err);
          alert("서버와의 연결에 문제가 있습니다.");
          setAccessGranted(false);
          navigate("/");
        }
      }
    };

    checkAccess();
  }, [chatroomId, memberId, navigate, skipValidation]);

  if (accessGranted === null) return <div>접근 확인 중...</div>;
  if (!accessGranted) return null;

  return (
    <div className="chat-room-container">
      <h2>채팅방 (ID: {chatroomId})</h2>
      <ChatWindow
        chatroomId={chatroomId}
        currentUser={{ memberId, username }}
      />
    </div>
  );
};

export default ChatRoom;
