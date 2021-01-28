/*
    策略模式：重构小能手，拆分胖逻辑

    应用：应用比较多的场景：当我们在一个函数里面有多个ifelse的时候。其实我们违背了单一功能原则和封闭开放原则
    分析：如果我们有多个ifelse，如果接下来还要继续增加需求的话，那么就需要继续ifelse。如果中间有一个地方发生问题，那么就会影响全部逻辑。
*/

//需求：开发一个询价系统。按照不同的商品类型，返回不同的价格
function bad(type) {
    if (type == '衣服') {
        var price = 50;
        return price;
    } else if (type == '食物') {
        var price = 50;
        return price;
    } else if (type == '电子产品') {
        var price = 50;
        return price;
    }
}
//问题：当我们再增加一个类型的时候，就需要再增加一个ifelse
//结果：当其中一个逻辑发生问题时，就会影响全部逻辑。一来不便于后续的维护，二来也不便于测试。所以我们就要考虑如何拆解这个胖逻辑。
//首先，从单一功能来说。首先要将几个逻辑分开，成为单一的逻辑


// 拆分出来的小逻辑
function cloth() {
    var price = 50;
    return price;
}

function food() {
    var price = 50;
    return price;
}

function phone() {
    var price = 50;
    return price;
}
// 大逻辑
function bad(type) {
    if (type == '衣服') {
        return cloth();
    } else if (type == '食物') {
        return food();
    } else if (type == '电子产品') {
        return phone();
    }
}
//从根本上来看，ifelse的作用其实就是进行分发的作用。所以，接下来就是进行派发的优化。派发就是映射的关系---那这样的话，我们就自然想到了对象映射！！！


// 对象映射
const obj = {
        cloth() {
            var price = 50;
            return price;
        },

        food() {
            var price = 50;
            return price;
        },

        phone() {
            var price = 50;
            return price;
        }
    }
    //大逻辑
function bad(type) {
    return obj[type];
}