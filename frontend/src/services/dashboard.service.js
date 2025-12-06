
import api from "../utils/api.js";

class DashboardService {
    async getChannelStats() {
        return api.get("/dashboard/stats");
    }

    async getChannelVideos() {
        return api.get("/dashboard/videos");
    }
}

export default new DashboardService();
