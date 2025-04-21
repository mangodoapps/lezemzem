import BaseSchema from "../BaseSchema.js";

class Solutions extends BaseSchema{

    static async up () {
        await this.createTable("solutions", (table) => {
            table.text("title").nullable();
            table.text("subtitle").nullable();
            table.text("description").nullable();
            table.text("seo_url").nullable();
            table.text("category_id").nullable();
            table.text("content").nullable();
            table.integer("views").default(0);
            table.text("other_settings").nullable();
        });
    }

}

export default Solutions;