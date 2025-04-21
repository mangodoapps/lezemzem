import Category from "../../Models/Category.js";
import Media from "../../Models/Media.js";
import News from "../../Models/News.js";
import Setting from "../../Models/Setting.js";
import BaseController from "./BaseController.js";

class CategoriesController extends BaseController{

    static async getIndustry(req, res){
        const data = await Category.where({"seo_url": req.params.category_seo}).first();
        if (data.title) {
            data.title = JSON.parse(data.title);
            data.subtitle = JSON.parse(data.subtitle);
            data.description = JSON.parse(data.description);
            data.content = JSON.parse(data.content);
            const media = await Media.find(JSON.parse(data.other_settings).banner);
            data.image = data.other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.category-content", {
            ...await BaseController.boot(req),
            data
        });
    }
}

export default CategoriesController;