//1. 原型继承---通过原型链实现继承
//缺点：所有的属性都会共享
function Parent() {
    this.name = ['刘亦菲'];
}

function Son() {

}

Son.prototype = new Parent(); //这样的话，子构造函数既可以继承父构造函数的属性和方法，同时也不会影响父构造函数


//问题
var son1 = new Son();
son1.name.push('白冰');
var son2 = new Son();
console.log(son2.name); //[ '刘亦菲', '白冰' ]
/*
    问题：
        1. “引用类型”的属性被所有实例共享---如上例
        2. 不能从子构造函数给父构造函数传值
    总结：只能是被动的接受父构造函数的属性（包括方法）
*/





//2. 借用构造函数（经典继承）
function Parent(name) {
    this.name = name;
}

function Son(name) {
    Parent.call(this, name);
}
/*
    优点：
        1. 可以在子构造函数内部向父构造函数内部传值
        2. 避免了“引用类型”的属性被共享
    缺点：
        1. 每次创建对象的时候都需要执行一次父构造函数
*/



//3. 组合继承---最常用的继承方式
function Parent(name) {
    this.name = name;
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

function Son(name, age) {
    Parent.call(this);
    this.age = age;
}
Son.prototype = new Parent(); //子构造函数的prototype指向了父构造函数的实例
Son.constructor = Son; //但是，子构造函数的原型的constructor属性必须指回去



//4. 原型式继承---将传入的对象作为要创建的对象的原型---这也是ES5的Object.create的方法的本质
function Parent(obj) {
    function P() {

    }
    P.prototype = obj;
    return new P();
}
//用途：比如Object.create方法---可以用来进行引用数据类型的复制（复制原理和JSON以及深拷贝是不同的）
//缺点：复制（或者说创建出来的）引用类型数据，如果使用字面量的方式重新赋值，那么就会和原始数据无关了。这个缺点对于复制来说其实可以说是优点。但是在这里就意味着继承失效了。



//5. 寄生式继承---创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。
function createObj(o) {
    var clone = Object.create(o);
    clone.sayName = function() {
        console.log('hi');
    }
    return clone;
}


//6. 寄生组合式继承---引用类型最适合的继承方法
//组合继承有一个最大的缺点：会调用两次父构造函数
//而寄生组合式继承就是简化其中的一次调用，实现最佳的继承效果


function Parent(name) {
    this.name = name;
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

function Son(name) {
    Parent.call(this);
}

//这里的本质其实就是通过创建一个第三方构造函数，将其原型和父构造函数的原型指向相同。然后子构造函数原型直接指向这个第三方构造函数的实例即可。
function Fn() {};
Fn.prototype = Parent.prototype;
Son.prototype = new Fn();
//这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。