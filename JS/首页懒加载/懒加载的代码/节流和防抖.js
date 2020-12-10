/*
    节流和防抖
        一：使用场合：当我们遇到频繁执行的代码的时候。比如滚动事件、搜索请求等
        二：核心思想：
            不管是节流还是抖动，都是通过一个自由变量来保存时间信息，然后通过定时器来控制触发频率。如果我们要进行防抖或者节流这个方法的封装，那么就会使用到闭包，来保存这个自由变量。
        三：区别
            1. 防抖
                1. 名字来源：我们在搜索框，根据输入的关键字来进行搜索。如果不处理的话就会频发刷新，发生抖动
                2. 特点：由最后一个人说了算。当第一个来了以后，立即设置定时器，当在定时器的时间段内，又来了新的信号，那么就会重置定时器。直至定时间时间到了以后且没有下一个信号来了，那么定时器内容就会执行。
            2. 节流
                特点：第一个人说了算。当第一个信号来了以后，设置定时器，且在这个定时器执行完毕之前，所有来了的信息都不处理。等到定时器执行完毕后，会重置信号开关。重新接受下一个信号。
        四：实现的特点：
            1. 节流：节流其实主要是使用的前后的时间间隔来和设置的时间段进行比较。只有大于这个时间段的时候我们才会让其再次执行回调。否则的话就只会让第一次去执行这个回调。
            2. 防抖：就是每次来了信号之后，都会清除定时器。如果是在时间间隔里的话，那么定时器一直没触发，一直在重置。如果是在时间间隔外的话，那么前面的最后一次已经触发了定时器了。
*/


//节流

//fn是我们要封装的事件的回调，time是时间的阈值
function throttle(fn, time) {
    //创建一个自由变量，用于存储时间信息.如果不封装的话，这里可以直接使用全局变量
    let oldTime = 0;
    //这里返回一个函数，是因为我们封装了，要使用自由变量，只能通过闭包的方式。如果我们没有封装的话，就没有这个必要了。
    return function() {
        //记录上在调用这个函数的地方的上下文
        let context = this;
        //记录当前的时间
        let nowTime = +new Date(); //+new Date()的效果就相当于new Date()-0 
        //记录调用时传入的参数
        let args = aruguments;

        //进行时机的判断
        if (nowTime - oldTime >= time) {
            oldTime = nowTime;
            //这里使用apply的原因：1. 调用的函数fn可能内部会使用到this，为了保证this是调用的元素，那么我们就要改变fn内部this的指向。而调用的时候可能会传入参数，且参数的个数我们不知道，只能使用arguments，所以传入的时候是按照一个数组传入的。那我们就只能选择apply了。
            fn.apply(context, args);
        }

    }
}

//使用这个节流方法
//通过throttle处理被调用的函数，使其能够实现节流---在特定的情况下才会被调用
//传入到throttle的函数，就相当于事件处理函数，比如滚动事件的处理函数。但是我们想要节流，那么就可以调用throttle处理
var fn = throttle(() => { console.log('这是个调用的函数') }, 1000);
window.addEventListener('scroll', fn);




//防抖

function debounce(fn, time) {
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, time);
    }
}



//通过节流来优化防抖
/*
    防抖的问题：
        因为防抖是由最后一个人说了算的，那么当我前一个事件段内的最后一个人触发了事件。那当一段时间后（这段事件大于我们设置的时间段）,再次传入一个信号，此时其实由于时间间隔太长，我们应该立刻给到用户反应的，而不是再次去等一个时间段。这里就可以使用节流来进行优化。
*/


function bestDebouce(fn, delay) {
    let oldTime = 0;
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        let nowTime = +new Date();
        if (nowTime - oldTime < delay) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                oldTime = nowTime;
                fn.apply(context, args);
            }, delay);
        } else {
            //此时，已经超出了时间间隔，我们应该做的是直接给到用户返回。而不是再去等那一个时间段。
            oldTime = nowTime;
            fn.apply(context, args);
        }
    }
}