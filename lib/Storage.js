import fs from 'node:fs';
import path from "node:path";

class Storage {

    static async put(data, pathName, fileName, isPrivate = false) {
        if (process.env.FILESYSTEM_DRIVER === "local") {
            const storagePath = isPrivate ? './storage/app/private/' : './storage/app/public/';
            const fullPath = path.join(storagePath, pathName, fileName);
            // Check Folder
            const dirPath = path.join(storagePath, pathName);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            // Write File
            fs.writeFileSync(fullPath, data.buffer);
        }
        return true;
    }

    static async delete(fileName) {
        await fs.promises.unlink(`./storage/app/public${fileName}`);
    }

    static async rename(oldFileName, newFileName) {
        const oldFullPath = `./storage/app/public${oldFileName}`;
        const newFullPath = `./storage/app/public${newFileName}`;
        await fs.promises.rename(oldFullPath, newFullPath);
    }

    static exist(fileName) {
        if (fs.existsSync(`./storage/app/public${fileName}`))
            return true;
        
        return false;
    }

}

export default Storage;