//构造器模式---通过构造函数来封装元素的变与不变

//例：韩梅梅设计了一套公司的后台管理系统。开始只有她一个开发人员。所以，账号设置为
var user1 = {
    name: '韩梅梅',
    sex: '女',
    career: 'coder'
};
//然而，过了一段时间以后，老板让她录入公司的500个人的账号。此时，肯定是不能继续手写对象了，怎么办？---构造函数
function User(name, sex, career) {
    this.name = name;
    this.sex = sex;
    this.career = career;
};
//然后，就可以遍历通过构造函数来创建账号了


//工厂模式---封装构造函数的共性与个性
//工厂模式的定义：将创建对象的过程单独封装，这样的操作就是工厂模式
//简单工厂模式的应用：多个类共存的时候，将多个类的共性提取，然后通过函数来分配每个类的个性。
//应用场合:有构造函数的地方，我们就应该想到简单工厂；在写了大量构造函数、调用了大量的 new、自觉非常不爽的情况下，我们就应该思考是不是可以掏出工厂模式重构我们的代码了


//需求：上面的账号太简单了，需要增加一个  个性化  的内容（属性）
var user2 = {
    name: '',
    sex: '',
    career: '保姆',
    work: ['扫地', '植树']
}


//如上所示，这个个性化的属性和前面的工种属性有关
//那我们直接的反应就是创建对应的构造函数，通过代码来判断使用哪个构造函数
function User1(name, sex, career) {
    this.name = name;
    this.sex = sex;
    this.career = career;
    this.work = ['吃', '喝'];
}

function User2(name, sex, career) {
    this.name = name;
    this.sex = sex;
    this.career = career;
    this.work = ['玩', '乐'];
}

function createUser(name, sex, career) {
    switch (career) {
        case 1:
            return new User1(name, sex, career)
            break;
        case 2:
            return new User2(name, sex, career);
            break;
            // ...   等等等等
    }
}


//问题，如果有几十上百个工种的话，要手写很多构造函数。而且这些构造函数内部其实有很多相同的部分.
//说明我们对构造函数的封装不够---使用工厂模式---对构造函数的共性进行提取

//共性---都有name  sex  career   work  属性。个性---属性值不同.
function UserAll(name, sex, career, work) {
    this.name = name;
    this.sex = sex;
    this.career = career;
    this.work = work;
}

function createUserAll(name, sex, career) {
    let work;
    switch (career) {
        case 1:
            work = ['吃', '喝']
            break;
        case 2:
            work = ['玩', '乐']
            break;

    }
    return new UserAll(name, sex, career, work);
}
//这样的话，每多一个工种，我们就只需要在函数内部增加一个判断，构造函数不需要改变。
//即实现了单一功能，又实现了开放封闭原则。
//核心---变与不变的完美分离（功能上实现了分离，同时参数上也实现了），又实现了结合。



/*
    总结：
        什么时候使用构造器模式？---当需要创建批量的同类型对象的时候。比如要创建账号等等。
        什么时候使用工厂模式呢？---当需要创建很多构造函数的时候，且这些构造函数有共性。
        工厂模式的特点是什么呢？---将创建对象的过程单独封装。
            1. 首先我们传入给工厂（同样是一个构造函数）
            2. 然后，工厂会根据其中的个性参数进行不同类型的对象的创建
*/