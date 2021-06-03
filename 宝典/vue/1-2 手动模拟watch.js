function watch(obj, property) {
    var value = obj[property];
    Object.defineProperty(obj, property, {
        get() {
            return value;
         },
        set(newVal) {
            value = newVal;
        }
    })
}