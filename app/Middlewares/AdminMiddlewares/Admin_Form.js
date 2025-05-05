import Validator from "../../../lib/Validator.js";
import lang from "../../../lib/Lang.js";
import Admin from "../../Models/Admin.js";

class AdminAdminFormMiddleware {

    static async handler (req, res) {
        const data = await Admin.where({"id": req.query.id}).first();
        if (!data) {
            return res.send({
                "status": "failed",
                "message": lang(req, 'admin.main.No such data was found'),
                "reloadPage": true,
                "timeout": 5000,
            });
        }
        const validate = Validator.make(req.body, {
            "name_surname": "required|string",
            "email": "required|email",
            "password": "nullable|string",
            "phone": "required|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": lang(req, 'admin.main.Please fill out the form as required'),
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
                "message": lang(req, 'admin.main.This email address is already in use'),
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        
    }

}

export default AdminAdminFormMiddleware;