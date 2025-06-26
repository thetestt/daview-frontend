import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import ChatList from "./ChatList";
import { getChatRoomInfo, markMessagesAsRead } from "../api/chat";
import axios from "../api/axiosInstance";
import styles from "../styles/pages/ChatRoom.module.css";

const ChatRoom = () => {
  const { chatroomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [accessGranted, setAccessGranted] = useState(null);
  const [chatTargetInfo, setChatTargetInfo] = useState(null);
  const memberId = Number(localStorage.getItem("memberId"));
  const username = localStorage.getItem("username");
  const [refreshList, setRefreshList] = useState(false);
  const triggerListRefresh = () => setRefreshList((prev) => !prev);

  const skipValidation = searchParams.get("skipValidation") === "true";

  useEffect(() => {
    if (!memberId) {
      alert("권한이 없습니다. 로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (skipValidation) {
      setAccessGranted(true);
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await axios.get(`/api/chat/rooms/${chatroomId}/validate`, {
          params: { memberId },
        });

        if (res.status === 200 && res.data.success) {
          setAccessGranted(true);
        }
      } catch (err) {
        alert("🚫 채팅방 접근 오류");
        navigate("/");
      }
    };

    checkAccess();
  }, [chatroomId, memberId, navigate, skipValidation]);

  useEffect(() => {
    if (accessGranted && chatroomId && memberId) {
      getChatRoomInfo(chatroomId, memberId)
        //상대방 정보 가져오기
        .then((data) => {
          console.log("프론트로 넘어온 데이터 여기서 받아야 하나보네 " + data);
          console.log(JSON.stringify(data, null, 2)); // data를 콘솔에 출력
          setChatTargetInfo(data);
        })
        .catch((err) => console.error("상대 정보 가져오기 실패", err));
      markMessagesAsRead(chatroomId, memberId);
    }
  }, [accessGranted, chatroomId, memberId]);

  if (chatroomId && accessGranted === null) return <div>접근 확인 중...</div>;
  if (chatroomId && !accessGranted) return null;

  return (
    <div className={styles["chatroom-layout"]}>
      <div className={styles["chatlist-area"]}>
        <ChatList refresh={refreshList} />
      </div>

      <div className={styles["chatwindow-area"]}>
        {chatTargetInfo && accessGranted ? (
          <ChatWindow
            chatroomId={chatroomId}
            currentUser={{ memberId, username }}
            chatTargetInfo={chatTargetInfo}
            //accessGranted={accessGranted}
            onExitChat={() => {
              setChatTargetInfo(null);
              triggerListRefresh();
            }}
          />
        ) : (
          <div className={styles["chat-exited-message"]}></div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
