import Schema from "../../lib/Schema.js";

class News{

    static async up () {
        await Schema.create("news", (table) => {
            table.id();
            table.text("title").nullable();
            table.text("subtitle").nullable();
            table.text("description").nullable();
            table.text("seo_url").nullable();
            table.text("content").nullable();
            table.integer("views").default(0);
            table.text("other_settings").nullable();
            table.string("status").default("deactive");
            table.integer("creator");
            table.string("created_at");
            table.integer("editor").nullable();
            table.string("edited_at").nullable();
        });
    }

}

export default News;