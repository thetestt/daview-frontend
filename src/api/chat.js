import axios from "./axiosInstance";

export const getChatRooms = async (memberId) => {
  const res = await axios.get(`/api/chat/rooms?memberId=${memberId}`);
  return res.data;
};

export const getMessages = async (chatroomId) => {
  const response = await axios.get(`/api/chat/rooms/${chatroomId}/messages`);
  return response.data;
};

export const createOrGetChatRoom = async ({ memberId, receiverId }) => {
  const res = await fetch("/api/chat/rooms/check-or-create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ memberId, receiverId }),
  });

  if (!res.ok) throw new Error("채팅방 확인/생성 실패");
  return res.json(); // { chatroomId: "..." }
};
