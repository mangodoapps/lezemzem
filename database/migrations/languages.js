import BaseSchema from "../BaseSchema.js";

class Languages extends BaseSchema{

    static async up () {
        await this.createTable("languages", (table) => {
            table.text("name").nullable();
            table.text("code").nullable();
        });
    }

}

export default Languages;