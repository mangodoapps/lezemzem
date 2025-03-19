class Validator {

    static make(data, rules) {
        let messages = [];
        const skippedValues = [];

        Object.entries(rules).forEach(([key, rule]) => {
            let skipValue = false;
            skippedValues.forEach(element => {
                if (key.indexOf(element) !== -1) {
                    skipValue = true;
                }
            });
            if (skipValue === false) {
                let processedData = Validator.#processNestedData(data, key.split("."), rule);
                if (processedData === undefined) {
                    skippedValues.push(key);
                }
                else if (processedData){
                    skippedValues.push(key);
                    messages.push(...processedData);
                }
            }
        });
        messages = [...new Set(messages)];
        return (messages.length !== 0 ? messages : null);
    }

    static #processNestedData(data, pathArray, rule, index = 0) {
        if (index >= pathArray.length) {
            const messages = [];
            rule.split("|").every(ruleValue => {
                const validate = Validator.#validate(ruleValue, pathArray.join("."), data);
                if (validate.status === false) {
                    messages.push(validate.message);
                    return false;
                }
                return validate;
            });
            return (messages.length !== 0 ? messages : null);
        }

        const part = pathArray[index];
        if (pathArray.includes("*")) {
            if (part === "*") {
                const tempProcessData = [];
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        const processedData = Validator.#processNestedData(item, pathArray, rule, index + 1);
                        if (processedData !== null) {
                            tempProcessData.push(...processedData);
                        }
                    });
                }
                else {
                    Object.entries(data).forEach(([key, value]) => {
                        const processedData = Validator.#processNestedData(value, pathArray, rule, index + 1);
                        if (processedData !== null) {
                            tempProcessData.push(...processedData);
                        }
                    })
                }
                return (tempProcessData.length !== 0 ? tempProcessData : null);
            }
            else {
                if (data[part] === undefined && rule.indexOf("nullable") !== -1) {
                    return undefined;
                }
                const processedData = Validator.#processNestedData(data[part], pathArray, rule, index + 1);
                return processedData;
            }
        }
        else {
            if (data[part] === undefined && rule.indexOf("nullable") !== -1) {
                return undefined;
            }
            const processedData = Validator.#processNestedData(data[part], pathArray, rule, index + 1);
            return processedData;
        }
    }

    static #validate(rule, key, value) {
        if (rule === "required") {
            return Validator.#required(key, value);
        } else if (rule === "nullable") {
            return Validator.#nullable(key, value);
        } else if (rule === "string") {
            return Validator.#string(key, value);
        } else if (rule === "integer") {
            return Validator.#integer(key, value);
        } else if (rule === "numeric") {
            return Validator.#numeric(key, value);
        } else if (rule === "array" || rule === "object") {
            return Validator.#object(key, value);
        } else if (rule === "file") {
            return Validator.#file(key, value);
        } else if (rule === "email") {
            return Validator.#email(key, value);
        } else if (rule.indexOf("min:") !== -1) {
            return Validator.#min(key, value, rule.split(":").pop());
        } else if (rule.indexOf("max:") !== -1) {
            return Validator.#max(key, value, rule.split(":").pop());
        } else if (rule.indexOf("mimes:") !== -1) {
            return Validator.#mimes(key, value, rule.split(":").pop());
        } else if (rule.indexOf("mime_types:") !== -1) {
            return Validator.#mime_types(key, value, rule.split(":").pop());
        }
    }
    
    static #required(key, value) {
        if (!value) {
            return { status: false, message: `"${key}" field is required.` };
        } else if (typeof value === "string" && value.replaceAll(" ", "") === "") {
            return { status: false, message: `"${key}" field is required.` };
        }
        return true;
    }

    static #nullable(key, value) {
        if (value) {
            return true;
        }
        return false;
    }

    static #string(key, value) {
        if (typeof value !== "string") {
            return { status: false, message: `"${key}" field must be string.` };
        }
        return true;
    }

    static #integer(key, value) {
        if (isNaN(Number(value)) || !Number.isInteger(parseInt(value))) {
            return { status: false, message: `"${key}" field must be integer.` };
        }
        return true;
    }

    static #numeric(key, value) {
        if (!isNaN(parseFloat(value)) && parseFloat(value).toString() === value.toString()) {
            return true;
        } else {
            return { status: false, message: `"${key}" field must be a numeric value.` };
        }
    }


    static #object(key, value) {
        if (typeof value !== "object") {
            return { status: false, message: `"${key}" field must be an object.` };
        }
        return true;
    }

    static #file(key, value) {
        if (!value.type || value.type !== "file") {
            return { status: false, message: `"${key}" field must be a file.` };
        }
        return true;
    }

    static #email(key, value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            return { status: false, message: `"${key}" field must be a valid email address.` };
        }
        return true;
    }

    static #min(key, value, length) {
        if (typeof value === "object") {
            if (Object.keys(value).length < length) {
                return { status: false, message: `"${key}" field must contain at least ${length} object.` };
            }
        }
        else if (typeof value === "string") {
            if (value.length < length) {
                return { status: false, message: `"${key}" field must contain a minimum of ${length} characters.` };
            }
        }
        else if (typeof value === "integer") {
            if (parseInt(value) < length) {
                return { status: false, message: `"${key}" field must be at least ${length}.` };
            }
        }
        return true;
    }

    static #max(key, value, length) {
        if (typeof value === "object") {
            if (Object.keys(value).length > length) {
                return { status: false, message: `"${key}" field must contain at most ${length} object.` };
            }
        }
        else if (typeof value === "string") {
            if (value.length > length) {
                return { status: false, message: `"${key}" field must contain a maximum of ${length} characters.` };
            }
        }
        else if (typeof value === "integer") {
            if (parseInt(value) > length) {
                return { status: false, message: `"${key}" field must be a maximum of ${length}.` };
            }
        }
        return true;
    }

    static #mimes(key, value, mimes) {
        const mimeArray = mimes.split(",");
        if (value.mimetype === "image/jpeg") value.mimetype = "jpeg";
        else if (value.mimetype === "image/png") value.mimetype = "png";
        else if (value.mimetype === "image/gif") value.mimetype = "gif";
        else if (value.mimetype === "image/webp") value.mimetype = "webp";
        else if (value.mimetype === "image/x-icon") value.mimetype = "ico";
        else if (value.mimetype === "application/json") value.mimetype = "json";
        else if (value.mimetype === "image/bmp") value.mimetype = "bmp";
        else if (value.mimetype === "image/tiff") value.mimetype = "tiff";
        else if (value.mimetype === "image/svg+xml") value.mimetype = "svg";
        else if (value.mimetype === "image/heic") value.mimetype = "heic";
        else if (value.mimetype === "image/avif") value.mimetype = "avif";
        else if (value.mimetype === "application/pdf") value.mimetype = "pdf";
        else if (value.mimetype === "application/msword") value.mimetype = "doc";
        else if (value.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") value.mimetype = "docx";
        else if (value.mimetype === "application/vnd.ms-excel") value.mimetype = "xls";
        else if (value.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") value.mimetype = "xlsx";
        else if (value.mimetype === "application/vnd.ms-powerpoint") value.mimetype = "ppt";
        else if (value.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") value.mimetype = "pptx";
        else if (value.mimetype === "text/plain") value.mimetype = "txt";
        else if (value.mimetype === "audio/mpeg") value.mimetype = "mp3";
        else if (value.mimetype === "audio/ogg") value.mimetype = "ogg";
        else if (value.mimetype === "video/mp4") value.mimetype = "mp4";
        else if (value.mimetype === "video/webm") value.mimetype = "webm";
        else if (value.mimetype === "video/x-msvideo") value.mimetype = "avi";
        else if (value.mimetype === "application/zip") value.mimetype = "zip";
        else if (value.mimetype === "application/x-rar-compressed") value.mimetype = "rar";

        if (!mimeArray.includes(value.mimetype)) {
            return { status: false, message: `Type of file in the "${key}" field is not allowed. Allowed file types: ${mimes}` };
        }
        return true;
    }

    static #mime_types(key, value, mimes) {
        const mimeArray = mimes.split(",");
        if (!mimeArray.includes(value.mimetype)) {
            return { status: false, message: `Type of file in the "${key}" field is not allowed. Allowed file mime types: ${mimes}` };
        }
        return true;
    }

}

export default Validator;