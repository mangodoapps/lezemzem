import Mail from "../../../lib/Mail.js";
import Validator from "../../../lib/Validator.js";
import Setting from "../../Models/Setting.js";

class SettingIntegrationsSettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "site_key": "required|string",
            "secret_key": "required|string",
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

export default SettingIntegrationsSettingsFormMiddleware;