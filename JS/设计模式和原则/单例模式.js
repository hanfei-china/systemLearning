// 单例模式---只能创建一个实例的类，并且能提供一个能访问这个实例的全局访问点

/**
 * 那要创建这个一个类，有两个条件需要满足
        1. 首先，这个类只能创建一个实例---那么这个构造函数就必须要能够判断是否以及船舰过实例。如果创建过了，那么直接反回创建过的实例即可
            那么构造函数如何判断是否创建过实例呢？
                我们可以为构造函数本身创建一个属性，当我们第一次创建实例时，为这个属性添加值。再来创建时，我们通过判断这个值的有无来确定返回什么。
 */


class Single {
    constructor(name, age) {
            this.name = name;
            this.age = age;
        }
        //这是创建了一个静态方法---也可以直接写到构造函数的函数体里（在类里面的话，就是写到constructor函数里面）
    static getInstance() {
        if (!Single.hasCreate) {
            Single.hasCreate = new Single;
        }
    }
}

var a = Single.getInstance();
var b = Single.getInstance();
var c = new Single();
var d = new Single();

console.log(a === b); //true
console.log(c === d); //false---如果把判断的程序写到函数体内，那这个也是true了