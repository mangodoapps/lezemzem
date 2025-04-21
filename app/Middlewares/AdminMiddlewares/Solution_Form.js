import Validator from "../../../lib/Validator.js";
import Category from "../../Models/Category.js";
import Solution from "../../Models/Solution.js";

class SolutionFormMiddleware {

    static async handler(req, res) {
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
        const data = await Solution.find(req.query.id);
        if (!data) {
            return res.send({
                "status": "failed",
                "message": "No such data was found.",
                "reloadPage": true,
                "timeout": 5000,
            });
        }
        if (req.body.categories)
            for (let i = 0; i < req.body.categories.length; i++) {
                const categoryExists = await Category.where({ "id": req.body.categories[i], "parent": "solution" }).first();
                if (!categoryExists) {
                    return res.send({
                        "status": "failed",
                        "message": `Category with ID ${req.body.categories[i]} does not exist in the database.`,
                        "reloadPage": false,
                        "timeout": 5000,
                    });
                }
            }

    }

}

export default SolutionFormMiddleware;