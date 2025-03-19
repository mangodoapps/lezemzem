class Blueprint {

    constructor () {
        this.columns = [];
    }

    id () {
        this.columns.push({ name: "id", type: "BIGINT AUTO_INCREMENT" });
        this.columns.push({ name: "", type: "PRIMARY KEY(id)", nullable: true });
        return this;
    }

    rememberToken () {
        this.columns.push({ name: "rememberToken", type: "TEXT", nullable: true });
        return this;
    }

    string (columnName, length = 255) {
        this.columns.push({ name: columnName, type: `VARCHAR(${length})` });
        return this;
    }

    integer (columnName) {
        this.columns.push({ name: columnName, type: "INTEGER" });
        return this;
    }

    text (columnName) {
        this.columns.push({ name: columnName, type: "TEXT" });
        return this;
    }

    nullable () {
        this.columns[this.columns.length - 1].nullable = true;
        return this;
    }
    
    default (value) {
        this.columns[this.columns.length - 1].default = value;
        return this;
    }

}

export default Blueprint;