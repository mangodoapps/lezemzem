import Media from "../../Models/Media.js";
import Activity from "../../Models/Activity.js";
import Setting from "../../Models/Setting.js";
import BaseController from "./BaseController.js";

class ActivitiesController extends BaseController {

    static async getActivities(req, res) {
        const activities = Object.values(await Activity.where({ "status": "active" }).get());
        let activitiesSettings = await Setting.first();
        if (activitiesSettings?.activity_settings) {
            activitiesSettings = JSON.parse(activitiesSettings.activity_settings);
        }
        for (let i = 0; i < activities.length; i++) {
            activities[i].title = JSON.parse(activities[i].title);
            activities[i].description = JSON.parse(activities[i].description);
            const media = await Media.find(JSON.parse(activities[i].other_settings).banner)
            activities[i].image = activities[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.activities", {
            ...await BaseController.boot(req),
            activities,
            activitiesSettings
        });
    }

    static async getActivity(req, res) {
        const data = await Activity.where({ "seo_url": req.params.activity_seo }).first();
        if (data.title) {
            data.title = JSON.parse(data.title);
            data.subtitle = JSON.parse(data.subtitle);
            data.description = JSON.parse(data.description);
            data.content = JSON.parse(data.content);
            const media = await Media.find(JSON.parse(data.other_settings).banner)
            data.image = data.other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.activity-content", {
            ...await BaseController.boot(req),
            data
        });
    }
}

export default ActivitiesController;