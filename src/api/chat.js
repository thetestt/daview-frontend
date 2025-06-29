import axios from "./axiosInstance";

// ✅ 1. 전체 채팅방 목록 불러오기
export const getChatRooms = async (memberId) => {
  const res = await axios.get(`/api/chat/rooms?memberId=${memberId}`);
  return res.data;
};

// ✅ 2. 특정 채팅방의 메시지 목록 불러오기
export const getMessages = async (chatroomId, memberId) => {
  try {
    const res = await axios.get(`/api/chat/rooms/${chatroomId}/messages`, {
      params: { memberId },
    });
    return res.data || []; // <- null 방지!
  } catch (err) {
    console.error("❌ 채팅방 불러오기 실패:", err);
    return []; // <- 실패 시도 안전하게 빈 배열
  }
};

// ✅ 3. 기존 채팅방 찾기 or 없으면 생성하기
export const createOrGetChatRoom = async ({
  memberId,
  receiverId,
  facilityId,
}) => {
  const res = await axios.post("/api/chat/rooms/check-or-create", {
    memberId,
    receiverId,
    facilityId,
  });

  return res.data; // { chatroomId: "..." }
};

// ✅ 4. 단일 채팅방 상대방 정보 가져오기 (메시지 수신 시 리스트 갱신)
export const getChatRoomInfo = async (chatroomId, memberId) => {
  const res = await axios.get(`/api/chat/rooms/${chatroomId}/info`, {
    params: { memberId },
  });

  return res.data;
};

// ✅ 5. 채팅방 나가기 (trash_can 처리)
export const exitChatRoom = async (chatroomId, memberId) => {
  const res = await axios.put(`/api/chat/rooms/${chatroomId}/exit`, {
    memberId,
  });
  return res.data; // { success: true }
};

// // ✅ 6. 채팅방 입장 시 읽음 처리 API 추가
// export const markMessagesAsRead = async (chatroomId, memberId) => {
//   try {
//     console.log("📨 읽음 처리 백앤드호출!!!!!!!:", chatroomId, memberId);
//     await axios.post(`/api/chat/${chatroomId}/read`, null, {
//       params: { memberId },
//     });
//   } catch (err) {
//     console.error("❌ 메시지 읽음 처리 실패:", err);
//   }
// };

//채팅방 검증
export const verifyChatAccess = async (chatroomId, memberId) => {
  try {
    const res = await axios.get(`/api/chat/rooms/${chatroomId}/verify`, {
      params: { memberId },
    });
    return res.data.allowed; // 백엔드에서 allowed: true/false 형태로 응답한다고 가정
  } catch (err) {
    console.error("❌ 채팅방 접근 검증 실패:", err);
    return false;
  }
};
