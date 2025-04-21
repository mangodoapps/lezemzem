import BaseController from "./BaseController.js";

class ContactController{

    static async getContact(req, res){
        return view(res, "site.contact", {
            ...await BaseController.boot(req),
        });
    }
}

export default ContactController;