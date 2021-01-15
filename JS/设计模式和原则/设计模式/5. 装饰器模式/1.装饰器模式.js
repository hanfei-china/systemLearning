/*
    装饰器模式：
        1. 添加新的功能，不改变旧的逻辑和功能
                        ⬇
        2. 将原有的逻辑或功能封装，然后新的功能或逻辑同样封装。
                                ⬇
        3.在使用的时候，用哪个就调用哪个即可。这样，新的逻辑或功能也不会影响原有的逻辑或功能。
                                        ⬇
        4. 其实，从本质上来讲就是解耦。原来的逻辑不去管，直接封装起来，然后将新的功能和方法也封装起来。然后在需要的时候使用即可。
*/


/* 方法一：使用函数的方式 */
// 对于一个具有一定功能的函数来说，进行装饰器模式的操作


function beforeFunction() {
    // 原有的逻辑
}

/*进行装饰器操作*/
function oldFunction() {
    //原有的逻辑或函数
}

function newFunction() {
    //新加的逻辑或函数
}
//装饰器后的总函数
function afterFunction(params) {
    oldFunction(); //调用原有的逻辑和函数
    newFunction(); //调用新的逻辑和函数
}

/* 效果：在不改变原有逻辑的情况下，新增加一些我们现有的需求 */



/* 方法二：借助构造函数（ES6的类）---更加贴合面向对象的编程思维 */
function beforeFunction() {
    //原有的逻辑
}

/* 借助ES6的类（和构造函数的原理其实相同） */
class OldObj {
    oldFunction() {
        //原有的逻辑
    }
}

class NewObj {
    constructor(oldObj) {
            this.oldObj = oldObj; //将上面的那个类的实例传入，那么就可以在这个类中调用之前的逻辑了
        }
        //在旧逻辑中增加新逻辑，然后放在一起
    afterFunction() {
        this.oldObj.oldFunction();
        this.newFunction();
    }
    newFunction() {
        //新逻辑
    }
}

/* 添加了装饰器后的使用方法 */
var oldObj = new OldObj();
var newObj = new NewObj(oldObj);
newObj.afterFunction();