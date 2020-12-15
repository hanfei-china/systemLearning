/*
    同源策略
        一：要求：
            1. 协议相同
            2. 域名相同
            3. 端口相同

        二：非同源会收到什么限制
            1. 不能读取非同源网页的cookie、localstorage和IndexedDB
            2. 不能接触非同源网页的DOM
            3. 不能向非同源服务器发送Ajax---可以发送，服务器页可以返回，但是会被浏览器拦截响应内容


        三：如何实现跨域
            首先声明：跨域广义上包含的有cookie的跨域、localstorage的跨域、Ajax的跨域等等（即上面受限制的那些）。而我们平常说的跨域通常指的是Ajax跨域。

            Ajax跨域实现的方法：
                1. JSONP
                    1. 缺点：只能发送GET请求
                    2. 优点：兼容性好，服务端改动小

                2. websocket
                    1. 特点：websocket没有同源策略，但是使用websocket发送请求的时候会携带一个Origin字段，他的值是当前网页的域名。所以服务器可以根据这个字段判断发起请求的这个网页是否在白名单内。所以也就不需要同源策略了。

                3. CORS
                    1. 优点：支持所有类型的请求，从根本上解决同源策略的问题。
                    2. 缺点：有一些老的浏览器不支持。同时，这个方式主要是要求后端进行服务器的处理
                    3. 原理：大致的步骤也是通过origin来接受请求来自的域名，然后判断是否在白名单中。如果不在，那么返回的响应头会少一个字段。从而告知浏览器发生问题。
*/



// JSONP实现跨域
function setScriptTag(src) {
    let tag = document.createElement('script');
    tag.setAttribute('type', 'text/javascript');
    tag.src = src;
    document.body.appendChild(tag);
};
//callBack=foo的作用是声明这个script标签请求回来后的回调函数，我们可以在这个回调中获取到数据。这是JSONP必须的
setScriptTag('这是跨域的域名?callBack=foo');
//回调函数
function foo(data) {
    console.log(data, '这是跨域请求回来的数据')
};