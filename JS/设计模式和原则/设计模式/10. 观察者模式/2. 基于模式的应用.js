/*
    需求：酒店有一个烟雾检测器，当烟雾检测器检测到的烟雾浓度达到一定浓度的时候，烟雾检测器的状态会发生变化。此时，就会发生报警，同时去通知保安人员、管理人员以及消防队员。

    分析：在这里，从整体的需求来看的话，是一个观察者模式。那么按照观察者模式的固定套路。我们要做的依次是：角色划分---状态改变---发布者通知订阅者
*/

//角色划分，完成职能
class Publisher {
    constructor() {
        this.observers = [];
        this.state = 'safe';
    }
    add(observer) {
        this.observers.push(observer);
    }
    remove(observer) {
        this.observers.forEach((item, index) => {
            if (item == observer) {
                this.observers.splice(index, 1);
            }
        })
    }
    notify() {
            this.observers.forEach(observer => {
                observer.updata();
            })
        }
        //改变状态的变化
    setState(state) {
        this.state = state;
        if (state == '危险') {
            console.log('要通知了')
            this.notify(this.state);
        }
    }
}
class Observer {
    constructor(name) {
        this.name = name;
        this.workType = {
            '董事长': '安排工作',
            '保安队长': '保证安全',
            '消防员': '救火'
        };
        this.state = null;
    }
    updata(state) {
        this.state = state;
        this.work();
    }
    work() {
        console.log('我是' + this.name, '我的职责是' + this.workType[this.name]);
    }
}

//状态改变及发布者通知订阅者
var observer1 = new Observer('董事长');
var observer2 = new Observer('保安队长');
var observer3 = new Observer('消防员');
var publisher = new Publisher();
publisher.add(observer1);
publisher.add(observer2);
publisher.add(observer3);
publisher.setState('比较安全'); //无反应
publisher.setState('危险');
// 要通知了
// 董事长工作
// 保安队长工作
// 消防员工作