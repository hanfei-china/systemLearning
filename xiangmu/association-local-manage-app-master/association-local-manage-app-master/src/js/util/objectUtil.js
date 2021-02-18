/**
 * 深度复制对象
 * @param obj
 * @returns {any}
 */

export function deepCopy(obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }

}

export function deepCopy2(obj, newObj) {
    for (const key in obj) {
        if (obj[key] instanceof Array) {
            newObj[key] = [];
            newObj[key] = deepCopy2(obj[key], newObj[key]);
        } else if (obj[key] instanceof Object) {
            newObj[key] = {};
            newObj[key] = deepCopy2(obj[key], newObj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function exDeepCopy(obj) {
    if (!isObject(obj)) {
        throw new TypeError(`${obj} is not a object`)
    }

    let res = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = isObject(obj[key]) ? exDeepCopy(obj[key]) : obj[key]
        }
    }

    return res
}