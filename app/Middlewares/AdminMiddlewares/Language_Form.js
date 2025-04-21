import Validator from "../../../lib/Validator.js";
import Language from "../../Models/Language.js";

class AdminLanguageFormMiddleware {

    static async handler (req, res) {
        const data = await Language.where({"id": req.query.id}).first();
        if (!data) {
            return res.send({
                "status": "failed",
                "message": "No such data was found.",
                "reloadPage": true,
                "timeout": 5000,
            });
        }
        const validate = Validator.make(req.body, {
            "name": "required|string",
            "code": "required|string",
            "icon": "nullable|file|mimes:svg",
            "json_file": "nullable|file|mimes:json",
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

export default AdminLanguageFormMiddleware;