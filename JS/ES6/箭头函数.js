//使用
a => a + 1;
(a, b) => a + b;
(a, b) => {
    c = a + b;
    d = a - b;
    return { c, d }
}

//和普通的函数相比的区别
/*
    1. 没有this，箭头函数内部的this就是其最近一个外部函数的this指向。因为没有this，所以箭头函数使用call、apply以及bind会失效
*/
//例1---箭头函数this特性的使用
//我们抽离了一个按钮组件，使用的时候通过new的方式可以直接创建，同时这个按钮上会有一个点击事件，在点击的时候背景色改变
function Button(id) {
    this.element = document.createAttribute('button');
    this.addEvent();
}
Button.prototype.addEvent = function() {
    this.element.addEventListener('click', this.setBgc, false);
}
Button.prototype.setBgc = function() {
    this.element.style.backgroudColor = "#666";
}


//上面的代码咋一看没问题，但是其实会报错：Uncaught TypeError: Cannot read property 'style' of undefined
//原因：在添加事件的时候，我们传入了一个参数：this.setBgc。但是，这里的this是addEvent方法的，而它的this指向的是this.element。所以this.setBgc的this并没有指向实例对象上。因此也就会报错了。

//分析：肯定不能去修改setBgc方法，因为我们还可能会使用其他的方法，不能全部修改了，治标不治本。我们要做的是在使用这些方法时，保证这些方法被引用时都是实例对象引用的。
/*
    解决方法：
            1. 使用that
            2. 使用箭头函数---因为箭头函数本身内部是没有this的
*/
//解决方法一：
Button.prototype.addEvent = function() {
        var that = this;
        this.element.addEventListener('click', that.setBgc, false);
    }
    //解决方法二：
Button.prototype.addEvent = function() {
    this.element.addEventListener('click', event => this.setBgc(event), false);
}



//不同点2：没有arguments---如果使用的话，同样是获取到了外层函数的arguments
//不同点3：因为没有this，所以不能作为构造函数，用于new实例，因为不能使用 new 调用，所以也没有 new.target 值。由于不能使用 new 调用箭头函数，所以也没有构建原型的需求，于是箭头函数也不存在 prototype 这个属性。连原型都没有，自然也不能通过 super 来访问原型的属性，所以箭头函数也是没有 super 的，不过跟 this、arguments、new.target 一样，这些值由外围最近一层非箭头函数决定。



//箭头函数的自执行：
(i => {
    console.log(i)
})();