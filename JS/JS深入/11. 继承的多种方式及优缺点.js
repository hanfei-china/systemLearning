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



//原型式继承---将传入的对象作为要创建的对象的原型---这也是ES5的Object.create的方法的本质