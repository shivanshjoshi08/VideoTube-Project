
import api from "../utils/api.js";

class PlaylistService {
    async createPlaylist(data) {
        return api.post("/playlist", data);
    }

    async getPlaylistById(playlistId) {
        return api.get(`/playlist/${playlistId}`);
    }

    async updatePlaylist(playlistId, data) {
        return api.patch(`/playlist/${playlistId}`, data);
    }

    async deletePlaylist(playlistId) {
        return api.delete(`/playlist/${playlistId}`);
    }

    async addVideoToPlaylist(videoId, playlistId) {
        return api.patch(`/playlist/add/${videoId}/${playlistId}`);
    }

    async removeVideoFromPlaylist(videoId, playlistId) {
        return api.patch(`/playlist/remove/${videoId}/${playlistId}`);
    }

    async getUserPlaylists(userId) {
        return api.get(`/playlist/user/${userId}`);
    }
}

export default new PlaylistService();
