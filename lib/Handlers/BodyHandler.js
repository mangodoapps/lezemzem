import fastifyFormbody from "@fastify/formbody";
import QueryString from "qs";

async function bodyHandler (serverFramework) {

    serverFramework.register(fastifyFormbody, {
        parser: str => QueryString.parse(str)
    });

}

export default bodyHandler;