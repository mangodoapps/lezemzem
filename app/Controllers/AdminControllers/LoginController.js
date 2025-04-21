import Auth from "../../../lib/Auth.js";


class LoginController {

    static async getLogin(req, res) {
        const user = await Auth.guard("admin").has(req);
        if (process.env.APP_DEV == 'true')
            req.language = "en";
        else
            req.language = req.headers['x-custom-header'].split(".")[0];
        if (user)
            return res.redirect("/admin");
        return view(res, "admin.login", {
            req
        });
    }

    static async postLogin(req, res) {
        const login = await Auth.guard("admin").login(req, { "email": req.body.email, "password": req.body.password });
        if (!login) {
            return res.send({
                "status": "failed",
                "message": "Incorrect username or password.",
            });
        }
        return res.send({
            "status": "success",
        });
    }

    static async getLogout(req, res) {
        Auth.guard("admin").logout(req);
        return res.redirect("/admin/login");
    }

}

export default LoginController;