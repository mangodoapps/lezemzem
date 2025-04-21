import fs from "fs";
import path from "path";

const lang = function (req, data, params = null) {
    const currentLang = req.language;
    const pathArray = data.split(".");
    const langKey = pathArray.pop();
    const langPath = path.join(process.cwd(), "public", "storage", "upload_files", "langs", `${currentLang}.json`);
    const langFile = fs.readFileSync(langPath, {encoding: "utf-8", flag: "r"});
    const parsedLangFile = JSON.parse(langFile);
    if (parsedLangFile[langKey]) {
        if (params)
            parsedLangFile[langKey] = replaceParams(parsedLangFile[langKey], params);
        return parsedLangFile[langKey];
    }
    else
        return langKey;
}

const replaceParams = (text, params) => {
    Object.keys(params).forEach(key => {
        text = text.replaceAll(":" + key, params[key]);
    });
    return text;
}

export default lang;