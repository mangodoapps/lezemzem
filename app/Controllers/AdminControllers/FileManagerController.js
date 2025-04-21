import Auth from "../../../lib/Auth.js";
import DateTime from "../../../lib/DateTime.js";
import Storage from "../../../lib/Storage.js";
import Str from "../../../lib/Str.js";
import Validator from "../../../lib/Validator.js";
import Admin from "../../Models/Admin.js";
import Media from "../../Models/Media.js";
import fs from "fs";
import path from "path";
import BaseController from "./BaseController.js";


class FileManagerController extends BaseController {

    static #uploadFolder = path.join(process.cwd(), "storage", "app", "public", "upload_files");

    static async getFileManagerGetFolders(req, res) {

        const validate = Validator.make(req.query, {
            "path": "required|string"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        const folders = await Media.where({
            "type": "folder"
        }).orderBy("name", "ASC").get();
        const foldersInPath = [];
        for (const folder of Object.values(folders)) {
            if (folder.path === req.query.path)
                foldersInPath.push({ path: folder.path, name: folder.name, subfolderCount: 0 });
        }
        for (const folder of Object.values(folders)) {
            foldersInPath.map(data => {
                if (folder.path === (data.path === "/" ? '' : data.path) + "/" + data.name)
                    data.subfolderCount++;
            });
        }

        return res.send({
            status: "success",
            folders: foldersInPath
        });

    }

    static async postFileManagerGetFiles(req, res) {

        const validate = Validator.make(req.query, {
            "path": "required|string",
            "search": "nullable|string"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        let files;
        if (!req.body.search)
            files = await Media.where({
                "path": req.query.path
            }).orderBy("type", "DESC").orderBy("name", "ASC").get();
        else
            files = await Media.like("name", `%${req.body.search}%`).orderBy("type", "DESC").orderBy("name", "ASC").get();
        
            

        return res.send({
            status: "success",
            files
        });

    }

    static async getFileManagerGetFile(req, res) {

        const validate = Validator.make(req.query, {
            "id": "required|integer|min:1"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        const file = await Media.find(req.query.id);
        if (!file) {
            return res.send({
                status: "failed",
                message: "No such file or folder was found.",
                reloadPage: false,
            });
        }
        file.creator = (await Admin.find(file.creator)).username;
        file.created_at = DateTime.getDate(file.created_at, "d.m.Y H:i");
        return res.send({
            status: "success",
            file
        });

    }

    static async postFileManagerNewFolder(req, res) {

        const validate = Validator.make(req.body, {
            "path": "required|string"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        const user = await Auth.guard("admin").user(req);
        const targetPath = path.join(FileManagerController.#uploadFolder, req.body.path, "New Folder");
        const data = new Media();
        if (fs.existsSync(targetPath))
            data.name = "New Folder " + DateTime.getTime();
        else
            data.name = "New Folder";
        data.path = req.body.path;
        data.file_name = data.name;
        data.type = "folder";
        data.creator = user.id;
        data.created_at = DateTime.getTime();
        await data.save();
        fs.mkdirSync(path.join(FileManagerController.#uploadFolder, req.body.path, data.name), { recursive: true });
        return res.send({
            status: "success"
        });

    }

    static async postFileManagerUploadFile(req, res) {

        const validate = Validator.make(req.body, {
            "path": "required|string",
            "files": "required|array|min:1",
            "files.*": "required|file"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "Please upload files in the correct formats.",
                reloadPage: false,
            });
        }
        if (req.body.path !== "/") {
            const path = req.body.path.split("/");
            const folderName = path.pop();
            const folder = await Media.where({
                "path": (path.join("/") === "" ? "/" : path.join("/")),
                "file_name": folderName,
                "type": "folder"
            }).first();
            if (!folder) {
                return res.send({
                    status: "failed",
                    message: "Folder not found.",
                    reloadPage: false,
                });
            }
        }
        const user = await Auth.guard("admin").user(req);
        let key = 0;
        let newFiles = [];
        for (const file of req.body.files) {
            let fileName = Str.slug(file.fullname.split(".").slice(0, -1).join(".")) + "-" + key + "-" + DateTime.getTime();
            await Storage.put(file, "/upload_files" + req.body.path, fileName + "." + file.extension);
            const newMedia = new Media();
            newMedia.name = file.name;
            newMedia.path = req.body.path;
            newMedia.file_name = fileName + "." + file.extension;
            newMedia.type = "file";
            newMedia.creator = user.id;
            newMedia.created_at = DateTime.getTime();
            await newMedia.save();
            newFiles.push({ id: newMedia.id, name: newMedia.name, type: newMedia.type });
            key++;
        }
        return res.send({
            status: "success",
            files: newFiles
        });

    }

    static async postFileManagerDeleteFile(req, res) {
        const validate = Validator.make(req.body, {
            "id": "required|integer|min:1"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        const data = await Media.find(req.body.id);
        if (!data) {
            return res.send({
                status: "failed",
                message: "No such file or folder was found.",
                reloadPage: false,
            });
        }
        try {
            const targetPath = path.join(FileManagerController.#uploadFolder, data.path, data.file_name);
            if (data.type === "folder") {
                fs.rmSync(targetPath, { recursive: true, force: true });
                await Media.like("path", (data.path === "/" ? '' : data.path) + "/" + data.file_name + "%").delete();
            } else
                fs.unlinkSync(targetPath);
            await data.delete();
        }
        catch (error) {
            return res.send({
                status: "failed",
                message: "The file or folder could not be deleted. Please try again later.",
                reloadPage: false,
            });
        }
        return res.send({
            status: "success"
        });
    }

    static async postFileManagerUpdate(req, res) {

        const validate = Validator.make(req.body, {
            "id": "required|integer|min:1",
            "name": "required|string"
        });
        if (validate) {
            return res.send({
                status: "failed",
                message: "No file path specified. Please try again.",
                reloadPage: false,
            });
        }
        const data = await Media.find(req.body.id);
        if (!data) {
            return res.send({
                status: "failed",
                message: "No such file or folder was found.",
                reloadPage: false,
            });
        }
        const user = await Auth.guard("admin").user(req);
        if (data.type === "file") {
            data.name = req.body.name;
        } else if (data.type === "folder") {
            const checkFolderName = await Media.whereNotIn("id", [req.body.id]).where({
                "path": data.path,
                "name": req.body.name,
                "type": "folder"
            }).first();
            if (checkFolderName)
                return res.send({
                    status: "failed",
                    message: "This folder name is already in use.",
                    reloadPage: false,
                });
            const updatePaths = await Media.like("path", (data.path === "/" ? '' : data.path) + "/" + data.name + "%").get();
            for (const file of Object.values(updatePaths)) {
                file.path = file.path.replace((data.path === "/" ? '' : data.path) + "/" + data.name, (data.path === "/" ? '' : data.path) + "/" + req.body.name);
                await file.save();
            }
            const oldName = path.join(FileManagerController.#uploadFolder, data.path, data.name);
            const newName = path.join(FileManagerController.#uploadFolder, data.path, req.body.name);
            data.name = req.body.name;
            data.file_name = req.body.name;
            fs.renameSync(oldName, newName);
        }
        data.editor = user.id;
        data.edited_at = DateTime.getTime();
        await data.save();
        return res.send({
            status: "success"
        });

    }

}

export default FileManagerController;