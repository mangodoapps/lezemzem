import Auth from "../../../lib/Auth.js";
import Validator from "../../../lib/Validator.js";


class CreateContactFormMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            "recaptcha_token": "required|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
            });
        }
        const secret_key = process.env.GOOGLE_RECAPTCHA_SECRETKEY;
        const token = req.body.recaptcha_token;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

        const recaptcha_request = await fetch(url, { method: 'post' });
        const recaptcha_response = await recaptcha_request.json();

        if (!recaptcha_response.success && recaptcha_response.score < 0.7)
            return res.send({
                "status": "failed",
                "message": "Doğrulama yapılamadı. Lütfen tekrar deneyiniz.",
                "reloadPage": false,
                "timeout": 5000,
            });
    }

}

export default CreateContactFormMiddleware;