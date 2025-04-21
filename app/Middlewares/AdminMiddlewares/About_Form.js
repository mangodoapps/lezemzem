import Validator from "../../../lib/Validator.js";
import Category from "../../Models/Category.js";
import Solution from "../../Models/Solution.js";

class AboutFormMiddleware {

    static async handler(req, res) {
        const validate = Validator.make(req.body, {
            "title": "required|array",
            "title.*": "required|string",

            "description": "required|array",
            "description.*": "required|string",

            "section_1_title": "required|array",
            "section_1_title.*": "required|string",

            "section_1_description": "required|array",
            "section_1_description.*": "required|string",

            "section_2_title": "required|array",
            "section_2_title.*": "required|string",

            "section_2_description": "required|array",
            "section_2_description.*": "required|string",
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

export default AboutFormMiddleware;