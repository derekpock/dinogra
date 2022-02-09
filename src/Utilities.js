export function defaultObjectValue(obj, key, defaultValue) {
    if (!obj.hasOwnProperty(key)) {
        obj[key] = defaultValue;
        return true;
    }
    return false;
}