import dotenv from "dotenv";
import fastify from 'fastify';
import pino from "pino";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import MySQL from "@fastify/mysql";
import MongoDB from "@fastify/mongodb";
import fastifyView from '@fastify/view';
import fastifyStatic from "@fastify/static";
import Route from "./Route.js";
import webRoutes from "../routes/web.js"
import sessionConfig from "../config/session.js";
import Redis from "ioredis";
import ConnectRedis from "connect-redis";
import ConnectFS from "session-file-store";
import DB from "./DB.js";
import Art from 'art-template';
import path from 'path';
import {fileURLToPath} from 'url';
import MultipartHandler from "./Handlers/MultiPartHandler.js";
import bodyHandler from "./Handlers/BodyHandler.js";
import Str from "./Str.js";
import DateTime from "./DateTime.js";
import lang from "./Lang.js";
import LanguageHandler from "./Handlers/LanguageHandler.js";
import { Server as SocketIO } from 'socket.io';
// import SocketController from "../app/Controllers/SocketController.js";
import Bootstrap from "../bootstrap/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {

    static async cli () {
        App.dotenv();
        App.server();
        await App.database();
    }

    static async web () {
        App.dotenv();
        App.bootstrap();
        App.server();
        App.view();
        App.static();
        App.multipart()
        App.formBody()
        App.language();
        App.routes();
        App.cookie();
        App.session();
        await App.database();
        App.start();
    }

    static dotenv () {
        dotenv.config();
    }

    static bootstrap () {
        Bootstrap.init();
    }

    static server () {
        if (process.env.LOG_CHANNEL === 'none') 
            var log = false;

        else if (process.env.LOG_CHANNEL === 'default')
            var log = true;

        else 
            var log = pino({ level: 'warn', timestamp: pino.stdTimeFunctions.isoTime }, pino.destination('./storage/logs/app.log'));
        
        this.serverFramework = fastify({
            logger: log,
            maxParamLength: 150
        });        
    }

    static view () {
        Art.defaults.imports.Object = Object;
        Art.defaults.imports.JSON = JSON;
        Art.defaults.imports.env = process.env;
        Art.defaults.imports.Str = Str;
        Art.defaults.imports.DateTime = DateTime;
        Art.defaults.imports.parseInt = parseInt;
        Art.defaults.imports.lang = lang;
        Art.defaults.imports.Date = Date;
        this.serverFramework.register(fastifyView, {
            engine: {
                "art-template": Art
            },
            templates: './resources/views',
        });
    }

    static static () {
        this.serverFramework.register(fastifyStatic, {
            root: path.join(__dirname, '../public'),
            prefix: "/static/",
        });
    }

    static multipart () {
        new MultipartHandler(this.serverFramework);
    }

    static formBody () {
        bodyHandler(this.serverFramework);
    }

    static language() {
        new LanguageHandler(this.serverFramework);
    }

    static routes () {
        Route.serverFramework = this.serverFramework;
        Route.setup();
    }

    static cookie () {
        this.serverFramework.register(cookie);
    }

    static session () {
        let store = null;
        if (process.env.SESSION_DRIVER === "redis") {
            const RedisClient = new Redis({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            });
            RedisClient.on("error", (err) => {
                throw err;
            });
            store = new ConnectRedis({
                client: RedisClient,
                prefix: process.env.APP_NAME + ":",
            })
        }
        else if (process.env.SESSION_DRIVER === "disk") {
            const FileStore = ConnectFS(session);
            store = new FileStore({
                "path": './storage/framework/sessions',
                "logFn": () => {},
            });
        }
        this.serverFramework.register(session, {
            "secret": process.env.APP_KEY,
            ...sessionConfig,
            "store": store,
        });
    }

    static async database () {
        if (process.env.DATABASE_DRIVER === "none") {
            return;
        }
        else if (process.env.DATABASE_DRIVER === "mysql") {
            await this.serverFramework.register(MySQL, {
                "promise": true,
                "connectionString": `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
            });
            DB.driver = this.serverFramework.mysql;
        }
        else if (process.env.DATABASE_DRIVER === "mongodb") {
            this.serverFramework.register(MongoDB, {
                forceClose: true,
                url: (process.env.DATABASE_PORT ? 
                    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority` :
                    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
                )
            }).then(() => {
                DB.driver = this.serverFramework.mongo;
            });
        }
    }

    static start () {
        process.on('uncaughtException', (err) => {
            console.error('Beklenmeyen bir hata oluştu:', err);
            // Uygulamanın kapanmasını önlemek için bir şeyler yapabilirsiniz.
        });
        this.serverFramework.listen({
            host: process.env.APP_URL.replace("http://", "").replace("https://", ""),
            port: process.env.APP_PORT,
        }, function (err, address) {
            if (err) {
                console.log(err);
                process.exit(1)
            }
            else {
                console.log(`Server listening at ${address}`);
            }
        });
        if (process.env.WEBSOCKET_ENABLE === "true") {
            this.io = new SocketIO(this.serverFramework.server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            SocketController.io = this.io;
            SocketController.run();
        }
    }

}

export default App;