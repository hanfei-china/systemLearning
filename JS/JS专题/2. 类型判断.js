/*
    类型判断
        一：数据类型
            1. 大的数据类型分类
                Undefined  Null  String  Boolean  Number  Object
            2. Object数据类型又可以进行细分
                Array Date RegExp Function Error等等
        二：各种类型判断的方法
            1. typeof
                1. 使用方法---可以按照方法来使用，也可以当作一个一元的操作符
                    typeof('asdf')     typeof 'asdf'
                2. 有效范围
                    1. 对于三种简单数据类型都可以判断（String  Boolean  Number）;
                    2. Undefined----undefined
                    3. Null Object   ---object
                    4. 对于Object的小类型中，typeof可以判断是否为函数。即  Function--function
                3. 特点：
                    1. 可以用来区分简单数据类型还是复杂数据类型
                    2. 可以用来判断简单数据类型的具体类型
                    3. 可以用来判断是否为函数
                5.注意：使用typeof判断，返回的结果都是小写的

            2. 那如果我们想要更加细化的去判断其类型---Object.prorotype.toString
                1. 使用方法：
                    1. 这个方法本质上是返回调用此方法的数据类型（即this的数据类型），所以我们使用的时候要改变内部的this指向
                    2. Object.prorotype.toString.call('asdf')
                    3. 返回值：由3个部分组成
                        1. [object
                        2. 数据类型
                        3. ]
                2. 使用示例
                    var number = 1;          // [object Number]
                    var string = '123';      // [object String]
                    var boolean = true;      // [object Boolean]
                    var und = undefined;     // [object Undefined]
                    var nul = null;          // [object Null]
                    var obj = {a: 1}         // [object Object]
                    var array = [1, 2, 3];   // [object Array]
                    var date = new Date();   // [object Date]
                    var error = new Error(); // [object Error]
                    var reg = /a/g;          // [object RegExp]
                    var func = function a(){}; // [object Function]
                    var math=new Math()      //[object Math]
                    var json=JSON.stringify({a:1,b:2})  //[object JSON]
                    
*/

//类型判断方法的封装
//要求：当为基本类型的时候，用typeof，复杂数据类型的话就使用toString
//同时，因为typeof的结果都是小写的，所以要求判断的时候所有的结果都是小写的


//创建一个Object.prototype.toString的结果集合
var classType = {};
['Undefined', 'Null', 'Number', 'Boolean', 'String', 'Object', 'Math', 'JSON', 'RegExp', 'Date', 'Error', 'Array', 'Function'].forEach(item => {
    classType['[object ' + item + ']'] = item.toLowerCase();
})

//使用Object.prototype.toString方法，返回类型结果
function type(obj) {
    return typeof obj === 'object' || typeof obj == 'function' ? classType[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}
// var arr = [1, 2, 3];
// var tp = type(arr);
// console.log(tp); //array


//然后就可以进行单独类型的判断了------这里为什么将返回结果，结果集合 以及 类型判断分开。---单一化原则。各做各的，这样后面维护也方便。

//比如数组的判断
function isArray(obj) {
    return type(obj) == 'array'
}
var arr = [1, 2, 3];
var obj = {
    a: 1,
    b: 2
}
console.log(isArray(arr)); //true
console.log(isArray(obj)); //false