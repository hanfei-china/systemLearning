function P1() {

}
P1.prototype.a = function() {
    console.log(1);
    return this;
}
P1.prototype.b = function() {
    setTimeout(() => {
        console.log(2);
        return this;
    }, 5000);
}
P1.prototype.c = function() {
    console.log(3);
    return this;
}
var p = new P1();
p.a().b().c();