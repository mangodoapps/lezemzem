import Validator from "../../../lib/Validator.js";
import News from "../../Models/News.js";

class SolutionsSettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "solutions_settings": "required|array",
            "solutions_settings.title": "nullable|array",
            "solutions_settings.description": "required|array",
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

export default SolutionsSettingsFormMiddleware;