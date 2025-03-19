import Authentication from "./Middlewares/Authentication.js";
import Guest from "./Middlewares/Guest.js";

export default {

    // Route Middlewares
    routeMiddlewares: {
        "guest": Guest,
        "auth": Authentication,
    }

}