(function ($) {

    //图片
    var newGirl = "/Areas/Screen/Content/images/womanheadimg.png",
    newBoy = "/Areas/Screen/Content/images/manheadimg.png";

    //检验对象图片并替换
    var checkAndReplaceImg = function (data, num, url) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            data.HeadingImg = url;
        };
        img.onerror = function () {
            var temurl = num % 2 ? newBoy : newGirl;
            data.HeadingImg = temurl;
        };
    };

    commonPlugin.Barrage = function (oldcomments, tasktype) {
        var tempCommentData = [],
            //评论数组上限
            maxCommentCount = 500,
            //已处理个数
            tempCommentCount = 0,
            //总个数
            itemCommentCount = 0,
            //已删除评论数组
            deleteCommentData = [],
            //上次界面刷新的时间
            beforeTime = 0,
            //弹幕颜色
            colorList = ['#2dc3e8', '#ff6a6a', '#779e4c', '#ff8a00', '#c3600b'],
            //记录弹幕显示数组
            orderArray = [0, 2, 4],
            //弹幕显示时间间隔计数，有新数据
            showTime = 0,
            //弹幕显示时间间隔计数，无新数据
            radomCount = 0,
            //采用不同的弹幕数组
            isPreArray = 0,
            //全局
            self,
            //旧评论数据
            comments = oldcomments,
            //任务类型
            walltype = tasktype;

        self = this;

        this.danmu = {};
        this.off = 1;
        this.colorArray = $.extend(true, [], colorList);

        var happy = ["欢天喜地", "兴高采烈", "开开心心", "万分激动", "心潮澎湃"];

        var init = function () {

            var onWindowResize = function () {
                for (var i = 0; i < 12; i++) {
                    $("#message_" + i).css("max-width", parent.innerWidth - 50);
                }
                var largeSize = 1 + (parent.innerWidth / 1024 > 1 ? (parent.innerWidth / 1024 - 1) * 0.2 : 0);
                self.danmu.css("transform", "scale(" + largeSize + ")");
                self.danmu.css("-moz-transform", "scale(" + largeSize + ")");
                self.danmu.css("-webkit-transform", "scale(" + largeSize + ")");
            };

            var danmuhtml = "<div id='guagua_danmu' style='opacity: 0;position:absolute;z-index: 99;top: 0;width:100%'></div>";
            $("body").append(danmuhtml);
            self.danmu = $("#guagua_danmu");
            for (var k = 0; k < 12; k++) {
                var tempurl = k % 2 ? newBoy : newGirl;
                var top = 30 + k % 6 * 70;
                var e = [];
                e.push("<div id='bigpic_");
                e.push(k);
                e.push("' style='position: absolute; top: ");
                e.push(top);
                e.push("px; left: 100%;'>");
                e.push("<img src='");
                e.push(tempurl);
                if (walltype == commonPlugin.wallType.orderWall) {
                    //此处对弹幕进行特殊处理，同时颜色也需要调整
                    e.push("' class='messageImg2'>");
                    e.push("<div id='message_");
                    e.push(k);
                    e.push("' class='message_pop2' style='max-width:");
                    e.push((parent.innerWidth - 50));
                    e.push("'>");
                    e.push("<span style='font-weight:bold;color:#eda33e'></span>");
                    e.push("<span style='padding:0 5px 0 0;color:white'></span>");
                } else {
                    e.push("' class='messageImg'>");
                    e.push("<div id='message_");
                    e.push(k);
                    e.push("' class='message_pop' style='max-width:");
                    e.push((parent.innerWidth - 50));
                    e.push("'>");
                    e.push("<span></span>");
                }
                e.push("</div></div>");

                var danmuItem = e.join("");
                self.danmu.append($(danmuItem));
            }
            //设置弹幕大小 
            var largeSize = 1 + (parent.innerWidth / 1024 > 1 ? (parent.innerWidth / 1024 - 1) * 0.2 : 0);
            self.danmu.css("transform", "scale(" + largeSize + ")");
            self.danmu.css("-moz-transform", "scale(" + largeSize + ")");
            self.danmu.css("-webkit-transform", "scale(" + largeSize + ")");
            window.addEventListener('resize', onWindowResize, false);
            //还在之前的评论
            if (comments != null && comments.length > 0) {
                for (var i = 0; i < comments.length ; i++) {
                    var data = comments[i];
                    if (data.Type.indexOf("Reward") >= 0 || data.Type.indexOf("SignIn") >= 0) {
                        continue;
                    }
                    if (walltype == commonPlugin.wallType.orderWall) {
                        data.Content = happy[Math.floor(Math.random() * happy.length)] + "的购买了<span style='font-size:24px;color:#fedb76;padding:3px;'>" + data.Content + "</span>" + window.orderWallReward.Unit;
                    }
                    tempCommentData[itemCommentCount % maxCommentCount] = data;
                    checkAndReplaceImg(tempCommentData[itemCommentCount % maxCommentCount], i, data.HeadingImg);
                    itemCommentCount++;
                }
            }

            self.animate(0);
        };

        this.start = function () {
            self.danmu.css("opacity", 1);
            self.off = 0;
        };

        this.stop = function () {
            self.danmu.css("opacity", 0);
            self.off = 1;
        };

        //动画
        this.animate = function (now) {
            //替换弹幕头像、信息
            var showComment = function () {

                var comment;
                if (tempCommentCount < itemCommentCount) {
                    for (var i = 0; i < 1; i++) {
                        comment = tempCommentData[tempCommentCount % maxCommentCount];
                        if (deleteCommentData.indexOf(comment.CommentId) < 0) {
                            showimg(comment);
                        }
                        tempCommentCount++;
                    }
                } else {
                    radomCount++;
                    if (radomCount == 2) {
                        radomCount = 0;
                        if (tempCommentData.length > 0) {
                            var size = Math.floor(Math.random() * tempCommentData.length);
                            comment = tempCommentData[size];
                            if (deleteCommentData.indexOf(comment.CommentId) < 0) {
                                showimg(comment);
                            }
                        }
                    }
                }
            };
            //设置弹幕显示的速度、颜色
            var showimg = function (comment) {

                var order;
                var imgurl = comment.HeadingImg;
                var imgName = comment.UserName;
                var message = comment.Content;

                var arrayOrder = Math.floor(Math.random() * orderArray.length);
                order = orderArray[arrayOrder];

                if (orderArray.length == 1) {
                    isPreArray++;
                    if (isPreArray == 4) {
                        orderArray = [0, 2, 4];
                        isPreArray = 0;
                    } else if (isPreArray == 1) {
                        orderArray = [1, 3, 5];
                    } else if (isPreArray == 2) {
                        orderArray = [6, 8, 10];
                    } else if (isPreArray == 3) {
                        orderArray = [7, 9, 11];
                    }
                } else {
                    orderArray.splice(arrayOrder, 1);
                }

                var parentDiv = $("#bigpic_" + order);
                var messageDiv = $("#message_" + order);


                if (walltype == commonPlugin.wallType.orderWall) {
                    var nameSpan = $(messageDiv.children()[0]);
                    var contentSapn = $(messageDiv.children()[1]);
                    nameSpan.html(imgName);
                    contentSapn.html(message);
                } else {
                    var colorArrayOrder = Math.floor(Math.random() * self.colorArray.length);
                    var color = self.colorArray[colorArrayOrder];
                    if (self.colorArray.length == 1) {
                        self.colorArray = $.extend(true, [], colorList);
                    } else {
                        self.colorArray.splice(colorArrayOrder, 1);
                    }
                    messageDiv.children().html(message);
                    messageDiv.css("color", color);
                    messageDiv.prev().css("color", color);
                }
                messageDiv.prev().attr("src", imgurl);
                if (order == 5 || order == 15) {
                    parentDiv.attr("class", "fastfly");
                } else if (order == 1 || order == 11) {
                    parentDiv.attr("class", "slowfly");
                } else {
                    parentDiv.attr("class", "fly");
                }
                setTimeout(function () {
                    parentDiv.attr("class", "disappear");
                }, 19900);
            };

            var onetime = now - beforeTime;
            beforeTime = now;
            requestAnimationFrame(self.animate);
            if (onetime == now || onetime > 3000) {
                return;
            }

            showTime += onetime;
            if (showTime > 2000 && self.off == 0) {
                showTime = 0;
                showComment();
            }
        };

        this.getData = function (data) {
            switch (data.Type) {
                case "SignIn":
                case "CheckIn":
                    break;
                case "Delete":
                case "AuditDelete":
                    deleteCommentData.push(data.CommentId);
                    break;
                case "Order":
                    if (walltype == commonPlugin.wallType.orderWall) {
                        data.Content = happy[Math.floor(Math.random() * happy.length)] + "的购买了<span style='font-size:24px;color:#fedb76;padding:3px;'>" + data.Content + "</span>" + window.orderWallReward.Unit;
                        tempCommentData[itemCommentCount % maxCommentCount] = data;
                        checkAndReplaceImg(tempCommentData[itemCommentCount % maxCommentCount], itemCommentCount, data.HeadingImg);
                        itemCommentCount++;
                    }
                    break;
                default:
                    if (!data.Content) {
                        return;
                    }
                    tempCommentData[itemCommentCount % maxCommentCount] = data;
                    checkAndReplaceImg(tempCommentData[itemCommentCount % maxCommentCount], itemCommentCount, data.HeadingImg);
                    itemCommentCount++;
            }
        };

        init();
    };

})(jQuery)
