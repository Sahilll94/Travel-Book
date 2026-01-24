import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

const ContributorService = {
    getContributors: async () => {
        const response = await axiosInstance.get("/contributors");
        return response.data;
    },

    getGithubPRs: async () => {
        const response = await axios.get(
            "https://api.github.com/search/issues?q=repo:Sahilll94/Travel-Book+type:pr"
        );
        return response.data;
    },

    getGithubCommits: async () => {
        // We only need headers to get the link header, so we return the full response
        const response = await axios.get(
            "https://api.github.com/repos/Sahilll94/Travel-Book/commits?per_page=1"
        );
        return response;
    },

    getAdminContributors: async (params) => {
        const response = await axiosInstance.get("/admin/contributors", { params });
        return response.data;
    },

    updateContributorStatus: async (contributorId, data) => {
        const response = await axiosInstance.put(`/contributors/${contributorId}/status`, data);
        return response.data;
    },

    deleteContributor: async (contributorId) => {
        const response = await axiosInstance.delete(`/contributors/${contributorId}`);
        return response.data;
    },

    addContributor: async (data) => {
        const response = await axiosInstance.post("/contributors/submit", data);
        return response.data;
    },
};

export default ContributorService;
