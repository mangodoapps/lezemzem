import Auth from "../lib/Auth.js";
import DateTime from "../lib/DateTime.js";
import Storage from "../lib/Storage.js";
import view from "../lib/View.js";

class Bootstrap {

    static init () {
        global.view = view;
        global.date = DateTime;
        global.Auth = Auth;
        global.Storage = Storage;
    }

}

export default Bootstrap;