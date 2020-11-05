//set出现的意义:不知道
//创建:
var s1 = new Set(); //可以传入一个数组,或者其他可以使用for of 的数据

//操作方法:
s1.add(value) //：添加某个值，返回 Set 结构本身。
s1.delete(value) //：删除某个值，返回一个布尔值，表示删除是否成功。
s1.has(value) //：返回一个布尔值，表示该值是否为 Set 的成员。
s1.clear() //：清除所有成员，无返回值。

//遍历方法:
keys() //：返回键名的遍历器
values() //：返回键值的遍历器
entries() //：返回键值对的遍历器
forEach() //：使用回调函数遍历每个成员，无返回值
    //注意 keys()、values()、entries() 返回的是遍历器

let set = new Set(['a', 'b', 'c']);
console.log(set.keys()); // SetIterator {"a", "b", "c"}
console.log([...set.keys()]); // ["a", "b", "c"]


let set = new Set(['a', 'b', 'c']);
console.log(set.values()); // SetIterator {"a", "b", "c"}
console.log([...set.values()]); // ["a", "b", "c"]


let set = new Set(['a', 'b', 'c']);
console.log(set.entries()); // SetIterator {"a", "b", "c"}
console.log([...set.entries()]); // [["a", "a"], ["b", "b"], ["c", "c"]]


let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(key + ': ' + value));
// 1: 1
// 2: 2
// 3: 3



//属性:
// size:返回set成员的个数,类似与数组的长度


//应用:目前来说,就只知道数组的去重