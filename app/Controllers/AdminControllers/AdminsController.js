import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import Admin from "../../Models/Admin.js";
import BaseController from "./BaseController.js";
import Hash from "../../../lib/Hash.js";

class AdminsController extends BaseController {

    static async getAdmins(req, res) {

        const datas = await Admin.get();

        return view(res, "admin.admins.index", {
            ...await BaseController.boot(req),
            datas,
        });

    }

    static async getAdminsNew(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = new Admin();
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        return res.redirect("/admin/admins/edit?id=" + data.id);
    }

    static async getAdminsEdit(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/admins");
        }
        const data = await Admin.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/admins");
        }
        return view(res, "admin.admins.form", {
            ...await BaseController.boot(req),
            data,
        });
    }

    static async getAdminsDelete(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/admins");
        }
        const data = await Admin.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/admins");
        }
        await data.delete();
        return res.redirect("/admin/admins");
    }

    static async postAdminsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Admin.where({ "id": req.query.id }).first();
        data.name_surname = req.body.name_surname;
        data.email = req.body.email;
        data.phone = req.body.phone;
        data.password = req.body.password ? Hash.make(req.body.password) : data.password;
        data.status = (req.body.status ? "active" : "deactive");
        data.editor = user.id;
        data.edited_at = DateTime.getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

}

export default AdminsController;