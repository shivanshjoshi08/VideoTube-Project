
import api from "../utils/api.js";

class CommentService {
    async getVideoComments(videoId, page = 1, limit = 10) {
        return api.get(`/comments/${videoId}?page=${page}&limit=${limit}`);
    }

    async addComment(videoId, content) {
        return api.post(`/comments/${videoId}`, { content });
    }

    async updateComment(commentId, content) {
        return api.patch(`/comments/c/${commentId}`, { content });
    }

    async deleteComment(commentId) {
        return api.delete(`/comments/c/${commentId}`);
    }
}

export default new CommentService();
