import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import Solution from "../../Models/Solution.js";
import Category from "../../Models/Category.js";
import Media from "../../Models/Media.js";
import Language from "../../Models/Language.js";
import BaseController from "./BaseController.js";

class SolutionsController extends BaseController {

    static async getSolutions(req, res) {

        const user = await Auth.guard("admin").user(req);
        const datas = await Solution.get();

        return view(res, "admin.solutions.index", {
            ...await BaseController.boot(req),
            datas,
        });

    }

    static async getSolutionsNew(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = new Solution();
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        return res.redirect("/admin/solutions/edit?id=" + data.id);
    }

    static async getSolutionsEdit(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/solutions");
        }
        const data = await Solution.where({ "id": req.query.id }).first();
        const languages = await Language.where({"code": ["!=", null], "name": ["!=", null]}).get();
        const categories = await Category.where({ "title": ["!=", null], "parent": "solution" }).get();
        if (!data) {
            return res.redirect("/admin/solutions");
        }
        data.other_settings = JSON.parse(data.other_settings);
        if (data?.other_settings?.banner) {
            const media = await Media.find(data.other_settings.banner);
            data.other_settings.banner = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
            data.other_settings.banner_id = media.id;

        }
        return view(res, "admin.solutions.form", {
            ...await BaseController.boot(req),
            data,
            languages,
            categories
        });
    }

    static async getSolutionsDelete(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/solutions");
        }
        const data = await Solution.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/solutions");
        }
        await data.delete();
        return res.redirect("/admin/solutions");
    }

    static async postSolutionsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Solution.where({ "id": req.query.id }).first();

        data.title = JSON.stringify(req.body.title);
        data.subtitle = JSON.stringify(req.body.subtitle);
        data.description = JSON.stringify(req.body.description);
        data.content = JSON.stringify(req.body.content);
        const otherSettings = (data.other_settings ? JSON.parse(data.other_settings) : {});
        otherSettings["banner"] = req.body.banner;
        data.other_settings = JSON.stringify(otherSettings);
        const seo_check = await Solution.select("id").whereNotIn("id", [req.query.id]).where({ "seo_url": req.body.url }).get();
        if (Object.keys(seo_check).length !== 0) {
            data.seo_url = req.body.url + "-" + DateTime.getTime();
        }
        else {
            data.seo_url = req.body.url;
        }
        data.category_id = req.body.categories ? JSON.stringify(req.body.categories) : null;
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

export default SolutionsController;