import Validator from "../../../lib/Validator.js";
import News from "../../Models/News.js";

class NewsSettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "news_settings": "required|array",
            "news_settings.title": "nullable|array",
            "news_settings.description": "required|array",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
    }

}

export default NewsSettingsFormMiddleware;