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


//2.1 构造函数模式优化------其实就是解决每次创建实例时，都要创建每个方法的问题
function Person(name) {
    this.name = name;
    this.getName = getName; //这里其实相当于复制了
}

function getName() {
    console.log(this.name);
}
//优点：解决了每个方法都要被重新创建的问题
//缺点：这叫啥封装。。。。。。





//3. 原型模式---通过构造函数和实例对象的原型来实现
function Person() {

}
Person.prototype.name = '刘亦菲';
Person.prototype.getName = function() {
        console.log(this.name);
    }
    //优点：方法不会重新创建
    //缺点：所有的方法和属性都是共享的，不能进行初始化参数


//3.2 原型模式的优化---将原型进行简单的封装
function Person() {

}
Person.prototype = {
        constructor: Person,
        name: '刘雯',
        getName() {
            console.log(this.name)
        }
    }
    //优点：对原型进行了字面量的修改
    //缺点：原型模式该有的一个都不缺




//4. 组合模式---将构造函数模式和原型模式结合---应用最广
/*
    1. 构造函数模式的缺点是每次创建实例的时候都要重新创建方法。---需要将方法进行共享
    2. 而原型的缺点是共享的过分了---有一部分不该共享的别共享

    总结：对于要进行初始化的参数，我们用构造函数来创建；对于哪些不需要进行初始化的，我们直接用原型。
*/
function Person(name) {
    this.name = name; //这个属性要进行初始化
}
//这个属性（方法）是不变化的
Person.prototype.getName = function() { //也可以直接写字面量
    console.log(this.name);
}


//5.动态原型方法---在构造函数内部动态的使用原型---因为这样原型就可以使用一些初始化的变量，实现原型的一个初始化。或者可以实现一些动态的设置。
function Person(name) {
    this.name = name;
    if (typeof this.getName != 'function') {
        Person.prototype.getName = function() {
            console.log(this.name);
        }
    }
}
//注意：在使用动态原型方法时，在构造函数内部不能使用字面量的方式去设置原型。---因为那样会失效！！！
function Person(name) {
    this.name = name;
    if (typeof this.getName != 'function') {
        Person.prototype = {
            constructor: Person,
            getName: function() {
                console.log(this.name);
            }
        }
    }
}
var p = new Person('张三');
p.getName(); //报错---并没有此方法
//结论：在构造函数内部，通过字面量的方式设置原型，会失效。
/*
    分析：其实我还是没太懂
*/




//6. 寄生构造函数模式---挂羊头卖狗肉
function Person(name) {
    var o = new Object();
    o.name = name;
    return o;
}

//应用场景：比如我想创建一个构造函数，实例对象可以使用数组的全部方法，且能使用数组外的一些方法。但是我又不愿意去修改Array这个构造函数。
function sameArray() {
    var arr = new Array();
    arr.getName = function() {
        console.log(this.name);
    }
    return arr;
}




//7. 稳妥构造函数模式---所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。
function person(name) {
    var o = new Object();
    o.getName = function() {
        console.log(name);
    }
    return o;
}
/*
    与寄生构造函数模式有两点不同：

        1. 新创建的实例方法不引用 this
        2. 不使用 new 操作符调用构造函数
    稳妥对象最适合在一些安全的环境中。

    稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。
*/


/*
    总结：
        1. 原型---没必要每次重新执行属性和方法，但是会让属性共享。所以一般可以将某些不需要初始化的属性或方法放到原型上
        2. 构造函数---可以进行初始化，但是每次创建对象都需要重新执行方法和属性。所以可以将需要初始化的属性和方法放到构造函数内部
        3. 寄生---既可以获取寄生对象上的属性和方法，又可以有自己本身的一些属性和方法（这些属性和方法也可以考虑原型和构造函数的结合）。
*/