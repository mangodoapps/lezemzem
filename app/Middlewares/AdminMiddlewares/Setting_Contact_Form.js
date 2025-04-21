import Validator from "../../../lib/Validator.js";
import Setting from "../../Models/Setting.js";

class SettingContactFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "contact_email": "nullable|string",
            "contact_phone": "nullable|string",
            "contact_address": "nullable|string",
            "contact_working_hours": "nullable|array",
            "contact_working_hours.*": "nullable|string",
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

export default SettingContactFormMiddleware;