import authConfig from "../config/auth.js";
import Hash from "./Hash.js";
import crypto from "crypto";

class Auth {

    static guard(guard) {
        const object = new Auth();
        object.guard = guard;
        return object;
    }

    static async check(data) {
        return await Auth.#checkService(data);
    }

    async check(data) {
        return await Auth.#checkService(data, this.guard);
    }

    static async login(request, data, remember = false) {
        return await Auth.#loginService(request, data, remember);
    }

    async login(request, data, remember = false) {
        return await Auth.#loginService(request, data, remember, this.guard);
    }

    static async has(request) {
        return (await Auth.#hasService(request) ? true : false);
    }

    async has(request) {
        return (await Auth.#hasService(request, this.guard) ? true : false);
    }

    static async user(request) {
        return await Auth.#getUserService(request) ? true : false;
    }

    async user(request) {
        return await Auth.#getUserService(request, this.guard);
    }

    static logout(request) {
        return Auth.#logoutService(request);
    }

    logout(request) {
        return Auth.#logoutService(request, this.guard);
    }

    static async #checkService(data, guard = Object.keys(authConfig.guards)[0]) {
        const guardModel = Auth.#getGuardModel(guard);
        const attempt = await Auth.#attempt(data, guardModel)
        return (attempt === false ? false : true);
    }

    static async #loginService(request, data, remember = false, guard = Object.keys(authConfig.guards)[0]) {
        const guardModel = Auth.#getGuardModel(guard);
        const attempt = await Auth.#attempt(data, guardModel);
        if (attempt === false) {
            return false;
        }
        Auth.#createSession(request, attempt, guard);
        return true;
    }

    static #logoutService(request, guard = Object.keys(authConfig.guards)[0]) {
        Auth.#removeSession(request, guard);
        return true;
    }

    static async #hasService(request, guard = Object.keys(authConfig.guards)[0]) {
        const session = Auth.#getSession(request, guard);
        if (!session)
            return false;
        const guardModel = Auth.#getGuardModel(guard);
        const user = await Auth.#getUserData(session, guardModel);
        if (!user) {
            Auth.#removeSession(request, guard);
            return false;
        }
        return true;
    }

    static async #getUserService (request, guard = Object.keys(authConfig.guards)[0]) {
        const session = Auth.#getSession(request, guard);
        const guardModel = Auth.#getGuardModel(guard);
        const user = await Auth.#getUserData(session, guardModel);
        return user;
    }

    static async #attempt(data, guardModel) {
        const parsedData = Auth.#parseData(data);
        const user = await guardModel.where(parsedData).first();
        if (!user)
            return false;
        if (!Hash.check(data.password, user.password))
            return false;
        return user.id;
    }
    
    static async #getUserData (session, guard) {
        const user = await guard.find(session);
        return user;
    }

    static #parseData(data) {
        data = { ...data };
        delete data.password;
        return data;
    }

    static #getGuardModel(guardName) {
        return authConfig.guards[guardName];
    }

    static #createSession(request, userID, guard) {
        const hash = crypto.createHash('sha3-256');
        const hashedData = hash.update(process.env.APP_KEY, 'utf-8').digest('hex');
        request.session.set("auth_" + guard + "_" + hashedData, userID);
    }

    static #getSession(request, guard) {
        const hash = crypto.createHash('sha3-256');
        const hashedData = hash.update(process.env.APP_KEY, 'utf-8').digest('hex');
        return request.session.get("auth_" + guard + "_" + hashedData);
    }

    static #removeSession(request, guard) {
        const hash = crypto.createHash('sha3-256');
        const hashedData = hash.update(process.env.APP_KEY, 'utf-8').digest('hex');
        delete request.session["auth_" + guard + "_" + hashedData];
    }

}

export default Auth;