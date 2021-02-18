/*
 * 滚动字幕控件：
 * var mq=new Marquee({direction:"top",speed:100,step:2,always:false});
 * mq.draw($("#container"), "啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦");
 */
(function () {
    var utils, defaultDirection = "left", defaultSpeed = 30, defaultStep = 5, defaultAlways = true;
    (function () {
        utils = {
            /*---------------------------------创建元素---------------------------------*/
            createElement: function (option) {
                var eTag = option.tag,
					attr = option.attr,
					parent = option.parent,
					prepend = option.prepend,
					innerHtml = option.innerHtml,
					events = option.events;
                var e = document.createElement(eTag);
                var key;
                if (attr) {
                    for (key in attr) {
                        e.setAttribute(key, attr[key]);
                    }
                }
                if (parent) {
                    if (!parent.append) {
                        parent = $(parent);
                    }
                    if (prepend) {
                        parent.prepend(e);
                    } else {
                        parent.append(e);
                    }
                }
                if (innerHtml != undefined) {
                    e.innerHTML = innerHtml;
                }
                if (events) {
                    for (key in events) {
                        $(e).on(key, events[key]);
                    }
                }
                return e;
            }
        };
    })();

    function drawMarquee(settings) {
        /*---------------------------------初始化向左滚---------------------------------*/
        function initLeftMode() {
            child = $(child);
            var cWidth = child.width(), left = 0;
            (function () {
                child.css("left", left -= step);
                var self = arguments.callee;
                setTimeout(function () {
                    if (cWidth + left <= 0) {
                        left = containerW;
                    }
                    self();
                }, speed);
            })();
        }

        /*---------------------------------初始化向上滚---------------------------------*/
        function initTopMode() {
            child = $(child);
            var cHeight = child.height(), top = 0;
            (function () {
                child.css("top", top -= step);
                var self = arguments.callee;
                setTimeout(function () {
                    if (cHeight + top <= 0) {
                        top = containerH;
                    }
                    self();
                }, speed);
            })();
        }

        var container = settings.container, content = settings.content, direction = settings.direction, speed = settings.speed, step = settings.step, always = settings.always;

        var containerW = $(container).width();
        var containerH = $(container).height();
        $(container).html("");
        container = utils.createElement({ tag: "div", parent: container, attr: { "class": "marqueeContainerDiv" } });
        $(container).width(containerW);
        $(container).height(containerH);
        var child = utils.createElement({ tag: "p", parent: container, attr: { "direction": direction }, innerHtml: content });

        switch (direction) {
            case "left":
                if (always || $(child).width() > containerW) {
                    $(child).addClass("marqueeElement");
                    //initLeftMode();
                } else {
                    $(child).css({ margin: "auto", left: 0, right: 0 });
                }
                break;
            case "top":
                if (always || $(child).height() > containerH) {
                    initTopMode();
                } else {
                    $(child).css({ margin: "auto", left: 0, right: 0 });
                }
                break;
            default:
        }
    }

    /*
     * 初始化
     * direction：可选left或者top，默认为left
     * speed：移动的时间间隔，默认为30；
     * step：每次移动的距离，默认为5；
     * always：为false时，文字不能充满容器时不移动；为true时，任何情况都会移动。
     */
    window.Marquee = function (settings) {
        if (settings) {
            this.direction = settings.direction ? settings.direction : defaultDirection;
            this.speed = settings.speed != undefined ? settings.speed : defaultSpeed;
            this.step = settings.step != undefined ? settings.step : defaultStep;
            this.always = settings.always != undefined ? settings.always : defaultAlways;
        } else {
            this.direction = defaultDirection;
            this.speed = defaultSpeed;
            this.step = defaultStep;
            this.always = defaultAlways;
        }
    };

    window.Marquee.prototype = {
        draw: function (obj, content) {
            drawMarquee({
                container: obj,
                content: content,
                direction: this.direction,
                speed: this.speed,
                step: this.step,
                always: this.always
            });
        }
    };
})();