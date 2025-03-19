import nodemailer from "nodemailer";
import view, { View } from "./View.js";


class Mail {

    static from (email) {
        return Mail.#fromService(new Mail(), email);
    }
    from (email) {
        return Mail.#fromService(this, email);
    }

    static to (email) {
        return Mail.#toService(new Mail(), email);
    }
    to (email) {
        return Mail.#toService(this, email);
    }

    subject (subject) {
        this.subject = subject;
        return this;
    }

    text (message) {
        this.text = message;
        return this;
    }

    view (res, view, data = null) {
        this.view = View.renderFile(view, data);
        return this;
    }

    async send (transportCallback = null) {
        let transporter;
        if (typeof transportCallback === "function"){
            const transportData = { MAIL_HOST: null, MAIL_PORT: null, MAIL_USERNAME: null, MAIL_PASSWORD: null, MAIL_SECURE: null };
            transportCallback(transportData);
            transporter = Mail.#createTransport(transportData);
        }
        else {
            transporter = Mail.#createTransport(process.env);
        }
        const response = await Mail.#sendMail(this, transporter);
        return response;
    }

    static #fromService (object, email) {
        object.fromAddress = email;
        return object;
    }

    static #toService (object, email) {
        object.toAddress = email;
        return object;
    }

    static #createTransport (transportData) {
        return nodemailer.createTransport({
            host: transportData.MAIL_HOST,
            port: transportData.MAIL_PORT,
            secure: transportData.MAIL_SECURE || false,
            auth: {
                user: transportData.MAIL_USERNAME,
                pass: transportData.MAIL_PASSWORD,
            },
        });
    }

    static async #sendMail (object, transporter) {
        const response = await transporter.sendMail({
            from: object.fromAddress || null,
            to: object.toAddress || null,
            subject: object.subject || null,
            text: object.text || null,
            html: object.view || null,
        });
        transporter.close();
        return response;
    }

}

export default Mail;