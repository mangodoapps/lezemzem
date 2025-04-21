import Media from "../../Models/Media.js";
import Setting from "../../Models/Setting.js";
import Solution from "../../Models/Solution.js";
import Category from "../../Models/Category.js";
import BaseController from "./BaseController.js";

class SolutionsController extends BaseController {

    static async getSolutions(req, res) {
        const solutions = Object.values(await Solution.where({ "status": "active" }).get());
        let solutionSettings = await Setting.first();
        if (solutionSettings?.solutions_settings) {
            solutionSettings = JSON.parse(solutionSettings.solutions_settings);
        }
        for (let i = 0; i < solutions.length; i++) {
            solutions[i].title = JSON.parse(solutions[i].title);
            solutions[i].description = JSON.parse(solutions[i].description);
            const media = await Media.find(JSON.parse(solutions[i].other_settings).banner);
            solutions[i].image = solutions[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        //let categorySettings = await Setting.first();
        //const categories = Object.values(await Category.where({ "parent": "solution" }).get());
        //if (categorySettings?.category_settings) {
        //    categorySettings = JSON.parse(categorySettings.category_settings);
        //}
        //for (let i = 0; i < categories.length; i++) {
        //    categories[i].title = JSON.parse(categories[i].title);
        //    categories[i].subtitle = JSON.parse(categories[i].subtitle);
        //    categories[i].description = JSON.parse(categories[i].description);
        //    const media = await Media.find(JSON.parse(categories[i].other_settings).banner);
        //    categories[i].image = categories[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        //}
        return view(res, "site.solutions", {
            ...await BaseController.boot(req),
            solutions,
            solutionSettings,
            //categorySettings,
            //categories,
        });
    }

    static async getSolution(req, res) {
        const data = await Solution.where({ "seo_url": req.params.solution_seo }).first();
        if (data.title) {
            data.title = JSON.parse(data.title);
            data.subtitle = JSON.parse(data.subtitle);
            data.description = JSON.parse(data.description);
            data.content = JSON.parse(data.content);
            const media = await Media.find(JSON.parse(data.other_settings).banner);
            data.image = data.other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.solution-content", {
            ...await BaseController.boot(req),
            data
        });
    }
}

export default SolutionsController;