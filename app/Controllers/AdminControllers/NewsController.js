import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import News from "../../Models/News.js";
import BaseController from "./BaseController.js";
import Language from "../../Models/Language.js";
import Media from "../../Models/Media.js";

class NewsController extends BaseController {

    static async getNews(req, res) {

        const datas = await News.get();

        return view(res, "admin.news.index", {
            ...await BaseController.boot(req),
            datas,
        });

    }

    static async getNewsNew(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = new News();
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        return res.redirect("/admin/news/edit?id=" + data.id);
    }

    static async getNewsEdit(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/news");
        }
        const data = await News.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/news");
        }
        data.other_settings = JSON.parse(data.other_settings);
        if (data?.other_settings?.banner) {
            const media = await Media.find(data.other_settings.banner);
            data.other_settings.banner = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
            data.other_settings.banner_id = media.id;

        }
        const languages = await Language.where({"code": ["!=", null], "name": ["!=", null]}).get();
        return view(res, "admin.news.form", {
            ...await BaseController.boot(req),
            data,
            languages,
        });
    }

    static async getNewsDelete(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/news");
        }
        const data = await News.find(req.query.id);
        if (!data) {
            return res.redirect("/admin/news");
        }
        await data.delete();
        return res.redirect("/admin/news");
    }

    static async postNewsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await News.where({ "id": req.query.id }).first();

        data.title = JSON.stringify(req.body.title);
        data.subtitle = JSON.stringify(req.body.subtitle);
        data.description = JSON.stringify(req.body.description);
        data.content = JSON.stringify(req.body.content);
        const otherSettings = (data.other_settings ? JSON.parse(data.other_settings) : {});
        otherSettings["banner"] = req.body.banner;
        data.other_settings = JSON.stringify(otherSettings);
        const seo_check = await News.select("id").whereNotIn("id", [req.query.id]).where({ "seo_url": req.body.url }).get();
        if (Object.keys(seo_check).length !== 0) {
            data.seo_url = req.body.url + "-" + DateTime.getTime();
        }
        else {
            data.seo_url = req.body.url;
        }
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

export default NewsController;