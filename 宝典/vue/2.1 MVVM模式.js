/*
    MVVM
        1. MVVM模式本质上还是观察者模式。区别就是增加了一个第三方。
        2. 这个第三方的作用是将发布者的 增加观察者功能 和 通知观察者功能  提取。同时承担其增加观察者和通知观察者的时机的检测
        3. 那这个第三方如何实现时机的检测以及那两个功能的实现呢？
            1. 通过Object.defineProperty设置set 和 get 方法。
            2. get方法中，意味着有地方使用这个数据，那么说明要增加观察者了。
            3. set方法中，说明数据发生了变化，那么就要通知发布者，需要通知其对应的观察者了
            4. 通过Object.defineProperty方法，我们可以很简单的实现增加观察者和通知观察者的时机的确定。
        4. 角色及功能的划分
            1. observer  观察者   这其实是一个第三方，观察的其实是数据
                1. 为对应的要被观察的成员创建观察者
                2. 检测时机
                3. 增加发布者，要去增加观察者了
                    1. 为什么要在这里增加观察者？
                    因为在这里创建的对应的发布者，我们在其他地方拿不到那个发布者，也就没办法在其他地方增加观察者了
                    2. 那在这个地方如何拿到对应的观察者呢？
                4. 通知发布者，要去通知其观察者了
            2. Dep   订阅者   其实就是发布者
                1. 通知观察者
                2. 增加观察者
            3. watcher   真正的观察者
*/
function observer(obj) {
    Object.keys(obj).forEach(item => {
        defineActive(obj,item,obj[item]);
    })
}
function defineActive(obj,key,value) {
    var dep = new Dep();//为要实现MVVM功能的数据创建对应的发布者
    Object.defineProperty(obj, key, {
        get() { 
            var observer = new Watcher();
            dep.add(observer);//检测到要增加观察者的时机，通知对应的发布者去增加观察者
            return value;
        },
        set(newVal) {
            dep.notify();//检测到通知观察者的时机，让对应的发布者通知其观察者
        }
    })
}
class Dep{
    constructor() {
        this.subs = [];
    }
    add(observer) {
        this.subs.push(Dep.target);
    }
    notify() {
        this.subs.forEach(observer => {
            observer.updata();
        })
    }
}
class Watcher{
    constructor() {
        // Dep.target = this;//不知道有什么用
    }
    updata() {
        console.log('更新视图');
    }
}