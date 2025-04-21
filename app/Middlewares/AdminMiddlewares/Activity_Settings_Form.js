import Validator from "../../../lib/Validator.js";
import News from "../../Models/News.js";

class ActivitySettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "activity_settings": "required|array",
            "activity_settings.title": "nullable|array",
            "activity_settings.description": "required|array",
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

export default ActivitySettingsFormMiddleware;