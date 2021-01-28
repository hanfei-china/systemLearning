/*
    状态模式：
        和策略模式很相似，但是又有区别。

        相似：都要进行封装，将各个功能按照单一原则进行处理。同时按照开放封闭原则将其封装后的各个功能进行对象或者类的整合。

        区别：在策略模式中，单独的每个方法或者整合后的方法与整体逻辑之间耦合性极低。相互之间关联不大。而在状态模式中，单独个逻辑中可能会依赖整体逻辑的部分功能或逻辑。

        本质：状态模式在策略模式的基础上增加了感知主体的一步。---也就是说在各个功能里面也要能获取到主体逻辑及所有的状态（参数）---其实就是要将各个分开的逻辑想办法和主逻辑以及所有参数能放到一起（同一个构造函数或者类当中）。这样就能感知主体了。
*/

//例：有一个咖啡机。当我们打到不同挡位时，生产不同类型的咖啡，且不同类型咖啡的关系如下
// - 美式咖啡态（american)：只吐黑咖啡
// - 普通拿铁态(latte)：黑咖啡加点奶
// - 香草拿铁态（vanillaLatte）：黑咖啡加点奶再加香草糖浆
// - 摩卡咖啡态(mocha)：黑咖啡加点奶再加点巧克力
function coffeeMaker(state) {
    if (state == 'american') {
        console.log('我只吐黑咖啡')
    } else if (state == 'latte') {
        console.log('给黑咖啡加点奶')
    } else if (state == 'vanillaLatte') {
        console.log('黑咖啡加点奶再加香草糖浆')
    } else if (state == 'mocha') {
        console.log('黑咖啡加点奶再加点巧克力')
    }
}


//代码优化一：单一功能
//主逻辑当中只负责状态分配。至于其他的动作，交给单一逻辑去完成。
function coffeeMaker(state) {
    if (state == 'american') {
        american();
    } else if (state == 'latte') {
        latte();
    } else if (state == 'vanillaLatte') {
        vanillaLatte();
    } else if (state == 'mocha') {
        mocha();
    }
}

function american() {
    console.log('我只吐黑咖啡')
}

function latte() {
    american();
    console.log('给黑咖啡加点奶')
}

function vanillaLatte() {
    latte();
    console.log('黑咖啡加点奶再加香草糖浆')
}

function mocha() {
    american();
    console.log('黑咖啡加点奶再加点巧克力')
}


//优化二：开放封闭---去掉ifelse---利用map对象进行分配
function changeState(state) {
    coffeeMaker[state]();
}
var coffeeMaker = {
    american() {
        console.log('我只吐黑咖啡')
    },

    latte() {
        american();
        console.log('给黑咖啡加点奶')
    },

    vanillaLatte() {
        latte();
        console.log('黑咖啡加点奶再加香草糖浆')
    },

    mocha() {
        american();
        console.log('黑咖啡加点奶再加点巧克力')
    }
}

//优化三：感知主体---因为状态和算法不一样。算法逻辑基本上不关心主体的状态（比如一个询价算法逻辑，根本不关心主体内状态为何）而一个状态的话，就和主体的状态有很大的关系。比如咖啡机，我们肯定就要关心主体内牛奶的状态，如果小于设定值，那么我们就不能再生产拿铁了。等等。。。
//如果能让单一逻辑感知到主体的状态（即各个参数）？---其实就是将其全都装入到一个对象或者类中。

class finalMaker {
    constructor() {
        this.state = 'init';
        this.milk = '500ml';
    }
    coffeeMaker = {
        that: this, //这里的this拿到的是对象所处环境的对象（finalMaker）
        american() {
            console.log('咖啡机现在的牛奶存储量是:', this.that.milk); //这里的this是包含这个方法的对象（coffeeMaker）
            console.log('我只吐黑咖啡')
        },

        latte() {
            american();
            console.log('给黑咖啡加点奶')
        },

        vanillaLatte() {
            latte();
            console.log('黑咖啡加点奶再加香草糖浆')
        },

        mocha() {
            american();
            console.log('黑咖啡加点奶再加点巧克力')
        }
    }
    changeState(state) {
        this.state = state;
        if (!this.coffeeMaker[state]) {
            return;
        }
        this.coffeeMaker[state]();
    }
}
var coffee = new finalMaker();
coffee.changeState('vanillaLatte');
// 咖啡机现在的牛奶存储量是: 500ml
// 我只吐黑咖啡
// 加点奶