import Auth from "../../../lib/Auth.js";
import BaseController from "./BaseController.js";
import view from "../../../lib/View.js";
import Setting from "../../Models/Setting.js";
import DateTime from "../../../lib/DateTime.js";
import Str from "../../../lib/Str.js";
import Storage from "../../../lib/Storage.js";
import fs from "fs";
import Language from "../../Models/Language.js";

class SettingsController extends BaseController {

    static async getSettings(req, res) {
        let data = await Setting.first();
        if (!data) {
            data = new Setting();
            await data.save();
        }
        const languages = await Language.where({"code": ["!=", null], "name": ["!=", null]}).get();
        data.site_title = data?.site_title ? JSON.parse(data.site_title) : '';
        data.site_description = data?.site_description ? JSON.parse(data.site_description) : '';
        return view(res, "admin.settings.form", {
            ...await BaseController.boot(req),
            data,
            languages,
        });
    }

    static async postSettingsGeneralSettings(req, res) {
        const user = await Auth.guard("admin").user(req);
        let data = await Setting.first();
        if (!data) {
            data = new Setting();
        }
        const currentBusinessName = data?.business_name;
        if (!req.body.logo && currentBusinessName[Object.keys(currentBusinessName)[0]] != req.body.business_name[Object.keys(req.body.business_name)[0]]) {
            const currentLogoName = Str.slug(currentBusinessName) + "-logo.png";
            const newLogoName = Str.slug(req.body.business_name) + "-logo.png";
            Storage.rename(`/upload_files/${currentLogoName}`, `/upload_files/${newLogoName}`);
        }
        else if (req.body.logo) {
            if (currentBusinessName) {
                const currentLogoName = Str.slug(currentBusinessName) + "-logo.png";
                Storage.delete(`/upload_files/${currentLogoName}`);
            }
            const newLogoName = Str.slug(req.body.business_name) + "-logo.png";
            Storage.put(req.body.logo, "/upload_files", `${newLogoName}`);
        }
        data.business_name = req.body.business_name;
        data.site_title = req.body.site_title ? JSON.stringify(req.body.site_title) : null;
        data.site_description = req.body.site_description ? JSON.stringify(req.body.site_description) : null;
        data.site_maintenance = (req.body.site_maintenance ? "active" : "deactive");
        data.editor = user.id;
        data.edited_at = DateTime.getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

    static async postSettingsEMailSettings(req, res) {
        let envFile = fs.readFileSync('.env', 'utf-8');
        envFile = envFile.replace(new RegExp(`MAIL_HOST=.*`, 'g'), `MAIL_HOST=${req.body.host}`);
        envFile = envFile.replace(new RegExp(`MAIL_PORT=.*`, 'g'), `MAIL_PORT=${req.body.port}`);
        envFile = envFile.replace(new RegExp(`MAIL_USERNAME=.*`, 'g'), `MAIL_USERNAME=${req.body.username}`);
        envFile = envFile.replace(new RegExp(`MAIL_PASSWORD=.*`, 'g'), `MAIL_PASSWORD=${req.body.password}`);
        envFile = envFile.replace(new RegExp(`MAIL_SECURE=.*`, 'g'), `MAIL_SECURE=${req.body.secure ? 'true' : 'false'}`);
        fs.writeFileSync('.env', envFile);
        process.env.MAIL_HOST = req.body.host;
        process.env.MAIL_PORT = req.body.port;
        process.env.MAIL_USERNAME = req.body.username;
        process.env.MAIL_PASSWORD = req.body.password;
        process.env.MAIL_SECURE = (req.body.secure ? 'true' : 'false');
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

    static async postSettingsSocialMedia(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Setting.first();
        data.social_media = JSON.stringify(req.body.social_media);
        data.editor = user.id;
        data.edited_at = DateTime.getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }
    static async postSettingsContact(req, res) {
        const user = await Auth.guard("admin").user(req);
        const data = await Setting.first();
        data.email = req.body.contact_email;
        data.phone = req.body.contact_phone;
        data.address = req.body.contact_address;
        data.working_hours = JSON.stringify(req.body.contact_working_hours);
        data.editor = user.id;
        data.edited_at = DateTime.getTime();
        await data.save();
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }
    static async postSettingsIntegrations(req, res) {
        let envFile = fs.readFileSync('.env', 'utf-8');
        envFile = envFile.replace(new RegExp(`GOOGLE_RECAPTCHA_SITEKEY=.*`, 'g'), `GOOGLE_RECAPTCHA_SITEKEY=${req.body.site_key}`);
        envFile = envFile.replace(new RegExp(`GOOGLE_RECAPTCHA_SECRETKEY=.*`, 'g'), `GOOGLE_RECAPTCHA_SECRETKEY=${req.body.secret_key}`);
        fs.writeFileSync('.env', envFile);
        process.env.GOOGLE_RECAPTCHA_SITEKEY = req.body.site_key;
        process.env.GOOGLE_RECAPTCHA_SECRETKEY = req.body.secret_key;
        return res.send({
            "success": "success",
            "message": "Saved successfully.",
            "reloadPage": true,
            "timeout": 5000,
        });
    }

}

export default SettingsController;