import Mail from "../../../lib/Mail.js";
import Validator from "../../../lib/Validator.js";
import Setting from "../../Models/Setting.js";

class SettingEMailSettingsFormMiddleware {

    static async handler(req, res) {
        const validate = Validator.make(req.body, {
            "host": "required|string",
            "port": "required|integer",
            "username": "required|email",
            "password": "required|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
        const settings = await Setting.first();
        try {
            const from = `${JSON.parse(settings.business_name).tr} <${req.body.username}>`;
            await Mail.from(from).to("turkmenrifat97@gmail.com").subject("E-Mail Setup Successful!").view("mail.email-setup", {
                settings,
            }).send(
                function (transport) {
                    transport.MAIL_HOST = req.body.host;
                    transport.MAIL_PORT = req.body.port;
                    transport.MAIL_USERNAME = req.body.username;
                    transport.MAIL_PASSWORD = req.body.password;
                    transport.MAIL_SECURE = (req.body.secure ? true : false);
                }
            );
        }
        catch (err) {
            console.log(err);
            return res.send({
                "status": "failed",
                "message": "E-mail could not be sent. Please try again after checking your information.",
                "reloadPage": false,
                "timeout": 5000,
            });
        } finally {
            // SSL/TLS sertifikası kontrolünü tekrar etkinleştir
        }
    }

}

export default SettingEMailSettingsFormMiddleware;