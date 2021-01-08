/*
    单例模式：
        1. 特点：保证一个类只有一个对象，同时要提供一个可供访问的全局接口。
                理解：单例模式很多情况都是应用在数据共享的情况下，那这种情况下可能访问的组件关系错综复杂，所以必须要提供一个全局的访问接口。这样才能保证访问的是同一个类。否则的话可能会每个组件访问一个类，这样的话，即便每个类都只有一个对象也没用啊。
        2. 应用：如vuex
*/


// 实现
//1. 如何实现每个类都只有一个对象---每个类，只要一直new，那我们就能一直得到新的对象，那么如何才能只有唯一的对象呢？---在构造函数中进行判断，如果是没有new过，那么创建一个对象；否则的话就返回第一个对象
//1.1---实现唯一对象的方法一：闭包
function BaseSingle(name) {
    this.name = name;
}
//使用闭包---返回一个函数，父函数内部有子函数要使用的自由变量
const SingleDog = (function() {
        let install = null;
        return function(name) {
            if (!install) {
                install = new BaseSingle(name);
            }
            return install;
        }
    })() //千万注意：这里必须要自执行了，不然这个构造函数就成了那个父函数了

var obj = new SingleDog('张三');
var obj1 = new SingleDog();
console.log(obj == obj1); //true
console.log(obj.name == obj1.name); //true



//使用ES6的类的静态方法
class Single {
    static getInstance() {
        if (!Single.instance) {
            Single.instance = new Single();
        }
        return Single.instance;
    }
}

var single1 = Single.getInstance();
var single2 = Single.getInstance();