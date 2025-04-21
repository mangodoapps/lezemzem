import Auth from "../../../lib/Auth.js";

class BaseController {

    static async boot(req) {
        const user = await Auth.guard("admin").user(req);
        if (process.env.APP_DEV == 'true')
            req.language = "tr";
        else
            req.language = req.headers['x-custom-header'].split(".")[0];
        return {
            req,
            user
        }
    }

}

export default BaseController;