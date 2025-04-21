import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import News from "../../Models/News.js";
import BaseController from "./BaseController.js";
import Language from "../../Models/Language.js";
import Media from "../../Models/Media.js";
import Setting from "../../Models/Setting.js";

class NewsSettingsController extends BaseController {

    static async getNewsSettingsEdit(req, res) {
        const data = await Setting.first();
        if (!data) {
            return res.redirect("/admin");
        }
        data.news_settings = data.news_settings ? JSON.parse(data.news_settings) : null;

        const languages = await Language.where({ "code": ["!=", null], "name": ["!=", null] }).get();
        return view(res, "admin.news.settings.form", {
            ...await BaseController.boot(req),
            data,
            languages,
        });
    }

    static async postNewsSettingsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Setting.first();
        if (data) {
            data.news_settings = JSON.stringify(req.body.news_settings);
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

export default NewsSettingsController;