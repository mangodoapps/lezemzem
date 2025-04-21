import Validator from "../../../lib/Validator.js";
import Category from "../../Models/Category.js";

class CategoryFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "title": "required|array",
            "title.*": "required|string",
            "description": "required|array",
            "description.*": "required|string",
            "url": "required|string",
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
        const data = await Category.where({"id": req.query.id, "parent": "solution"}).first();
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

export default CategoryFormMiddleware;