import Str from "../../../lib/Str.js";
import Language from "../../Models/Language.js";
import Setting from "../../Models/Setting.js";

class BaseController {

    static async boot(req) {
        if (process.env.APP_DEV == 'true')
            req.language = "tr";
        else
            req.language = req.headers['x-custom-header'].split(".")[0] != "kulonaalsudan" ? req.headers['x-custom-header'].split(".")[0] : "en";
        const settings = await Setting.first();
        if (settings) {
            settings.social_media = settings.social_media ? JSON.parse(settings.social_media) : null;
            settings.icon_name = settings?.business_name ? Str.slug(settings?.business_name) : null;
        }
        //const languages = Object.values(await Language.where({ "code": ["!=", null], "name": ["!=", null] }).get());
        //const currentURL = req.headers['x-custom-header'] + req.originalUrl;
        //const currentLang = languages.find(x => x.code == req.language);

        return {
            req,
            settings,
            //languages,
            //currentLang,
            //currentURL,
        }
    }

}

export default BaseController;