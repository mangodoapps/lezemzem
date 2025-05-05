import BaseController from "./BaseController.js";
import About from "../../Models/About.js";


class AboutController {

    static async getAbout(req, res) {
        const about = await About.first();

        about.title = JSON.parse(about.title);
        about.description = JSON.parse(about.description);

        about.section_1_title = JSON.parse(about.section_1_title);
        about.section_1_description = JSON.parse(about.section_1_description);
        return view(res, "site.about", {
            ...await BaseController.boot(req),
            about,
        });
    }
}

export default AboutController;