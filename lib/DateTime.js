import appConfig from "../config/app.js"

class DateTime {

    static getTime (date = null) {
        const timezone = DateTime.#setTimezone(date);
        return new Date(timezone).getTime();
    }

    static getDay (date = null) {
        const timezone = DateTime.#setTimezone(date);
        return new Date(timezone).getDay();
    }

    static getMonth (date = null) {
        const timezone = DateTime.#setTimezone(date);
        return new Date(timezone).getMonth() + 1;
    }

    static getYear (date = null) {
        const timezone = DateTime.#setTimezone(date);
        return new Date(timezone).getFullYear();
    }

    static getDate (timestamp = null, format = null, lang = "en") {
        if (timestamp && typeof timestamp === "string")
            timestamp = parseInt(timestamp);
        const timezone = DateTime.#setTimezone(timestamp);
        if (format)
            return DateTime.#setFormat(timezone, format, lang);

        return new Date(timezone).toLocaleString("en-US");
    }

    static #setTimezone (date = null) {
        const options = {
            timeZone: appConfig.timezone
        }
        if (date)
            return new Date(date).toLocaleString("en-US", options);

        return new Date().toLocaleString("en-US", options);
    }

    static #setFormat (timezone, format, lang) {
        const date = new Date(timezone);
        const oldFormat = format;
        if (oldFormat.indexOf("d") !== -1)
            format = format.replaceAll("d", (date.getDate().toString().length < 2 ? "0" + date.getDate() : date.getDate()));
        if (oldFormat.indexOf("D") !== -1)
            format = format.replaceAll("D", DateTime.#getDayName(date.getDay(), lang));
        if (oldFormat.indexOf("m") !== -1)
            format = format.replaceAll("m", ((date.getMonth() + 1).toString().length < 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)));
        if (oldFormat.indexOf("M") !== -1)
            format = format.replaceAll("M", DateTime.#getMonthName((date.getMonth() + 1), lang));
        if (oldFormat.indexOf("Y") !== -1)
            format = format.replaceAll("Y", date.getFullYear());
        if (oldFormat.indexOf("H") !== -1)
            format = format.replaceAll("H", (date.getHours().toString().length < 2 ? "0" + date.getHours() : date.getHours()));
        if (oldFormat.indexOf("i") !== -1)
            format = format.replaceAll("i", (date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes()));
        return format;
    }

    static #getMonthName(month, lang) {
        if (lang === "tr") {
            switch (month) {
                case 1:
                    return "Ocak";
                case 2:
                    return "Şubat";
                case 3:
                    return "Mart";
                case 4:
                    return "Nisan";
                case 5:
                    return "Mayıs";
                case 6:
                    return "Haziran";
                case 7:
                    return "Temmuz";
                case 8:
                    return "Ağustos";
                case 9:
                    return "Eylül";
                case 10:
                    return "Ekim";
                case 11:
                    return "Kasım";
                case 12:
                    return "Aralık";
            }
        }
        else {
            switch (month) {
                case 1:
                    return "January";
                case 2:
                    return "February";
                case 3:
                    return "March";
                case 4:
                    return "April";
                case 5:
                    return "May";
                case 6:
                    return "June";
                case 7:
                    return "July";
                case 8:
                    return "August";
                case 9:
                    return "September";
                case 10:
                    return "October";
                case 11:
                    return "November";
                case 12:
                    return "December";
            }
        }
    }

    static #getDayName(day, lang) {
        if (lang === "tr") {
            switch (day) {
                case 0:
                    return "Pazar";
                case 1:
                    return "Pazartesi";
                case 2:
                    return "Salı";
                case 3:
                    return "Çarşamba";
                case 4:
                    return "Perşembe";
                case 5:
                    return "Cuma";
                case 6:
                    return "Cumartesi";
            }
        }
        else {
            switch (day) {
                case 0:
                    return "Sunday";
                case 1:
                    return "Monday";
                case 2:
                    return "Tuesday";
                case 3:
                    return "Wednesday";
                case 4:
                    return "Thursday";
                case 5:
                    return "Friday";
                case 6:
                    return "Saturday";
            }
        }
    }

    static formatHoursToHHMMSS(hours) {
        const totalSeconds = Math.floor(hours * 3600);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const formattedHours = Math.floor(totalSeconds / 3600);
    
        // Sayıları iki basamaklı olarak formatla
        const formattedSeconds = seconds.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedHoursStr = formattedHours.toString().padStart(2, '0');
    
        return `${formattedHoursStr}:${formattedMinutes}:${formattedSeconds}`;
    }

}

export default DateTime;