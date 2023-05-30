const that = module.exports = {
    isTypeArray: (typeArr, arr) => arr.every(item => typeof item === typeArr),
    isNumeric: (value) => (typeof value === 'string') ? !isNaN(value % 1) : (typeof value === 'number'),
    isObject: (value) => typeof value === 'object' && !Array.isArray(value) &&
        value !== null,
    getValueNested: (obj, keyNested) => {
        keyNested = keyNested.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        keyNested = keyNested.replace(/^\./, '');           // strip a leading dot
        const a = keyNested.split('.');
        for (const i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in obj) {
                obj = obj[k];
            } else {
                return;
            }
        }
        return obj;
    },
    getValueLastNested: (obj) => {
        if (typeof obj !== 'object') {
            return obj;
        }
        for (prop in obj) {
            return getValueLastNested(obj[prop])
        }
    },
    convertObjectToStringNested: (obj, name) => {
        let outputObj = {};
        let recursive = (obj, name) => {
            for (let key in obj) {
                if (typeof obj[key] == 'object') {
                    recursive(obj[key], name + '.' + key)
                } else {
                    outputObj[name + '.' + key] = obj[key];
                }
            }
        }
        recursive(obj, name)
        return outputObj;
    },
    formatDate: (date) => new Intl.DateTimeFormat(['ban', 'id'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date).replaceAll(".", ":").replace(" ", ", "),
    toDateTimeMySQL: (dateObj) => {
        const date = new Date(dateObj).toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).slice(0, 20).replace('T', ' ').split(", ");
        return `${date[0].split("/").reverse().join("-")} ${date[1]}`;
    },
    removeDiacritics: (str = "") => str.normalize("NFD")?.replace(/\p{Diacritic}/gu, ""),
    currencyVND: (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 }).format(value),
    typeOf: (value) => Object.prototype.toString.call(value).slice(8, -1),
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return that.formatDate(result);
    },
    calculateDistanceKm: ({ lat1, lon1 }, { lat2, lon2 }) => {
        const degreesToRadians = (degrees) => degrees * Math.PI / 180;
        const R = 6371; // km
        const earthRadiusKm = 6371;

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    },

}