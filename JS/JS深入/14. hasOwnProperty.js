/*
    hasOwnProperty方法主要的作用:
        1. 判断是否具有某个属性
        2. 判断是自身属性,还是继承属性
*/

function Parent(uname, uage) {
    this.name = uname;
    this.age = uage;
}
Parent.prototype.getName = function() {
    console.log(this.name);
}

let obj = new Parent('张三', 20);
obj.title = "小说";
for (const key in obj) {
    console.log(key); //name   age   title    getName
}
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key); //name    age   title
    }
}
//通过原型继承来的属性可以判断出来,同时也可以用来判断自身是否具有某个属性



//注意:JS并没有为对象的hasOwnProperty这个方法名做保护,所以可能就会发生对象的这个属性名被使用,从而导致原方法失效的情况
var o = {
    a: 1
}
o.hasOwnProperty = function() {
    return false;
};
console.log(o.hasOwnProperty('a')); //false

//解决方法:通过一个空对象,使用call改变其this指向,然后使用
var res = ({}).hasOwnProperty.call(o, 'a');
console.log(res); //true