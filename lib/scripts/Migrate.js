import fs from 'fs';
import App from "../App.js";

const app = await App.cli();
const args = process.argv.slice(2);
let files;
let fileLength;

if (args.length !== 0) {
    files = args;
    fileLength = 0;
}
else {
    files = fs.readdirSync("database/migrations");
    fileLength = files.length - 1;
}

for (let i in files) {
    const filePath = "../../database/migrations/" + files[i];
    const module = await import(filePath);
    console.log(`[${module.default.name}] table creation started.`);
    await module.default.up();
    console.log(`[${module.default.name}] table creation ended.`);
    if (i == fileLength) {
        process.exit(0);
    }
}