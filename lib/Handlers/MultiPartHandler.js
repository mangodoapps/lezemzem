import fastifyMultipart from "@fastify/multipart";
import BodyParser from "../BodyParser.js";

class MultipartHandler {

    constructor (framework) {
        framework.register(fastifyMultipart, {
            attachFieldsToBody: true,
            limits: {
                fieldNameSize: 100,  // Max field name size in bytes
                fieldSize: 5000000,  // Max field value size in bytes
                fields: 100,         // Max number of non-file fields
                fileSize: 100000000,  // For multipart forms, the max file size in bytes (100 MB)
                files: 10,           // Max number of file fields
                headerPairs: 2000,   // Max number of header key=>value pairs
                parts: 1000          // For multipart forms, the max number of parts (fields + files)
            }
        });
        framework.addHook('preValidation', async (req, res) => {
            if (req.isMultipart()) {
                req.body = BodyParser.parse(req.body);
            }
        });
    }

}

export default MultipartHandler;