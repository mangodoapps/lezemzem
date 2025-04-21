import view from "../../../lib/View.js"
import BaseController from "./BaseController.js";
import Theme from "../../Models/Theme.js"
import Media from "../../Models/Media.js"
import Language from "../../Models/Language.js";
import Solution from "../../Models/Solution.js";
import News from "../../Models/News.js";

class HomeController extends BaseController {

    static async getHome(req, res) {

        const nodeJsVersion = process.version;
        const softwareVersion = process.env.npm_package_version;

        const theme = await Theme.first();
        if (!theme)
            return view(res, "site.index", {
                ...await BaseController.boot(req),
                nodeJsVersion,
                softwareVersion,
            });

        const themeHome = JSON.parse(theme.home);
        const languages = Object.values(await Language.where({ "code": ["!=", null], "name": ["!=", null] }).get());
        // Top Sliders
        if (themeHome.sliders) {

            for (const key in themeHome.sliders) {
                for (let i = 0; i < languages.length; i++) {
                    const lang = languages[i].code;
                    if (themeHome?.sliders?.[key].image?.[lang]) {
                        const image = await Media.find(themeHome.sliders[key].image[lang]);
                        themeHome.sliders[key].image[lang] = (image ? (image.path === "/" ? '' : image.path) + "/" + image.file_name : null);
                    }
                    if (themeHome?.sliders?.[key].subImage?.[lang]) {
                        const image = await Media.find(themeHome.sliders[key].subImage[lang]);
                        themeHome.sliders[key].subImage[lang] = (image ? (image.path === "/" ? '' : image.path) + "/" + image.file_name : null);
                    }
                }
            }
        }

        // Section 3
        if (themeHome?.section_3?.image) {
            for (let i = 0; i < languages.length; i++) {
                const lang = languages[i].code;
                const image = await Media.find(themeHome.section_3.image[lang]);
                themeHome.section_3.image[lang] = (image ? (image.path === "/" ? '' : image.path) + "/" + image.file_name : null);
            }
        }

        const solutions = Object.values(await Solution.where({"status": "active"}).get());
        for (let i = 0; i < solutions.length; i++) {
            solutions[i].title = JSON.parse(solutions[i].title); 
            solutions[i].description = JSON.parse(solutions[i].description); 
            const media = await Media.find(JSON.parse(solutions[i].other_settings).banner);
            solutions[i].image = solutions[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        const news = Object.values(await News.where({"status": "active"}).get());
        for (let i = 0; i < news.length; i++) {
            news[i].title = JSON.parse(news[i].title); 
            news[i].description = JSON.parse(news[i].description); 
            const media = await Media.find(JSON.parse(news[i].other_settings).banner);
            news[i].image = news[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        
        return view(res, "site.index", {
            ...await BaseController.boot(req),
            nodeJsVersion,
            softwareVersion,
            themeHome,
            solutions,
            news,
        });
    }

}

export default HomeController;