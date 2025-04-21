import BaseSchema from "../BaseSchema.js";

class Media extends BaseSchema{

    static async up () {
        await this.createTable("media", (table) => {
            table.text("name").nullable();
            table.text("path").nullable();
            table.text("file_name").nullable();
            table.string("type").nullable();
        });
    }

}

export default Media;