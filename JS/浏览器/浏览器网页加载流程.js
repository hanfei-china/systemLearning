/**
    正常浏览器网页加载流程：
        1. 下载HTML，同时开始解析。---一边下载，一边解析。
        2. 遇到<scrip>标签，将HTML渲染的控制权交给JavaScript引擎
        3. 如果script标签有外链，那么就要先下载外链文件，下载完毕之后再执行代码
        4. JavaScript引擎执行完毕，控制权重新交给渲染引擎，继续往下渲染

    所以，一般如果将script标签放到body元素的最下面或者后面。如果放到body的上面或者前面会发生什么问题？
        1. 造成“阻塞效应”---如果外链文件太大或者网络不好，那么页面就会一直等待，造成“假死”
        2. 如果HTML还没有渲染完毕，执行JS代码，且操作DOM元素，那么此时DOM元素没有渲染出来的话，就会发出报错。

    除了将script标签放在下面，还有没有其他的方法？
        1. 对于外链的script标签可以使用其defer属性。（<script defer src="dddddd"></script>）。使用了这个属性后，浏览器就会继续执行HTML的渲染，同时下载这个外链文件。等到HTML渲染完毕后，才去执行。
            特点：在执行完HTML后才去执行script标签。不会影响到script标签的顺序和关联关系。
        2. 使用async属性（使用方法同defer）。
            特点：
            1. 当script外链文件下载完毕后，立马打断HTML的渲染，由JS引擎掌握控制权，开始执行代码
            2. 不能保证几个script标签的执行顺序---谁先下载完毕，谁执行
        3. 所以，如果几个脚本之间没有依赖关系，那么使用async。否则使用defer。
        4. 其实，说到底，直接把script标签放到底部最合适。

    动态加载script元素    
        <script>元素还可以动态生成，生成后再插入页面，从而实现脚本的动态加载。
        ['a.js', 'b.js'].forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
        });
        这种方法的好处是，动态生成的script标签不会阻塞页面渲染，也就不会造成浏览器假死。但是问题在于，这种方法无法保证脚本的执行顺序，哪个脚本文件先下载完成，就先执行哪个。

        如果想避免这个问题，可以设置async属性为false。

        ['a.js', 'b.js'].forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
        });
        上面的代码不会阻塞页面渲染，而且可以保证b.js在a.js后面执行。不过需要注意的是，在这段代码后面加载的脚本文件，会因此都等待b.js执行完成后再执行。

        如果想为动态加载的脚本指定回调函数，可以使用下面的写法。

        function loadScript(src, done) {
        var js = document.createElement('script');
        js.src = src;
        js.onload = function() {
            done();
        };
        js.onerror = function() {
            done(new Error('Failed to load script ' + src));
        };
        document.head.appendChild(js);
        }

    加载时的协议
        如果不指定协议，浏览器默认采用 HTTP 协议下载。

        <script src="example.js"></script>
        上面的example.js默认就是采用 HTTP 协议下载，如果要采用 HTTPS 协议下载，必需写明。

        <script src="https://example.js"></script>
        但是有时我们会希望，根据页面本身的协议来决定加载协议，这时可以采用下面的写法。

        <script src="//example.js"></script>
 */