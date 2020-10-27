//new的实现可以参照new的过程
/*
    new的过程
        1. 创建一个新的对象
        2. 执行构造函数内部的代码并改变this指向，继承属性
        3. 通过原型链继承构造函数的方法
        4. 返回这个对象
*/

function sameNew() {
    //创建对象
    var obj = {};
    //获取到构造函数
    var fun = [].shift.call(arguments);
    //执行构造函数内部代码，并改变this指向---获取属性
    var arr = Array.prototype.slice.call(arguments); //这里为什么没从下标为1的时候开始截取？因为上面使用了shift方法，将数组的头部去掉了一个元素
    fun.apply(obj, arr);
    //获取方法
    obj.__proto__ = fun.prototype;
    //返回这个对象
    return obj;
}

function Fn(name, age) {
    this.name = name;
    this.age = age;
}
Fn.prototype.fn = function() {
    console.log(this.name + '今年' + this.age + '岁了');
}

var obj = sameNew(Fn, '刘亦菲', 18);
obj.fn();