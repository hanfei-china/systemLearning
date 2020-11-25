function deepClone(obj) {
    // 如果是 值类型 或 null，则直接return
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }

    // 定义结果对象
    let copy = {}

    // 如果对象是数组，则定义结果数组
    if (obj.constructor === Array) {
        copy = []
    }

    // 遍历对象的key
    for (let key in obj) {
        // 如果key是对象的自有属性
        if (obj.hasOwnProperty(key)) {
            // 递归调用深拷贝方法
            copy[key] = deepClone(obj[key])
        }
    }

    return copy
}
var obj = {
    a: 1,
    b: {
        b1: 2
    },
    c: [3, 3, 3]
}
var obj1 = deepClone(obj);
console.log(obj1);