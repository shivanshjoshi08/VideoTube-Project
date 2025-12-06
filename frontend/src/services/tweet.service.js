import api from '../utils/api';

class TweetService {
    async createTweet(content) {
        return api.post("/tweets", { content });
    }

    async getUserTweets() {
        return api.get("/tweets/user");
    }

    async updateTweet(tweetId, content) {
        return api.patch(`/tweets/${tweetId}`, { content });
    }

    async deleteTweet(tweetId) {
        return api.delete(`/tweets/${tweetId}`);
    }
}

export default new TweetService();
