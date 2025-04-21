import Auth from "../../../lib/Auth.js";
import view from "../../../lib/View.js"
import BaseController from "./BaseController.js";

class HomeController extends BaseController {

    static async getHome(req, res) {
        const nodeJsVersion = process.version;
        const softwareVersion = process.env.npm_package_version;

        return view(res, "admin.index", {
            ...await BaseController.boot(req),
            nodeJsVersion,
            softwareVersion,
        });
    }

    static async getLogout(req, res) {
        Auth.guard("admin").logout(req);
        return res.redirect("/admin/login");
    }

}

export default HomeController;