/*
    一:垃圾回收:
        计算机内存有一个周期:分配内存=>使用内存=>释放内存
        对于像C语言这种,用于底层的对内存的操作方法.而像JS等高级语言,并没有内存的操作方式.分配内存对于高级语言是显性的,但是使用内存和释放内存的过程则是隐形的.
        JS在创建(对象或者字符串等)是分配内存,在变量不再使用时释放内存,后面的这个过程叫做垃圾回收.
        垃圾回收这个过程不是实时的，因为其开销比较大，所以垃圾回收系统（GC）会按照固定的时间间隔,周期性的执行。

    二:JS垃圾回收机制的方法:
        1. 引用计数方法
            1. 本质:如果一个对象指向它的引用数为0,那么这个对象就应该被垃圾回收了
            2. 缺点:一旦出现循环依赖,就不能有效实现垃圾回收了
        
        2. 标记扫描算法
            1. 本质:垃圾回收器构建“roots”列表。Roots 通常是代码中保留引用的全局变量。在 JavaScript 中，“window” 对象可以作为 root 全局变量示例。
            所有的 roots 被检查并标记为 active（即不是垃圾）。所有的 children 也被递归检查。从 root 能够到达的一切都不被认为是垃圾。
            所有为被标记为 active 的内存可以被认为是垃圾了。收集器限制可以释放这些内存并将其返回到操作系统。
            2. 个人理解就是通过全局变量去访问,访问到的都会进行一个标记.那么访问结束以后,没有被标记的就是已经访问不到了,就可以被清除,释放内存了.

            3. 缺点:如果创建了很多全局变量,即便不用了,也不会清除掉的.
            4. 优点:对于引用计数方法中存在的循环的bug,可以解决掉
                如:function fn(){
                    o.a=o2;
                    o2.a=o;
                }
                fn();
                这种情况在引用计数算法中,不会被清除.但是在标记扫描算法中,函数执行完毕后,这个函数上下文就销毁了.因此是不可达的.所以会释放内存.
    
    三:JS常见的内存泄漏:
        1. 偶然创建了全局变量
        function fn(){this.bar=1;}; fn();
        2. 闭包
        3. 忘记了销毁的回调或者定时器


    四:如何避免内存泄漏:
        1. 避免创建太多的全局变量
        2. 避免使用闭包,可以使用let等
        3. 避免形成相互引用的死循环
        4. 避免创建太多的对象,不用的及时清除掉
            

        
*/

//引用计数举例
var o1 = {
    o2: {
        x: 1
    }
};
// 2 objects are created. // 'o2' is referenced by 'o1' object as one of its properties.// None can be garbage-collected

var o3 = o1;
//o3引用o1
// the 'o3' variable is the second thing that
// has a reference to the object pointed by 'o1'.

o1 = 1;
// now, the object that was originally in 'o1' has a         
// single reference, embodied by the 'o3' variable

var o4 = o3.o2; // reference to 'o2' property of the object.
// This object has now 2 references: one as
// a property.
// The other as the 'o4' variable

o3 = '374'; // The object that was originally in 'o1' has now zero
// references to it.
// It can be garbage-collected.
// However, what was its 'o2' property is still
// referenced by the 'o4' variable, so it cannot be
// freed.

o4 = null; // what was the 'o2' property of the object originally in
// 'o1' has zero references to it.
// It can be garbage collected.