//适配器就是将不同情况下的不同入参的函数统一做处理。最终去使用同一个方法。这样就实现了这个方法的适配。（兼容）
//比如axios
//这个模式没有什么特点的套路，这个模式就是为了实现多种情况下的一个兼容，然后还要提供一个用户使用起来非常简单的API（比如axios）
//所以，这里要求阅读源码。看看人家是如何实现一个优秀的适配器的。（小册里有相关的链接）