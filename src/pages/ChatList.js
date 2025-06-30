import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChatRooms } from "../api/chat";
import styles from "../styles/pages/ChatList.module.css";

const ChatList = ({ refresh, readChatroomIds, onNewMessage }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const memberId = Number(localStorage.getItem("memberId"));
  const { chatroomId: selectedIdFromParams } = useParams();
  const location = useLocation();
  //검색 랜더링
  const [searchTerm, setSearchTerm] = useState("");

  const selectedChatroomId =
    location.pathname.startsWith("/chat/") && selectedIdFromParams
      ? selectedIdFromParams
      : null;

  // 💬 채팅방 리스트 불러오기
  const loadChatRooms = useCallback(async () => {
    try {
      const rooms = await getChatRooms(memberId);
      const uniqueRooms = Array.from(
        new Map(rooms.map((room) => [room.chatroomId, room])).values()
      );
      const sortedRooms = uniqueRooms.sort(
        (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
      );
      setChatRooms(sortedRooms);
    } catch (err) {
      console.error("❌ 채팅방 목록 로딩 실패:", err);
    }
  }, [memberId]);

  // ✅ WebSocket 연결 및 채팅방 갱신 처리
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
        stompClient.subscribe(`/sub/chat/roomList/${memberId}`, () => {
          loadChatRooms(); // 수신 시 전체 새로고침
          onNewMessage?.();
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [memberId, navigate, loadChatRooms]);

  useEffect(() => {
    if (refresh) {
      loadChatRooms();
    }
  }, [refresh, loadChatRooms]);

  //클릭시 읽음처리
  const handleEnterRoom = async (chatroomId) => {
    navigate(`/chat/${chatroomId}?skipValidation=true`);
  };

  // // ✅ 읽음된 채팅방 ID는 무조건 unreadCount 0으로 보정
  // const displayedRooms = chatRooms.map((room) =>
  //   readChatroomIds.includes(room.chatroomId)
  //     ? { ...room, unreadCount: 0 }
  //     : room
  // );

  const displayedRooms = chatRooms;

  const getDisplayName = (room) => {
    const isSender = memberId === room.senderId;
    const opponentOut =
      (isSender && room.receiverTrashCan) || (!isSender && room.senderTrashCan);

    let name = "";
    if (room.type === "facility") {
      name = room.facilityName || room.opponentName || "이름없음";
    } else if (room.type === "caregiver") {
      name = room.opponentName
        ? `${room.opponentName} 요양사`
        : "이름없는 요양사";
    } else if (room.type === "user") {
      name = room.opponentName || "사용자";
    } else {
      name = room.opponentName || "알 수 없음";
    }

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

  const filteredRooms = displayedRooms.filter((room) => {
    const name = getDisplayName(room)?.props?.children?.[0] || ""; // opponentName
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = () => {
    // 필요 시 검색어를 서버로 보내거나, 검색어에 따라 필터링하도록 추가 가능
    // 지금은 searchTerm 값이 이미 상태로 저장돼 있으므로, 이 함수는 불필요한 재호출 방지용
    // 실질적으로는 searchTerm 상태 변화 시 filteredRooms가 자동 업데이트됨
    console.log("검색 실행:", searchTerm);
  };

  const handleBackToList = () => {
    navigate("/chat"); // ✅ 꺽쇠 버튼 클릭 시 리스트 페이지로 이동
  };

  return (
    <div>
      <div className={styles["chat-search-box"]}>
        <button className={styles["back-button"]} onClick={handleBackToList}>
          &lt;
        </button>
        <input
          type="text"
          placeholder="채팅방을 찾아보세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className={styles["chat-search-input"]}
        />
        <img
          src="/images/buttonimage/searchicon.png"
          alt="검색"
          className={styles["search-icon"]}
          onClick={handleSearch}
        />
      </div>
      <div className={styles["chat-list-container"]}>
        {filteredRooms.map((room) => {
          const isActive = String(room.chatroomId) === selectedChatroomId;
          const isRead = readChatroomIds?.includes(room.chatroomId); // ✅ 읽은 채팅방이면 뱃지 숨김

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
                  {room.sentAt
                    ? new Date(room.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>

              {/* ✅ 읽지 않은 메시지만 뱃지 표시 */}
              {!isRead && room.unreadCount > 0 && (
                <div className={styles["unread-badge"]}>{room.unreadCount}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
