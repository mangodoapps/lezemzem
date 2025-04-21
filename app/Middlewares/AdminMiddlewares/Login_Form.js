import Auth from "../../../lib/Auth.js";
import lang from "../../../lib/Lang.js";
import Validator from "../../../lib/Validator.js";


class AdminLoginFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "email": "required|email",
            "password": "required|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": lang(req, 'admin.main.Please fill out the form as required'),
            });
        }
        const check = await Auth.guard("admin").check({
            "email": req.body.email,
            "password": req.body.password,
            "status": "active",
        });
        if (!check) {
            return res.send({
                "status": "failed",
                "message": lang(req, 'admin.main.Incorrect username or password'),
            });
        }
    }

}

export default AdminLoginFormMiddleware;