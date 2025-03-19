import Kernel from "../app/Kernel.js"

class Route{

    constructor(index) {
        this.index = index;
    }

    static serverFramework = null;
    static routes = [];

    static setup () {
        Route.routes.forEach((val) => {
            Route.serverFramework[val.type](val.url, {
                preHandler: val.middlewares
            }, val.handler);
        });
    }

    static get (url, handler) {
        Route.routes.push({
            "type": "get",
            "url": url,
            "handler": handler
        });
        return new Route(Route.routes.length - 1);
    }

    static post (url, handler) {
        Route.routes.push({
            "type": "post",
            "url": url,
            "handler": handler
        });
        return new Route(Route.routes.length - 1);
    }

    static middleware (handler) {
        if (typeof handler === "string") {
            handler = [handler];
        }
        const newHandler = [];
        handler.forEach((val) => {
            newHandler.push(Kernel.routeMiddlewares[val].handler);
        }); 
        Route.routes.push({
            "type": "group",
            "middlewares": newHandler
        });
        return new Route(Route.routes.length - 1);
    }

    middleware (handler) {
        if (typeof handler === "string") {
            handler = [handler];
        }
        const newHandler = [];
        handler.forEach((val) => {
            newHandler.push(Kernel.routeMiddlewares[val].handler);
        }); 
        Route.routes[this.index].middlewares = newHandler;
        return this;
    }

    static prefix (url) {
        Route.routes.push({
            "type": "group",
            "prefix": url
        });
        return new Route(Route.routes.length - 1);
    }

    prefix (url) {
        Route.routes[this.index].prefix = url;
        return this;
    }

    group (func) {
        func();
        const groupRoute = Route.routes[this.index];
        Route.routes.splice(this.index + 1).forEach((val) => {
            let newRoute = "";
            if (groupRoute.prefix) {
                newRoute += groupRoute.prefix;
            }
            if (val.url && val.url !== "/") {
                newRoute += val.url;
            }
            let middlewares = [];
            if (groupRoute.middlewares) {
                middlewares.push(...groupRoute.middlewares);
            }
            if (val.middlewares) {
                middlewares.push(...val.middlewares);
            }
            Route.routes.push({
                "type": val.type,
                "url": newRoute,
                "handler": val.handler,
                "middlewares": middlewares
            });
        });
        Route.routes.splice(this.index, 1);
    }

}

export default Route;