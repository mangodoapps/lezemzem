import Validator from "../../../lib/Validator.js";
import Admin from "../../Models/Admin.js";

class ProfileAccountFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "name_surname": "required|string",
            "phone": "required|string",
            "email": "required|email",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }

        const emailCheck = await Admin.whereNotIn("id", [req.query.id]).where({
            "email": req.body.email
        }).first();
        if (emailCheck) {
            return res.send({
                "status": "failed",
                "message": "This email address is already in use.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
    }

}

export default ProfileAccountFormMiddleware;