import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import Validator from "../../../lib/Validator.js"
import DateTime from "../../../lib/DateTime.js"
import About from "../../Models/About.js";
import Media from "../../Models/Media.js";
import Language from "../../Models/Language.js";
import BaseController from "./BaseController.js";

class AboutsController extends BaseController {

    static async getAboutsEdit(req, res) {
        
        let data = await About.first();
        if (!data) {
            data = new About();
            data.creator = 1;
            data.created_at = DateTime.getTime();
            await data.save();
        }

        const languages = await Language.where({"code": ["!=", null], "name": ["!=", null]}).get();

        return view(res, "admin.abouts.form", {
            ...await BaseController.boot(req),
            data,
            languages,
        });
    }

    static async postAboutsEdit(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await About.first();

        if (!data) {
            data = new About();
            data.creator = 1;
            data.created_at = DateTime.getTime();
            await data.save();
        }

        data.title = JSON.stringify(req.body.title);
        data.description = JSON.stringify(req.body.description);
        data.section_1_title = JSON.stringify(req.body.section_1_title);
        data.section_1_description = JSON.stringify(req.body.section_1_description);
        data.section_2_title = JSON.stringify(req.body.section_2_title);
        data.section_2_description = JSON.stringify(req.body.section_2_description);


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

export default AboutsController;