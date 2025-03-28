class SiteController {

    static async getHome(req, res) {

        return view(res, "site.index", {

        });
    }

    static async getAbout(req, res) {

        return view(res, "site.about", {
            
        });
    } 

    static async getContact(req, res) {

        return view(res, "site.contact", {
            
        });
    } 

}

export default SiteController;