import axiosInstance from "../utils/axiosInstance";

const ImageService = {
    uploadImage: async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axiosInstance.post("/image-upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteImage: async (imageUrl) => {
        const response = await axiosInstance.delete("/delete-image", {
            params: { imageUrl },
        });
        return response.data;
    },
};

export default ImageService;
