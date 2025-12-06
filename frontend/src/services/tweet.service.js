
import api from "../utils/api.js";

class TweetService {
    async createTweet(content) {
        return api.post("/tweets", { content });
    }

    async getUserTweets(userId) {
        return api.get(`/tweets/user/${userId}`);
    }

    async updateTweet(tweetId, content) {
        return api.patch(`/tweets/${tweetId}`, { content });
    }

    async deleteTweet(tweetId) {
        return api.delete(`/tweets/${tweetId}`);
    }
}

export default new TweetService();
