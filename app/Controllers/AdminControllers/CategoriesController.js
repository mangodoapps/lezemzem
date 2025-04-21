import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import Solution from "../../Models/Solution.js";
import Category from "../../Models/Category.js";
import BaseController from "./BaseController.js";
import Language from "../../Models/Language.js";
import Media from "../../Models/Media.js";

class CategoriesController extends BaseController {

    static async getCategories(req, res) {

        const datas = await Category.where({ "parent": "solution" }).get();
        const sortedCategories = Object.values(datas).sort((a, b) => a.order - b.order);

        return view(res, "admin.categories.index", {
            ...await BaseController.boot(req),
            datas: sortedCategories,
        });

    }

    static async getCategoriesNew(req, res) {
        const user = await Auth.guard("admin").user(req);
        const datas = await Category.select("id").where({ "parent": "solution" }).get();
        const data = new Category();
        data.parent = "solution";
        data.order = Object.keys(datas).length;
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        return res.redirect("/admin/categories/edit?id=" + data.id);
    }

    static async getCategoriesEdit(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/categories");
        }
        const data = await Category.where({ "id": req.query.id }).first();
        const solutions = await Solution.where({ "status": 'active' }).like('category_id', `%"${req.query.id}"%`).get();
        const orders = data.pageOrders != null ? JSON.parse(data.pageOrders) : {  };
        let filteredSolutions = {};

        let i = 0;
        for (i = 0; i < Object.keys(orders).length; i++)
            for (const j in solutions)
                if (solutions[j].id === orders[i]) {
                    filteredSolutions[i] = solutions[j];
                    delete solutions[j];
                }
        for (var k in solutions){
            filteredSolutions[i] = solutions[k];
            i++;
        }

        if (!data) {
            return res.redirect("/admin/categories");
        }
        data.other_settings = JSON.parse(data.other_settings);
        if (data?.other_settings?.banner) {
            const media = await Media.find(data.other_settings.banner);
            data.other_settings.banner = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
            data.other_settings.banner_id = media.id;

        }
        const languages = await Language.where({"code": ["!=", null], "name": ["!=", null]}).get();
        return view(res, "admin.categories.form", {
            ...await BaseController.boot(req),
            data,
            solutions: filteredSolutions,
            languages,
        });
    }

    static async getCategoriesDelete(req, res) {
        const validate = Validator.make(req.query, {
            "id": "required|integer",
        });
        if (validate) {
            return res.redirect("/admin/categories");
        }
        const data = await Category.where({ "id": req.query.id }).first();
        if (!data) {
            return res.redirect("/admin/categories");
        }
        await data.delete();
        return res.redirect("/admin/categories");
    }

    static async postCategoriesEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Category.where({ "id": req.query.id }).first();

        data.title = JSON.stringify(req.body.title);
        data.subtitle = JSON.stringify(req.body.subtitle);
        data.description = JSON.stringify(req.body.description);
        data.content = JSON.stringify(req.body.content);
        const otherSettings = (data.other_settings ? JSON.parse(data.other_settings) : {});
        otherSettings["banner"] = req.body.banner;
        data.other_settings = JSON.stringify(otherSettings);
        const seo_check = await Category.select("id").whereNotIn("id", [req.query.id]).where({ "seo_url": req.body.url }).get();
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

    static async postCategoriesOrder(req, res) {

        const user = await Auth.guard("admin").user(req);
        const datas = JSON.parse(req.body.sortableData);
        for (const key in datas) {
            if (datas.hasOwnProperty(key)) {
                const id = key;
                const order = datas[key];
                const data = await Category.find(id);
                data.order = order;
                data.editor = user.id;
                data.edited_at = DateTime.getTime();
                await data.save();
            }
        }
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
        
    }
    static async postCategoriesPageOrder(req, res) {

        const datas = JSON.parse(req.body.sortableData);
        const user = await Auth.guard("admin").user(req);
        const data = await Category.where({ "id": datas.categoryId }).first();
        data.pageOrders = JSON.stringify(datas.orders);
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
    static async postCategoriesPagesOrders(req, res) {
        
    }

}

export default CategoriesController;