import axiosInstance from "../utils/axiosInstance";

const ChatService = {
    sendMessage: async (message, conversationHistory) => {
        const response = await axiosInstance.post("/chat", {
            message,
            conversationHistory,
        });
        return response.data;
    },
};

export default ChatService;
