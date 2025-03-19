class BodyParser {

    static parse (body) {
        return BodyParser.#parse(body);
    }

    static #parse (body) {
        const object = BodyParser.#reformat([], body);
        const newData = {};
        Object.keys(object).forEach(key => {
            const processedData = BodyParser.#processData(key, object[key]);
            BodyParser.#assingData(newData, processedData);
        });
        return newData;
    }

    static #reformat (bodyObject, value) {
        for (const key in value) {
            if (value[key].type === "field") {
                bodyObject[key] = (value[key].value ? value[key].value.trim() : null);
            }
            else if (Array.isArray(value[key])) {
                bodyObject[key] = BodyParser.#reformat([], value[key]);
            }
            else if (value[key].type === "file" && value[key].filename) {
                const splitFileName = value[key].filename.split(".");
                bodyObject[key] = {
                    "type": "file",
                    "name": splitFileName.slice(0, -1).join("."),
                    "fullname": value[key].filename,
                    "extension": (splitFileName.length > 1 ? splitFileName[splitFileName.length - 1] : 'unknown'),
                    "mimetype": value[key].mimetype,
                    "file": value[key].file,
                    "buffer": value[key]._buf
                };
            }
        }
        return bodyObject;
    }

    static #processData(key, value, index = 0) {
        const array = key.replaceAll("]", "").split("[");
        if (array[index])
            return { [array[index]]: BodyParser.#processData(key, value, index + 1)};
        else {
            if (key.substring(key.length - 2) === "[]" && (typeof value === "string" || !Array.isArray(value))){
                return [ value ];
            }
            else
                return value;
        }
    }

    static #assingData (currentData, processedData) {
        const key = Object.keys(processedData)[0];
        if (currentData[key]) {
            BodyParser.#assingData(currentData[key], processedData[key]);
        }
        else {
            currentData[key] = processedData[key];
        }
    }

}

export default BodyParser;