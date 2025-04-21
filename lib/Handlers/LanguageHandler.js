import appConfig from "../../config/app.js";

class LanguageHandler {

    constructor (framework) {
        framework.addHook('preValidation', async (req, res) => {
            req.language = appConfig.locale;
            if (process.env.APP_DEV == 'true')
                req.language = "en";
            else
                req.language = req.headers['x-custom-header'].split(".")[0];
        });
    }

}

export default LanguageHandler;