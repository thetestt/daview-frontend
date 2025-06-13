import axios from "./axiosInstance";

export const getChatRooms = async (memberId) => {
  const res = await axios.get(`/api/chat/rooms?memberId=${memberId}`);
  return res.data;
};

export const getMessages = async (chatroomId) => {
  const response = await axios.get(`/api/chat/rooms/${chatroomId}/messages`);
  return response.data;
};
