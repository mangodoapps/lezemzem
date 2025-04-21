import Auth from "../../../lib/Auth.js";
import Hash from "../../../lib/Hash.js";
import BaseController from "./BaseController.js";

class ProfileController extends BaseController {

    static async getHome (req, res) {
        return view(res, "admin.profile.form", {
            ...await BaseController.boot(req),
        });
    }

    static async postAccount (req, res) {
        const data = await Auth.guard("admin").user(req);
        data.name_surname = req.body.name_surname;
        data.email = req.body.email;
        data.phone = req.body.phone;
        data.editor = 1;
        data.edited_at = new Date().getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

    static async postChangePassword (req, res) {
        const data = await Auth.guard("admin").user(req);
        data.password = Hash.make(req.body.new_password);
        data.editor = 1;
        data.edited_at = new Date().getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

}

export default ProfileController;