import axios from "./axiosInstance";

// ✅ 1. 전체 채팅방 목록 불러오기
export const getChatRooms = async (memberId) => {
  const res = await axios.get(`/api/chat/rooms?memberId=${memberId}`);
  return res.data;
};

// ✅ 2. 특정 채팅방의 메시지 목록 불러오기
export const getMessages = async (chatroomId) => {
  const response = await axios.get(`/api/chat/rooms/${chatroomId}/messages`);
  return response.data;
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

// ✅ 4. 단일 채팅방 정보 가져오기 (메시지 수신 시 리스트 갱신용)
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
