import crypto from "crypto";

class AES {

    static encrypt(value) {
        if (typeof value === "object")
            value = JSON.stringify(value);

        const secretKey = this.#createSecretKey();
        const iv = this.#createIV();

        const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        encrypted = iv.toString('hex') + ':' + encrypted;

        return encrypted;
    }

    static decrypt(encryptedValue) {
        try {
            const parts = encryptedValue.split(':');
            const iv = Buffer.from(parts.shift(), 'hex');
            const encryptedText = Buffer.from(parts.join(':'), 'hex');
    
            const secretKey = this.#createSecretKey();
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        }
        catch (error) {
            return false;
        }
    }

    static #createSecretKey () {
        return crypto.createHash('sha256').update(process.env.APP_KEY).digest();
    }

    static #createIV () {
        return crypto.randomBytes(16);
    }

}

export default AES;