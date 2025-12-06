
import api from "../utils/api.js";

class SubscriptionService {
    async getSubscribedChannels(channelId) {
        return api.get(`/subscriptions/c/${channelId}`);
    }

    async getUserChannelSubscribers(subscriberId) {
        return api.get(`/subscriptions/u/${subscriberId}`);
    }

    async toggleSubscription(channelId) {
        return api.post(`/subscriptions/c/${channelId}`);
    }
}

export default new SubscriptionService();
