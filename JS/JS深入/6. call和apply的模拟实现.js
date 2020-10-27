//call函数，必传的参数是this指向的目标对象，然后函数本身的参数可有可无，对应的也是可传可不传。
//改变函数内部的this指向，首先我们要考虑的就是：函数内部的this指向在改变前是指向哪儿的？受什么影响？
//因为JS是静态作用域，所以函数内部的this指向在函数创建的时候就应该确定了。也就是说函数内部的this指向是和函数做处的环境有关的
//那么这里改变函数内部的this指向，其实就是改变函数所处的环境，换句话说，就是将函数称为目标对象的一个方法---这样函数内部的this指向就指向了这个对象


//同时，我们要考虑函数本身的一些问题：是否传参---不确定，传参的个数---同样不确定，是否有返回值
Function.prototype.call2 = function(obj) {
    var obj = obj || window; //在JS中找不到window，要在HTML文件中才有这个全局变量的
    obj.fn = this; //这个this指向的实例对象，即函数
    //收集函数可能有的参数---arguments---伪数组，可以使用for循环，但是不能使用数组的一些方法
    var arr = [];
    //i要从1开始---避开必传的目标对象
    for (let i = 1; i < arguments.length; i++) {
        arr.push(arguments[i]);
    };
    var res = obj.fn(...arr);
    delete obj.fn;
    return res;
}

var obj = {
    a: '很漂亮'
};
var a = '太好看了';

function fn(name, age) {
    console.log(age + '岁的' + name + this.a);
}

// fn.call2(obj, '刘亦菲', 18);
// fn.call2(null, '刘亦菲', 18);





//apply方法
Function.prototype.apply2 = function(obj) {
    obj.fn = this;
    var arr = arguments[1];
    var res = obj.fn(...arr);
    delete obj.fn;
    return res;
}

var arr = [2, 3, 1, 5, 4, 6];
var max = Math.max.apply2(arr, arr);
console.log(max);