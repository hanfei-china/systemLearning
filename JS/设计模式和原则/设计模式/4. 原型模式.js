//原型对象   构造函数   实例对象    原型链  的关系
function Aaa() {

}
Aaa.prototype.say = function() {
    console.log(1);
}

var obj = new Aaa();
obj.say();
obj.__proto__.say = function() {
    console.log(222);
};
obj.say();

//原型模式，其实就是JS面向对象编程的一个编程范式。原型编程范式的核心思想就是利用实例来描述对象，用实例作为定义对象和继承的基础。
//重点：培养面向对象编程的习惯---用实例来描述、定义对象。重点理解原型链。