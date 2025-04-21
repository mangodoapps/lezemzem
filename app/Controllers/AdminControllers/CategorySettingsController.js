import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import BaseController from "./BaseController.js";
import Language from "../../Models/Language.js";
import Media from "../../Models/Media.js";
import Setting from "../../Models/Setting.js";

class CategorySettingsController extends BaseController {

    static async getCategorySettingsEdit(req, res) {
        const data = await Setting.first();
        if (!data) {
            return res.redirect("/admin");
        }
        data.category_settings = data.category_settings ? JSON.parse(data.category_settings) : null;

        const languages = await Language.where({ "code": ["!=", null], "name": ["!=", null] }).get();
        return view(res, "admin.categories.settings.form", {
            ...await BaseController.boot(req),
            data,
            languages,
        });
    }

    static async postCategorySettingsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Setting.first();
        if (data) {
            data.category_settings = JSON.stringify(req.body.category_settings);
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

        return res.send({
            "success": "failed",
            "message": "Settings not found.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

}

export default CategorySettingsController;