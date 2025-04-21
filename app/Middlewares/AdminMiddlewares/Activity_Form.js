import Validator from "../../../lib/Validator.js";
import Activity from "../../Models/Activity.js";

class ActivityFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "title": "required|array",
            "title.*": "required|string",
            "description": "required|array",
            "description.*": "required|string",
            "url": "required|string",
            "categories": "nullable|array",
            "categories.*": "required|integer|min:1",
            "banner": "required|integer",
            "content": "required|array",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        const data = await Activity.find(req.query.id);
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

export default ActivityFormMiddleware;