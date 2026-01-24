import axiosInstance from "../utils/axiosInstance";

const AuthService = {
    login: async (email, password) => {
        const response = await axiosInstance.post("/login", {
            email,
            password,
        });
        return response.data;
    },

    sendLoginOtp: async (email) => {
        const response = await axiosInstance.post("/send-login-otp", {
            email,
        });
        return response.data;
    },

    verifyLoginOtp: async (email, otp) => {
        const response = await axiosInstance.post("/verify-login-otp", {
            email,
            otp,
        });
        return response.data;
    },

    resendOtp: async (email, isSignup) => {
        const response = await axiosInstance.post("/resend-otp", {
            email,
            isSignup,
        });
        return response.data;
    },

    sendSignupOtp: async (fullName, email, password) => {
        const response = await axiosInstance.post("/send-signup-otp", {
            fullName,
            email,
            password,
        });
        return response.data;
    },

    verifySignupOtp: async (email, otp) => {
        const response = await axiosInstance.post("/verify-signup-otp", {
            email,
            otp,
        });
        return response.data;
    },

    getUser: async () => {
        const response = await axiosInstance.get("/get-user");
        return response.data;
    },

    getUserProfile: async () => {
        const response = await axiosInstance.get("/profile");
        return response.data;
    },

    updateUserProfile: async (data) => {
        const response = await axiosInstance.put("/update-profile", data);
        return response.data;
    },

    updateProfileImage: async (formData) => {
        const response = await axiosInstance.put("/update-profile-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getPublicProfile: async (userId) => {
        const response = await axiosInstance.get(`/user-profile/${userId}`);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axiosInstance.post("/forgot-password", { email });
        return response.data;
    },

    resetPassword: async (email, token, newPassword) => {
        const response = await axiosInstance.post("/reset-password", {
            email,
            token,
            newPassword,
        });
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await axiosInstance.post("/change-password", {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    googleAuth: async (data) => {
        const response = await axiosInstance.post("/google-auth", data);
        return response.data;
    },

    githubAuth: async (data) => {
        const response = await axiosInstance.post("/github-auth", data);
        return response.data;
    },

    twitterAuth: async (data, token) => {
        const response = await axiosInstance.post("/twitter-auth", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export default AuthService;
