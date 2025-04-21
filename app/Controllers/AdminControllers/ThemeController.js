import view from "../../../lib/View.js"
import DateTime from "../../../lib/DateTime.js"
import Theme from "../../Models/Theme.js";
import Media from "../../Models/Media.js";
import BaseController from "./BaseController.js";
import Language from "../../Models/Language.js";

class ThemeController extends BaseController {

    static async getTheme(req, res) {

        const theme = await Theme.first();
        const languages = Object.values(await Language.where({ "code": ["!=", null], "name": ["!=", null] }).get());
        if (theme) {
            const tempHome = JSON.parse(theme.home);
            theme.home = null;
            theme.home = tempHome;
            for (const key in theme?.home?.sliders) {
                if (Object.hasOwnProperty.call(theme.home.sliders, key)) {
                    for (let i = 0; i < languages.length; i++) {
                        const lang = languages[i].code;
                        if (theme?.home?.sliders?.[key]?.image?.[lang]) {
                            const media = await Media.find(theme.home.sliders[key].image[lang]);
                            theme.home.sliders[key].image[`${lang}_id`] = media.id;
                            theme.home.sliders[key].image[lang] = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
                        }

                        if (theme?.home?.sliders?.[key]?.subImage?.[lang]) {
                            const media = await Media.find(theme.home.sliders[key].subImage[lang]);
                            theme.home.sliders[key].subImage[`${lang}_id`] = media.id;
                            theme.home.sliders[key].subImage[lang] = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
                        }
                    }
                }
            }

            for (let i = 0; i < languages.length; i++) {
                const lang = languages[i].code;
                if (theme?.home?.section_3?.image?.[lang]) {
                    const media = await Media.find(theme.home.section_3.image[lang]);
                    theme.home.section_3.image[`${lang}_id`] = media.id;
                    theme.home.section_3.image[lang] = (media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null);
                }
            }
        }
        console.log(theme.home.sliders)
        return view(res, "admin.theme.index", {
            ...await BaseController.boot(req),
            theme,
            languages,
        });

    }

    static async postThemeHome(req, res) {
        let theme = await Theme.first();
        if (!theme) {
            theme = new Theme();
        }
        theme.home = JSON.stringify(req.body.home);
        await theme.save();
        return res.send({
            "status": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

}

export default ThemeController;