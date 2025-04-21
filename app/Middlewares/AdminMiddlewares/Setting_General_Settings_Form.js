import Validator from "../../../lib/Validator.js";
import Setting from "../../Models/Setting.js";

class SettingGeneralSettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "business_name": "required|string|min:1",
            "site_title": "required|array|min:1",
            "site_title.*": "required|string",
            "site_description": "required|array|min:1",
            "site_description.*": "required|string",
            "logo": "nullable|file|mimes:png",
            "favicon": "nullable|file|mimes:ico",
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

export default SettingGeneralSettingsFormMiddleware;