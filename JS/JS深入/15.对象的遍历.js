function Parent() {
    this.home = '长沙';
}
Parent.prototype.age = 20;
Parent.prototype.getName = function(uname) {
    this.name = uname;
}
let obj = new Parent();
obj.a = 1;
obj.b = 2;
//Object.keys方法---不会去遍历原型上的属性或方法
console.log(Object.keys(obj)); //[ 'home','a', 'b']

//for in  遍历---会将原型上的一起遍历
for (const key in obj) {
    console.log(key)
        //home
        // a
        // b
        // age
        // getName
}