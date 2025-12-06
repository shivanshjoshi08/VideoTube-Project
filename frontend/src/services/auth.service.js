
import api from "../utils/api.js";

class AuthService {
    async register(data) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key]) formData.append(key, data[key]);
        });
        return api.post("/users/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async login(data) {
        return api.post("/users/login", data);
    }

    async logout() {
        return api.post("/users/logout");
    }

    async refreshAccessToken() {
        return api.post("/users/refresh-token");
    }

    async changePassword(data) {
        return api.post("/users/change-password", data);
    }

    async getCurrentUser() {
        return api.get("/users/current-user");
    }

    async updateAccount(data) {
        return api.patch("/users/update-account", data);
    }

    async updateAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);
        return api.patch("/users/update-avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async updateCoverImage(file) {
        const formData = new FormData();
        formData.append("coverImage", file);
        return api.patch("/users/update-cover-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async getUserChannelProfile(username) {
        return api.get(`/users/c/${username}`);
    }

    async getWatchHistory() {
        return api.get("/users/history");
    }
}

export default new AuthService();
