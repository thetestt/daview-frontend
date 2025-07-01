import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import ChatList from "./ChatList";
import { getChatRooms } from "../api/chat"; // ✅ getChatRoomInfo 제거
import axios from "../api/axiosInstance";
import styles from "../styles/pages/ChatRoom.module.css";

const ChatRoom = () => {
  const { chatroomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [accessGranted, setAccessGranted] = useState(null);
  const [chatTargetInfo, setChatTargetInfo] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const memberId = Number(localStorage.getItem("memberId"));
  const username = localStorage.getItem("username");
  const [refreshList, setRefreshList] = useState(false);

  const skipValidation = searchParams.get("skipValidation") === "true";
  const triggerListRefresh = () => setRefreshList((prev) => !prev);

  //읽음표시 window에서 List로 전달하기
  const [readChatroomIds, setReadChatroomIds] = useState([]);

  //✅ 읽음 추가/제거 함수:
  const markChatroomAsRead = (chatroomId) => {
    setReadChatroomIds((prev) =>
      prev.includes(chatroomId) ? prev : [...prev, chatroomId]
    );
  };

  const removeChatroomFromRead = (chatroomId) => {
    setReadChatroomIds((prev) => prev.filter((id) => id !== chatroomId));
  };

  //✅ 채팅방 진입 시 읽음 등록:
  useEffect(() => {
    if (chatroomId) {
      markChatroomAsRead(chatroomId);
    }
  }, [chatroomId]);

  //✅ 채팅방 나갈 때 제거 (언마운트 시):
  useEffect(() => {
    return () => {
      if (chatroomId) {
        removeChatroomFromRead(chatroomId);
      }
    };
  }, [chatroomId]);

  const handleNewMessage = () => {
    triggerListRefresh(); // ChatList 다시 불러오기
  };

  useEffect(() => {
    if (!memberId) {
      alert("권한이 없습니다. 로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (!chatroomId) {
      setAccessGranted(true); // 리스트만 보여주기 허용
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

  // 💡 chatroomId 변경 시 대상 정보 초기화
  useEffect(() => {
    setChatTargetInfo(null);
  }, [chatroomId]);

  // ✅ chatRooms 불러와서 현재 채팅방 대상 정보 찾기
  useEffect(() => {
    if (accessGranted && memberId && chatroomId) {
      getChatRooms(memberId)
        .then((rooms) => {
          setChatRooms(rooms);
          const matchedRoom = rooms.find(
            (room) => String(room.chatroomId) === String(chatroomId)
          );
          if (matchedRoom) setChatTargetInfo(matchedRoom);
        })
        .catch((err) => {
          console.error("채팅방 목록 불러오기 실패:", err);
        });
    }
  }, [accessGranted, chatroomId, memberId]);

  useEffect(() => {
    if (chatTargetInfo) {
      console.log("✅ chatwindow. chatTargetInfo 전달 값:", chatTargetInfo);
    }
  }, [chatTargetInfo]);

  if (chatroomId && accessGranted === null) return <div>접근 확인 중...</div>;
  if (chatroomId && !accessGranted) return null;

  return (
    <div className={styles["chatroom-layout"]} style={{ display: "flex" }}>
      <div className={styles["chatlist-area"]}>
        <ChatList
          refresh={refreshList}
          readChatroomIds={readChatroomIds}
          onNewMessage={handleNewMessage}
          removeChatroomFromRead={removeChatroomFromRead}
        />
      </div>

      <div className={styles["chatwindow-area"]}>
        {chatTargetInfo && accessGranted ? (
          <ChatWindow
            key={chatroomId}
            chatroomId={chatroomId}
            currentUser={{ memberId, username }}
            chatTargetInfo={chatTargetInfo}
            onNewMessage={handleNewMessage}
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
