/*
    观察者模式的整体流程：角色划分---状态变化---发布者通知订阅者
    二：各个角色的职能
        1. 发布者
            1. 增加订阅者
            2. 移除订阅者
            3. 通知订阅者
        2. 订阅者
            1. 被通知，并且去执行
            注意：订阅者的功能（方法）一般都会在发布者中被调用，所以在其类中主要是进行方法的定义
*/

/*  根据职能我们创建这两个角色的类  */
//发布者
class Publisher {
    constructor() {
        //既然要对订阅者进行增加、移除和通知等操作。那么我们这里就需要有一个订阅者的集合
        this.observers = [];
    }
    add(observer) {
        //这里的observer即为订阅者，他是有订阅者的类生产的
        this.observers.push(observer);
    }
    remove(observer) {
        this.observers.some((item, index) => {
            if (item == observer) {
                this.observers.splice(index, 1);
            }
        });
    }
    notify() {
        this.observers.forEach(observer => {
            observer.updata(); //这个updata方法是订阅者自己的方法
        })
    }
}

class Observer {
    constructor() {}
    updata() {
        //执行监听以后的逻辑
    }
}
//以上就是观察者模式的基本组成结构。在业务中有很多业务逻辑即其他的各式各样的处理，都可以在此基础上进行改写。