import DB from "./DB.js";
import Paginator from "./Paginator.js";

class Model {

    static select (value) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (typeof value === "string") {
                object.selectQuery = value;
            }
            else {
                object.selectQuery = value.join(",");
            }
        }
        return object;
    }

    select (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (typeof value === "string") {
                this.selectQuery = value;
            }
            else {
                this.selectQuery = value.join(",");
            }
        }
        return this;
    }

    static where (value) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            object.whereQuery = "WHERE (";
            object.whereQuery += Object.entries(value).map(([key, value]) => {
                return Model.#whereParser(key, value);
            }).join(" AND ") + ")";
            object.whereValues = [...Object.values(value).map(value => {
                return (Array.isArray(value) ? value[1] : value)
            }).filter(value => {
                return (Array.isArray(value) ? value[1] : value);
            })];
        }
        return object;
    }

    where (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.whereQuery) {
                this.whereQuery = "WHERE (";
                this.whereValues = [];
            }
            else {
                this.whereQuery += " AND (";
            }
            this.whereQuery += Object.entries(value).map(([key, value]) => {
                return Model.#whereParser(key, value);
            }).join(" AND ") + ")";
            this.whereValues.push(...Object.values(value).map(value => {
                return (Array.isArray(value) ? value[1] : value)
            }).filter(value => {
                return (Array.isArray(value) ? value[1] : value);
            }));
        }
        return this;
    }

    static whereIn (column, value) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            object.whereQuery = `WHERE (${column} IN (${value.map(() => "?").join(", ")}))`;
            object.whereValues = [...value];
        }
        return object;
    }

    whereIn (column, value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.whereQuery) {
                this.whereQuery = "WHERE (";
                this.whereValues = [];
            }
            else {
                this.whereQuery += " AND (";
            }
            this.whereQuery += `${column} IN (${value.map(() => "?").join(", ")}))`;
            this.whereValues.push(...value);
        }
        return this;
    }

    static whereNotIn (column, value) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            object.whereQuery = `WHERE (${column} NOT IN (${value.map(() => "?").join(", ")}))`;
            object.whereValues = [...value];
        }
        return object;
    }

    whereNotIn (column, value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.whereQuery) {
                this.whereQuery = "WHERE (";
                this.whereValues = [];
            }
            else {
                this.whereQuery += " AND (";
            }
            this.whereQuery += `${column} NOT IN (${value.map(() => "?").join(", ")}))`;
            this.whereValues.push(...value);
        }
        return this;
    }

    static like (value, pattern) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (typeof value === "string") {
                object.whereQuery = `WHERE (${value} LIKE ?)`;
                object.whereValues = [pattern];
            }
            else {
                object.whereQuery = `WHERE (`;
                object.whereQuery += Object.entries(value).map(([key, value]) => {
                    return `${key} LIKE ?`;
                }).join(" AND ") + ")";
                object.whereValues = Object.values(value);
            }
        }
        return object;
    }

    like (value, pattern) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.whereQuery) {
                if (typeof value === "string") {
                    this.whereQuery = `WHERE (${value} LIKE ?)`;
                    this.whereValues = [pattern];
                }
                else {
                    this.whereQuery = `WHERE (`;
                    this.whereQuery += Object.entries(value).map(([key, value]) => {
                        return `${key} LIKE ?`;
                    }).join(" AND ") + ")";
                    this.whereValues = Object.values(value);
                }
            }
            else {
                if (typeof value === "string") { 
                    this.whereQuery += ` AND (${value} LIKE ?)`;
                    this.whereValues.push(pattern);
                }
                else {
                    this.whereQuery += " AND (" + Object.keys(value).map((value) => {
                        return `${value} LIKE ?`;
                    }).join(" AND ") + ")";
                    this.whereValues.push(...Object.values(value));
                }
            }
        }
        return this;
    }

    orWhere (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.whereQuery) {
                this.whereQuery = "WHERE (";
                this.whereValues = [];
            }
            else {
                this.whereQuery += " OR (";
            }
            this.whereQuery += Object.entries(value).map(([key, value]) => {
                return Model.#whereParser(key, value);
            }).join(" AND ") + ")";
            this.whereValues.push(...Object.values(value).map(value => {
                return (Array.isArray(value) ? value[1] : value)
            }).filter(value => {
                return (Array.isArray(value) ? value[1] : value);
            }));
        }
        return this;
    }

    static orderBy (value, sortType) {
        const object = new this();
        if (process.env.DATABASE_DRIVER === "mysql") {
            object.orderByQuery = "ORDER BY ";
            if (typeof value === "string") {
                object.orderByQuery += value +" "+ sortType;
            }
            else if (typeof value === "object") {
                object.orderByQuery += Object.entries(value).map(([key, value]) => {
                    return `${key} ${value}`;
                }).join(", ");
            }
        }
        return object;
    }

    orderBy (value, sortType) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (!this.orderByQuery) {
                this.orderByQuery = "ORDER BY ";
            }
            else {
                this.orderByQuery += ", ";
            }
            if (typeof value === "string") {
                this.orderByQuery += `\`${value}\` ${sortType}`;
            }
            else if (typeof value === "object") {
                this.orderByQuery += Object.entries(value).map(([key, value]) => {
                    return `\`${key}\` ${value}`;
                }).join(", ");
            }
        }
        return this;
    }

    limit (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            this.limitQuery = "LIMIT ?";
            this.limitValue = value;
        }
        return this;
    }

    static async get () {
        let result = null;
        if (process.env.DATABASE_DRIVER === "mysql") {
            const query = await DB.driver.query(`SELECT * FROM ${this.table}`);
            result = query[0];
        }
        return result;
    }

    async get () {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (this.limitValue)
                if (this.whereValues)
                    this.whereValues.push(this.limitValue);
                else
                    this.whereValues = [this.limitValue];
            const query = await DB.driver.query(`SELECT ${this.selectQuery ? this.selectQuery : "*"} FROM ${this.constructor.table} ${this.whereQuery ? this.whereQuery : ''} ${this.orderByQuery ? this.orderByQuery : ''} ${this.limitQuery ? this.limitQuery : ''}`, this.whereValues);
            query[0].forEach((value, key) => {
                const newObject = new this.constructor();
                Object.assign(newObject, value);
                this[key] = newObject;
            });
            delete this.whereQuery;
            delete this.whereValues;
            delete this.orderByQuery;
            delete this.selectQuery;
            delete this.limitQuery;
            delete this.limitValue;
        }
        return this;
    }

    static async find (id) {
        const object = new this();
        let result = null;
        if (process.env.DATABASE_DRIVER === "mysql") {
            const query = await DB.driver.query(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
            if (query[0][0]) {
                Object.assign(object, query[0][0]);
                result = object;
            }
        }
        return result;
    }

    static async first () {
        const object = new this();
        let result = null;
        if (process.env.DATABASE_DRIVER === "mysql") {
            const query = await DB.driver.query(`SELECT * FROM ${this.table} LIMIT 1`);
            if (query[0][0]) {
                Object.assign(object, query[0][0]);
                result = object;
            }
        }
        return result;
    }

    async first () {
        let result = null;
        if (process.env.DATABASE_DRIVER === "mysql") {
            const query = await DB.driver.query(`SELECT ${this.selectQuery ? this.selectQuery : "*"} FROM ${this.constructor.table} ${this.whereQuery ? this.whereQuery : ''} ${this.orderByQuery ? this.orderByQuery : ''} LIMIT 1`, this.whereValues);
            delete this.whereQuery;
            delete this.whereValues;
            delete this.orderByQuery;
            delete this.selectQuery;
            if (query[0][0]) {
                Object.assign(this, query[0][0]);
                result = this;
            }
        }
        return result;
    }

    static async paginate (req, count = 10) {
        let result = null;
        if (process.env.DATABASE_DRIVER === "mysql") {
            const query = await DB.driver.query(`SELECT * FROM ${this.table} LIMIT ?`, count);
            result = query[0];
        }
        return result;
    }

    async paginate (req, count = 10) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (this.limitValue)
                if (this.whereValues)
                    this.whereValues.push(this.limitValue);
                else
                    this.whereValues = [this.limitValue];
            let query, offset = 0;
            if (req.query.page && req.query.page >= 1) {
                offset = count * (parseInt(req.query.page) - 1);
            }
            if (this.whereQuery) {
                query = await DB.driver.query(`SELECT ${this.selectQuery ? this.selectQuery : "*"} FROM ${this.constructor.table} ${this.whereQuery} ${this.orderByQuery ? this.orderByQuery : ''} LIMIT ? OFFSET ?`, [this.whereValues, count + 1, offset]);
            }
            else {
                query = await DB.driver.query(`SELECT ${this.selectQuery ? this.selectQuery : "*"} FROM ${this.constructor.table} ${this.orderByQuery ? this.orderByQuery : ''} LIMIT ? OFFSET ?`, [count + 1, offset]);
            }
            query[0].forEach((value, key) => {
                const newObject = new this.constructor();
                Object.assign(newObject, value);
                this[key] = newObject;
            });
            delete this.whereQuery;
            delete this.whereValues;
            delete this.orderByQuery;
            delete this.selectQuery;
            delete this.limitQuery;
            delete this.limitValue;
        }
        return new Paginator(req, this, count);
    }

    pluck (column) {
        let values = [];
        for (const object of Object.values(this)) {
            values.push(object[column]);
        }
        return values;
    }

    async save () {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (this.id) {
                const columns = Object.keys(this).filter((value) => {
                    return value !== "id" ? true : false;
                }).map((value) => {
                    return `\`${value}\` = ?`;
                }).join(", ");
                const values = Object.entries(this).filter(([key, value]) => {
                    return key !== "id" ? true : false;
                }).map(([key, value]) => {
                    return value;
                });
                values.push(this.id);
                await DB.driver.query(`UPDATE ${this.constructor.table} SET ${columns} WHERE id = ?`, values);
            }
            else {
                const columns = Object.keys(this).map(value => {
                    return `\`${value}\``;
                }).join(",");
                const values = Object.values(this);
                const result = await DB.driver.query(`INSERT INTO ${this.constructor.table} (${columns}) VALUES (${values.map(() => { return "?" }).join(",")})`, values);
                this.id = result[0].insertId;
            }
        }
        return this;
    }

    async delete () {
        if (process.env.DATABASE_DRIVER === "mysql") {
            if (this.id) {
                const values = [this.id];
                await DB.driver.query(`DELETE FROM ${this.constructor.table} WHERE id = ?`, values);
            }
            else {
                await DB.driver.query(`DELETE FROM ${this.constructor.table} ${this.whereQuery ? this.whereQuery : ''}`, this.whereValues);
                delete this.whereQuery;
                delete this.whereValues;
                delete this.orderByQuery;
                delete this.selectQuery;
            }
        }
        return this;
    }

    static async increment(column, number) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            await DB.driver.query(`UPDATE ${this.table} SET ${column} = ${column} + ${number}`);
        }
        return true;
    }

    async increment(column, number) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            await DB.driver.query(`UPDATE ${this.constructor.table} SET ${column} = ${column} + ${number} WHERE id = ${this.id}`);
            this[column] = this[column] + number;
        }
        return this;
    }

    static async decrement(column, number) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            await DB.driver.query(`UPDATE ${this.table} SET ${column} = ${column} - ${number}`);
        }
        return true;
    }

    async decrement(column, number) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            await DB.driver.query(`UPDATE ${this.constructor.table} SET ${column} = ${column} - ${number} WHERE id = ${this.id}`);
            this[column] = this[column] + number;
        }
        return this;
    }

    static async update (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            const columns = Object.keys(value).map((value) => {
                return `${value} = ?`
            }).join(", ");
            const values = Object.values(value);
            await DB.driver.query(`UPDATE ${this.table} SET ${columns}`, values);
        }
        return true;
    }

    async update (value) {
        if (process.env.DATABASE_DRIVER === "mysql") {
            const columns = Object.keys(value).map((value) => {
                return `${value} = ?`
            }).join(", ");
            const values = Object.values(value);
            values.push(...this.whereValues);
            await DB.driver.query(`UPDATE ${this.constructor.table} SET ${columns} ${this.whereQuery ? this.whereQuery : ''}`, values);
        }
        return true;
    }

    static #whereParser (key, value) {
        if (Array.isArray(value))
            if (value[0] === "=")
                return `${key} ${value[1] === null ? "IS NULL" : "= ?"}`;
            else if (value[0] === "!=")
                return `${key} ${value[1] === null ? "IS NOT NULL" : "!= ?"}`;
            else
                return `${key} ${value[0]} ?`;
        else
            return `${key} ${value === null ? "IS NULL" : "= ?"}`;
    }

}

export default Model;