import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import Language from "../../Models/Language.js";
import BaseController from "./BaseController.js";
import Storage from "../../../lib/Storage.js";

class LanguagesController extends BaseController {

    static async getLanguages(req, res) {

        const datas = await Language.get();

        return view(res, "admin.languages.index", {
            ...await BaseController.boot(req),
            datas,
        });

    }

    static async getLanguagesNew(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = new Language();
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        return res.redirect("/admin/languages/edit?id=" + data.id);
    }

    static async getLanguagesEdit(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/languages");
        }
        const data = await Language.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/languages");
        }
        return view(res, "admin.languages.form", {
            ...await BaseController.boot(req),
            data,
        });
    }

    static async getLanguagesDelete(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/languages");
        }
        const data = await Language.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/languages");
        }
        await data.delete();
        return res.redirect("/admin/languages");
    }

    static async postLanguagesEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Language.where({ "id": req.query.id }).first();
        data.name = req.body.name;
        data.code = req.body.code;
        
        if (req.body.icon)
            Storage.put(req.body.icon, "/img/langs", `${req.body.code}.svg`);
        
        if (req.body.json_file)
            Storage.put(req.body.json_file, "/upload_files/langs", `${req.body.code}.json`);

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

export default LanguagesController;