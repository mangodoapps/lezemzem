import Media from "../../Models/Media.js";
import News from "../../Models/News.js";
import Setting from "../../Models/Setting.js";
import BaseController from "./BaseController.js";

class NewsController extends BaseController {

    static async getNews(req, res) {
        const news = Object.values(await News.where({ "status": "active" }).get());
        let newsSettings = await Setting.first();
        if (newsSettings?.news_settings) {
            newsSettings = JSON.parse(newsSettings.news_settings);
        }
        for (let i = 0; i < news.length; i++) {
            news[i].title = JSON.parse(news[i].title);
            news[i].description = JSON.parse(news[i].description);
            const media = await Media.find(JSON.parse(news[i].other_settings).banner)
            news[i].image = news[i].other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.news", {
            ...await BaseController.boot(req),
            news,
            newsSettings
        });
    }

    static async getNew(req, res) {
        const data = await News.where({ "seo_url": req.params.news_seo }).first();
        if (data.title) {
            data.title = JSON.parse(data.title);
            data.subtitle = JSON.parse(data.subtitle);
            data.description = JSON.parse(data.description);
            data.content = JSON.parse(data.content);
            const media = await Media.find(JSON.parse(data.other_settings).banner)
            data.image = data.other_settings && media ? (media.path === "/" ? '' : media.path) + "/" + media.file_name : null;
        }
        return view(res, "site.news-content", {
            ...await BaseController.boot(req),
            data
        });
    }
}

export default NewsController;