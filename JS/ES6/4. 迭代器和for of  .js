/*
    一：迭代其和for of 出现的原因：
        我们在使用for循环时，要提前定义索引变量和长度变量。而我们使用的过程中可能只需要拿到成员本身，那么索引和长度其实对我们来说没有用，反而增加了代码的复杂度。尤其当我们使用嵌套的循环时，很可能会因为引用变量错误造成代码报错等。
        为了解决这个问题，ES6提供了for of循环。
        注意：为什么我们只和for循环比较，而不比较forEach等。因为for循环是所有其他方法的本质，都是更具for循环实现的一个方法而已。而for of就是一个相当于for循环的一个底层循环方式。
    二：迭代器
        1. for of只能使用在迭代器对象上
        2. 迭代器对象是由迭代器生成的。迭代器就是一个对象，这个对象上有一个next方法，执行后返回一个迭代器对象。这个对象上有两个属性：
            1. done属性---遍历是否结束
            2. value属性---当前元素的值
    三：for of
        1. for of可以遍历的要求：for of可以遍历一个元素的Symbol.iterator属性上的迭代器对象
            比如我们有一个对象，我们直接去使用for of，不能遍历，会报错。但我我们给这个对象添加一个Symbol.iterator属性，同时这个属性的属性值是一个迭代器。此时就可以使用for of遍历了。
        2. JS中默认有Symbol.iterator属性的数据类型：
            1. 数组
            2. set
            3. 伪数组，如arguments 
            4. Map
            5. 字符串
            6. Generator 对象
    四：内建迭代器---为了方便使用，JS内部还有其他的迭代器，可以获取到不同的值
        1. keys()    用于获取键名---对于数组来说，就是获取到索引。注意:set对象获取到的和键名相同。说明set对象和数组对象的索引是不同的.
        2. values()    用于获取键值
        3. entries()    用于获取[键名,键值]形式的值
*/


//使用ES5创建一个迭代器
function createIterator(items) {
    var i = 0;
    return { //这个对象就是迭代器
        next() {
            done = i >= items.length; //这里就通过闭包来访问i变量了---如何形成变量的？这是在一个方法内使用的一个自由变量。当函数执行完毕后，创建这个方法的上下文就已经销毁了。
            value = !done ? items[i++] : undefined; //因为有了闭包，所以可以访问并操作i的值
            return {
                done,
                value
            }
        }
    }
}

var res = createIterator([1, 2, 3, 4, 5]);
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
/*
    { done: false, value: 1 }
    { done: false, value: 2 }
    { done: false, value: 3 }
    { done: false, value: 4 }
    { done: false, value: 5 }
    { done: true, value: undefined }
*/


//结合上面的迭代器，模拟实现for of
function forOf(obj, callback) {
    //首先先验证其是否能否被for of运行，验证传入的回调函数是否类型正确
    if (typeof obj[Symbol.iterator] != 'function') {
        throw new TypeError(obj+'is not iterator')
    }
    if (typeof callback != "function") {
        throw new TypeError(callback + 'is not iterator');
    }
    var iterator = obj[Symbol.iterator](); //获取到那个迭代器
    var result = iterator.next(); //执行迭代器对象的next方法，获取到迭代器对象
    while (!result.done) {
        callback(iterator.value);
        result = iterator.next();
    }
}


//内建迭代器使用
var colors = ["red", "green", "blue"];

for (let index of colors.keys()) {
    console.log(index);
}

// 0
// 1
// 2

for (let color of colors.values()) {
    console.log(color);
}

// red
// green
// blue

for (let item of colors.entries()) {
    console.log(item);
}

// [ 0, "red" ]
// [ 1, "green" ]
// [ 2, "blue" ]