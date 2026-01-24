import axiosInstance from "../utils/axiosInstance";

const StoryService = {
    getAllStories: async () => {
        const response = await axiosInstance.get("/get-all-stories");
        return response.data;
    },

    addStory: async (data) => {
        const response = await axiosInstance.post("/add-travel-story", data);
        return response.data;
    },

    editStory: async (id, data) => {
        const response = await axiosInstance.put(`/edit-story/${id}`, data);
        return response.data;
    },

    deleteStory: async (id) => {
        const response = await axiosInstance.delete(`/delete-story/${id}`);
        return response.data;
    },

    searchStories: async (query) => {
        const response = await axiosInstance.get(`/search?query=${query}`);
        return response.data;
    },

    filterStories: async (startDate, endDate) => {
        const response = await axiosInstance.get(
            `/travel-stories-filter?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    updateIsFavourite: async (id, isFavourite) => {
        const response = await axiosInstance.put(`/update-is-favourite/${id}`, {
            isFavourite,
        });
        return response.data;
    },

    updateShowOnProfile: async (id, showOnProfile) => {
        const response = await axiosInstance.put(`/toggle-show-on-profile/${id}`, {
            showOnProfile,
        });
        return response.data;
    },

    advancedSearch: async (data) => {
        const response = await axiosInstance.post("/advanced-search", data);
        return response.data;
    },

    getTotalStories: async () => {
        const response = await axiosInstance.get("/total-stories");
        return response.data;
    },

    getPublicStoryById: async (id) => {
        // Note: This endpoint seems to be under /api/story/ based on StoryDetails.jsx
        // Assuming axiosInstance baseURL is the root API URL.
        const response = await axiosInstance.get(`/api/story/${id}`);
        return response.data;
    },
};

export default StoryService;
