
import api from "../utils/api.js";

class VideoService {
    async getAllVideos(query = {}) {
        const params = new URLSearchParams(query).toString();
        return api.get(`/videos?${params}`);
    }

    async publishVideo(data) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key]) formData.append(key, data[key]);
        });
        return api.post("/videos", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async getVideoById(videoId) {
        return api.get(`/videos/${videoId}`);
    }

    async deleteVideo(videoId) {
        return api.delete(`/videos/${videoId}`);
    }

    async updateVideo(videoId, data) {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        return api.patch(`/videos/${videoId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async togglePublishStatus(videoId) {
        return api.patch(`/videos/toggle/publish/${videoId}`);
    }
}

export default new VideoService();
