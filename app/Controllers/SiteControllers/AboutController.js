import BaseController from "./BaseController.js";

class AboutController{

    static async getAbout(req, res){
        return view(res, "site.about", {
            ...await BaseController.boot(req),
        });
    }
}

export default AboutController;