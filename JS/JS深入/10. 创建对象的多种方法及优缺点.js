//1. 工厂模式
function create(name) {
    var obj = new Object();
    obj.name = name;
    obj.getName = function() {
        console.log(this.name);
    }
}
//缺点：对象无法识别，因为所有的对象都指向了同一个原型


//2. 构造函数模式
function Person(name) {
    this.name = name;
    this.getName = function() {
        console.log(this.name);
    }
}
//优点：实例可以识别为一个特定的类型
//缺点：每次创建实例时，每个方法都会被创建一次


//3. 构造函数模式优化------其实就是解决每次创建实例时，都要创建每个方法的问题
function Person(name) {
    this.name = name;
    this.getName = getName; //这里其实相当于复制了
}

function getName() {
    console.log(this.name);
}
//优点：解决了每个方法都要被重新创建的问题
//缺点：这叫啥封装。。。。。。


//4. 原型模式---通过构造函数和实例对象的原型来实现