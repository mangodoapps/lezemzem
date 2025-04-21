import Schema from "../../lib/Schema.js";

class Theme{

    static async up () {
        await Schema.create("theme", (table) => {
            table.id();
            table.text("home").nullable();
            table.text("contact_us").nullable();
            table.integer("editor").nullable();
            table.string("edited_at").nullable();
        });
    }

}

export default Theme;