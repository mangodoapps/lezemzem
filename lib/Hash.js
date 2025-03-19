import bcrypt, { hash } from 'bcrypt';
import config from '../config/hash.js';

class Hash {

    static make(textField) {
        const salt = bcrypt.genSaltSync(config.salt_rounds);
        return bcrypt.hashSync(textField + process.env.APP_KEY, salt);
    }

    static check(textField, hashedText) {
        return bcrypt.compareSync(textField + process.env.APP_KEY, hashedText);
    }

}

export default Hash;