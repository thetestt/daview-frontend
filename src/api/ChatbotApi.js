import axios from "axios";

const chatbotApi = axios.create({
  baseURL: "/api/chatbot",
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendMessage = (message) => {
  return chatbotApi.post("/message", { message });
};
