import Validator from "../../../lib/Validator.js";
import Setting from "../../Models/Setting.js";

class SettingSocialMediaFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "social_media": "required|array|min:5",
            "social_media.*": "nullable|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        const data = Setting.first();
        if (!data) {
            return res.send({
                "status": "failed",
                "message": "No such data was found.",
                "reloadPage": true,
                "timeout": 5000,
            });
        }
    }

}

export default SettingSocialMediaFormMiddleware;