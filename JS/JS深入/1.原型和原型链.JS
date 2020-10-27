// 原型和原型链：对象和构造函数之间的联系
function Person(uname, uage) {
    this.name = uname;
    this.age = uage;
}

Person.prototype.a = function() {
    console.log('方法a');
}

var p1 = new Person('刘亦菲', 28);
console.log(p1.name);


//原型对象   prototype
//构造函数通过原型对象指向一个对象。而这个对象就是我们通过构造函数创建的实例的原型。就是p1的实例。也叫实例原型

//对象原型   __proto__
//对象通过对象原型指向实例原型。实例的属性和方法都是继承这个实例原型来的。

//构造函数、实例对象和实例原型的关系
// Person.prototype==>'实例原型'<==p1.__proto__

//既然构造函数和实例对象都能指向实例原型，那么反过来能实现吗？
//实例原型能指向构造函数，但是不能指向实例对象，因为一个实例原型会生成多个实例对象，所以不能实现。

//实例原型如何指向构造函数呢？
//constructor
// Person.prototype.constructor===Person


// 综上，构造函数、实例对象和实例原型之间的关系有：
console.log(Person.prototype === p1.__proto__); //true
console.log(p1.__proto__.constructor === Person); //true
console.log(Person.prototype.constructor === Person); //true


//原型的原型
// 如上，Person.prototype也是一个对象，那么我们就可以通过对象原型继续向上找。找到的是谁呢？---Object这个构造函数的实例原型。因为所有的对象根本上是由Object这个构造函数创建出来的。
console.log(Person.prototype.__proto__ === Object.prototype); //true
//那Object.prototype是什么呢？   是null
console.log(Person.prototype.__proto__.__proto__); //null


//原型链
//就是从实例对象通过  __proto__  一层层的向上找到这个实例对象的实例原型。当然，在原型链的末端就是Object的实例原型（Object.prototype）。即为null