import Auth from "../../lib/Auth.js";

class Authentication {

    static async handler (req, res) {
        if (!await Auth.guard("admin").has(req)) {
            return res.redirect("/admin/login");
        }
    }

}

export default Authentication;