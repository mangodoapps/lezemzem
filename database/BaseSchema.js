import Schema from "../lib/Schema.js";

class BaseSchema {
    static async createTable(tableName, additionalFields) {
        await Schema.create(tableName, (table) => {
            table.id();

            additionalFields(table);

            table.string("status").default("deactive");
            table.string("created_at");
            table.integer("creator");
            table.string("edited_at").nullable();
            table.integer("editor").nullable();
        });
    }
}

export default BaseSchema;