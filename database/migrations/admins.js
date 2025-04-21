import BaseSchema from "../BaseSchema.js";

class Admins extends BaseSchema{

    static async up () {
        await this.createTable("admins", (table) => {
            table.text("name_surname").nullable();
            table.text("email").nullable();
            table.text("password").nullable();
            table.text("phone").nullable();
            table.text("registration_token").nullable();
            table.text("registration_token_expiration_date").nullable();
        });
    }

}

export default Admins;