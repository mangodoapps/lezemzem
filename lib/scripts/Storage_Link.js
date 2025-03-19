import fs from "fs";
import path from "path";
import os from "os";

const source = path.join(process.cwd(), "storage", "app", "public");
const target = path.join(process.cwd(), "public", "storage");

let linkType = os.platform() === 'win32' ? 'junction' : 'dir';

fs.symlink(source, target, linkType, (err) => {
    if (err) {
        console.error('Error creating symbolic link:', err);
    }
    else {
        console.log('Symbolic link has been created successfully.');
    }
});