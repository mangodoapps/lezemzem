import Auth from "../../../lib/Auth.js";
import Hash from "../../../lib/Hash.js";
import Validator from "../../../lib/Validator.js";

class ProfileChangePasswordFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "old_password": "required|string",
            "new_password": "required|string|min:8",
            "new_password_repeat": "required|string|min:8",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        if (req.body.new_password !== req.body.new_password_repeat) {
            return res.send({
                "status": "failed",
                "message": "The new passwords you entered do not match each other.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        const user = await Auth.guard("admin").user(req);
        if (!Hash.check(req.body.old_password, user.password)) {
            return res.send({
                "status": "failed",
                "message": "You entered your old password incorrectly.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
    }

}

export default ProfileChangePasswordFormMiddleware;