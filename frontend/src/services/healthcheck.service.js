
import api from "../utils/api.js";

class HealthcheckService {
    async healthcheck() {
        return api.get("/healthcheck");
    }
}

export default new HealthcheckService();
