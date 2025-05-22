import Setting from "../../Models/Setting.js";
import BaseController from "./BaseController.js";
import Mail from "../../../lib/Mail.js"

class ContactController{

    static async getContact(req, res){
        return view(res, "site.contact", {
            ...await BaseController.boot(req),
        });
    }

    static async postContact(req, res) {
        const settings = await Setting.first();
        try {
            const from = `${settings.business_name}`;
            await Mail.from(from).to("turkmenrifat97@gmail.com").subject("Bir iletişim formu alındı").view(res, "mail.contact", {
            // await Mail.from(from).to(settings.email).subject("Bir iletişim formu alındı").view(res, "mail.contact", {
                settings,
                req,
            }).send();
        }
        catch (err) {
            console.log(err)
            return res.send({
                "status": "failed",
                "message": "E-mail could not be sent. Please try again after checking your information.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        return res.send({
            "status": "success",
            "message": "İletişim formu başarıyla gönderildi.",
            "reloadPage": true,
            "timeout": 2000
        });
    }
}

export default ContactController;