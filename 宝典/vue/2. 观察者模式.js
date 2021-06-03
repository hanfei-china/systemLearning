/*
    观察者模式
        观察者模式从面向对象来讲的话，有两个类：发布者和订阅者
            1. 发布者：
                1. 创建订阅者集合
                2. 增加订阅者
                3. 移除订阅者
                4. 通知订阅者
            2. 订阅者
                1. 被通知，更新代码
*/
class Publisher {
    constructor() {
        this.subs = [];//创建集合
    }
    add(observer) {
        this.subs.push(observer);
    }
    remove(observer) {
        this.subs.forEach((item,index) => {
            if (item==observer) {
                this.subs.splice(index, 1);
            }
        })
    }
    notify() {
        this.subs.forEach(observer => {
            observer.update();
        })
    }
}
class Observe{
    constructor() {
        
    }
    updata() {
        console.log('更新代码')
    }
}