import BaseSchema from "../BaseSchema.js";

class Categories extends BaseSchema{

    static async up () {
        await this.createTable("categories", (table) => {
            table.string("parent");
            table.text("title").nullable();
            table.text("subtitle").nullable();
            table.text("description").nullable();
            table.text("seo_url").nullable();
            table.text("content").nullable();
            table.integer("order");
            table.text("pageOrders").nullable();
            table.integer("views").default(0);
            table.text("other_settings").nullable();

        });
    }

}

export default Categories;