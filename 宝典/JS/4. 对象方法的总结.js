/*
    1. 对象的遍历   forin  注意：ES6的迭代器不能迭代对象
    2. 获取对象所有的键   Object.keys(obj);
    3. 对象的合并   Object.assign({},obj);---也可以用来进行对象的浅拷贝
*/
var obj = {
    a: 1,
    b: 2,
    c: 3
};
// console.log(Object.keys(obj));
var copyObj = Object.assign({ d: 4 }, obj);
// console.log(copyObj);
