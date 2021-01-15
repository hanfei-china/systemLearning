//通过ES6的proxy实现一个代理（婚宴介绍所代理小姑娘）

//这是婚介所收到的妹子的注册信息
var girl = {
        name: '彪子',
        age: 20,
        work: '护士',
        fakeImg: '李嘉欣',
        realImg: '芙蓉姐姐',
        aboutMe: '假作真时真亦假',
        phone: '123',
        present: [], //这是礼物数组，
        bottomValue: 50, //这是收取的礼物的最低价值
        lastPresent: null
    }
    //婚介所可以工作了
var normal = ['name', 'aboutMe', 'work', 'fakeImg']; //这是可以直接给到社畜的信息，用于吸引人的,但是必须是验证后才给
var vip = ['age', 'realImg', 'phone']; //这些信息需要注册VIP会员才能获取

//可以开始代理了
//某天，有个人访问了这个婚介所，然后注册了信息
var user = {
        name: '社畜',
        isValidated: true, //是否验证过
        isVip: false, //是否是VIP
    }
    //当社畜要访问妹子的信息时，就会经过代理

const loves = new Proxy(girl, {
        get(girl, key) {
            //所有信息都需要验证以后才可以访问
            if (!user.isValidated && normal.indexOf(key) >= 0) {
                console.log('您还没有完成验证哦');
                return false;
            }
            if (user.isValidated && !user.isVip && vip.indexOf(key) >= 0) {
                console.log('只有VIP才可以查看该信息哦');
                return false;
            }
            return girl[key];
        },
        // 送礼物时也要是VIP才可以进行
        set(girl, key, val) {
            //如果同意收取礼物的话，这个字段就会改变值。而present字段是往数组中加信息，检测不到的
            if (key == 'lastPresent') {
                //送的礼物的价值低于设置的最低价值
                if (val.value < girl.bottomValue) {
                    console.log('不好意思，你的礼物太垃圾，被拒收了！！！')
                    return
                }
                girl.present = [...girl.present, val];
                girl.lastPresent = val;
            }
        }
    })
    // 注意：这里我们就不能直接访问girl了，因为已经被loves给代理了。我们直接访问girl的话，那这个代理就没有用了。这其实也是proxy和Object.defineProperty的区别

var name = loves.name; //允许执行---已经注册了
console.log(name); //彪子
var age = loves.age; //控制台输出   只有VIP才可以查看该信息哦    ---不是VIP
console.log(age); //false  因为return回去了一个false，如果return后面啥也没有，那就是undefined
var present = {
    value: 20,
    type: '巧克力'
}
loves.lastPresent = present; //控制台输出   不好意思，你的礼物太垃圾，被拒收了！！！
console.log(loves.lastPresent) //null
var presetn1 = {
    value: 100,
    type: '鲜花'
}
loves.lastPresent = presetn1;
console.log(loves.lastPresent); //{ value: 100, type: '鲜花' }