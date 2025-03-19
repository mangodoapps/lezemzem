import Blueprint from "./Blueprint.js";
import DB from "./DB.js";

class Schema{

    static async create(tableName, callback) {
        const blueprint = new Blueprint(tableName);
        callback(blueprint);
        const query =  `
            CREATE TABLE ${tableName} (
                ${blueprint.columns.map((column) => {
                    const { name, type, nullable, default: defaultValue } = column;
                    const nullableClause = nullable ? '' : 'NOT NULL';
                    const defaultClause = defaultValue !== undefined ? `DEFAULT ('${defaultValue}')` : '';
                    return `${name ? "\`" + name + "\`" : ''} ${type} ${nullableClause} ${defaultClause}`;
                }).join(',')}
            );
        `;
        await DB.driver.query(query);
    }

}

export default Schema;