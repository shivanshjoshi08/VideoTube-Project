
import api from "../utils/api.js";

class LikeService {
    async toggleVideoLike(videoId) {
        return api.post(`/likes/toggle/v/${videoId}`);
    }

    async toggleCommentLike(commentId) {
        return api.post(`/likes/toggle/c/${commentId}`);
    }

    async toggleTweetLike(tweetId) {
        return api.post(`/likes/toggle/t/${tweetId}`);
    }

    async getLikedVideos() {
        return api.get("/likes/videos");
    }
}

export default new LikeService();
