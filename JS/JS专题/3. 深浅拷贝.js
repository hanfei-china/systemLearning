/*
    一：浅拷贝的方法
        1. 数组：数组的浅拷贝方法就是数组的各个方法
            1. 比如splice  concat  slice 等
            2. 一层遍历
            3. ES6的解构赋值
        2. 对象
            1. 一层遍历
            2. copyObj=Object.assign({},obj);
            3. copyObj={...obj};
*/

//深拷贝
/*
    深拷贝的分析：深拷贝的原因：内层数量不一定，且可能有引用数据类型。对于引用数据类型又需要进行进行深拷贝。因此就形成了递归
    对于递归：
        1. 递归式：
            1. 判断是什么数据类型---数组、对象或者是简单数据类型
            2. 对于复杂数据类型，那么继续进行深拷贝---分数组还是对象，是因为赋值的时候要注意数据类型的
            3. 对于简单数据类型，直接赋值
        2. 递归边界
            1. 引用数据类型最终都是成了简单数据类型，所以会自动停止递归。
*/
function deepCopy(copyObj, obj) {
    for (const key in obj) {
        if (key instanceof Array) {
            copyObj[key] = [];
            copyObj[key] = deepCopy(copyObj[key], obj[key]);
        } else if (key instanceof Object) {
            copyObj[key] = {};
            copyObj[key] = deepCopy({}, obj[key]);
        } else {
            copyObj[key] = obj[key];
        }
        return copyObj;
    }
}