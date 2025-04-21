import Validator from "../../../lib/Validator.js";

class ThemeHomeMiddleware {

    static async handler (req, res) {
        const validate = Validator.make(req.body, {
            // "home": "required|array",
            // "home.sliders": "nullable|array",
            // "home.sliders.*": "required|array",
            // "home.sliders.*.title": "required|array",
            // "home.sliders.*.title.*": "required|string",
            // "home.sliders.*.image": "required|array",
            // "home.sliders.*.image.*": "required|integer",
            // "home.sliders.*.link": "required|array",
            // "home.sliders.*.link.*": "nullable|string",
            // "home.section_1": "required|array",
            // "home.section_1.title": "required|array",
            // "home.section_1.title.*": "nullable|string",
            // "home.section_1.content": "required|array",
            // "home.section_1.content.*": "nullable|string",
            // "home.section_1.image": "nullable|integer",
            // "home.section_2": "required|array",
            // "home.section_2.title": "required|array",
            // "home.section_2.title.*": "nullable|string",
            // "home.section_2.description": "required|array",
            // "home.section_2.description.*": "nullable|string",
            // "home.section_2.items": "nullable|array",
            // "home.section_2.items.*": "nullable|array",
            // "home.section_2.items.*.title": "nullable|array",
            // "home.section_2.items.*.title.*": "nullable|string",
            // "home.section_2.items.*.content": "nullable|array",
            // "home.section_2.items.*.content.*": "nullable|string",
        });
        if (validate) {
            return res.send({
                "status": "failed",
                "message": "Please fill out the form as required.",
                "reloadPage": false,
                "timeout": 5000,
            });
        }
    }

}

export default ThemeHomeMiddleware;