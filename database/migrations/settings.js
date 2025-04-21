import Schema from "../../lib/Schema.js";

class Settings{

    static async up () {
        await Schema.create("settings", (table) => {
            table.id();
            table.text("business_name").nullable();
            table.text("site_title").nullable();
            table.text("site_description").nullable();
            table.string("site_maintenance").nullable();
            table.text("email").nullable();
            table.string("phone").nullable();
            table.text("address").nullable();
            table.text("working_hours").nullable();
            table.text("social_media").nullable();
            table.text("news_settings").nullable();
            table.text("solutions_settings").nullable();
            table.text("activity_settings").nullable();
            table.text("category_settings").nullable();
            table.integer("editor").nullable();
            table.string("edited_at").nullable();
        });
    }

}

export default Settings;