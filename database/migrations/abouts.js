import BaseSchema from "../BaseSchema.js";

class Abouts extends BaseSchema{

    static async up () {
        await this.createTable("abouts", (table) => {

            table.text("title").nullable();
            table.text("description").nullable();

            table.text("section_1_title").nullable();
            table.text("section_1_description").nullable();

            table.text("section_2_title").nullable();
            table.text("section_2_description").nullable();

        });
    }

}

export default Abouts;