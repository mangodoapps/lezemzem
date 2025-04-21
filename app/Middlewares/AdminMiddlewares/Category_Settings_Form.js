import Validator from "../../../lib/Validator.js";

class SolutionsSettingsFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "category_settings": "required|array",
            "category_settings.title": "nullable|array",
            "category_settings.description": "required|array",
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