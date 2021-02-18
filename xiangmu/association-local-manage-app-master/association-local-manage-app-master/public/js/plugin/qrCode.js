(function ($) {

  commonPlugin.QrCode = function (parms, isShakeWall) {
    if (!parms) {
      parms = {};
    }
    this.parms = parms;
    this.url = parms.url || window.location.protocol + "//" + window.location.host;
    this.isShakeWall = isShakeWall;
    this.size = isShakeWall ? 0.35 : 0.6;

    var width = !parms.left ? this.size : 1 - parms.left - parms.right;
    var height = !parms.top ? this.size : 1 - parms.top - parms.bottom;

    this.aspectRatio = parms.aspectRatio;
    if (!this.aspectRatio && parms.top) {
      this.currentWidth = width * parent.innerWidth;
      this.currentHeight = height * parent.innerHeight;
      this.currentTop = parseFloat(parms.top) * parent.innerHeight;
      this.currentLeft = parseFloat(parms.left) * parent.innerWidth;
    } else {
      var minSize = Math.min(height * parent.innerHeight, width * parent.innerWidth);
      this.currentWidth = minSize;
      this.currentHeight = minSize;
      var top = !parms.top ? (1 - height) * 0.5 : parseFloat(parms.top) + ((height * parent.innerHeight - minSize) * 0.5) / parent.innerHeight;
      var left = !parms.left ?
        isShakeWall ? 0.9 - this.currentWidth / parent.innerWidth : (1 - this.currentWidth / parent.innerWidth) * 0.5 :
        parseFloat(parms.left) + ((width * parent.innerWidth - minSize) * 0.5) / parent.innerWidth;
      this.currentTop = top * parent.innerHeight;
      this.currentLeft = left * parent.innerWidth;
    }

    this.isShow = parms.isShow || false;
    this.padding = parms.padding || "5px";
    this.color = parms.color || "white";
    this.taskId = parms.taskId || 0;

    $("body").append("<div id='guagua_popShow' style='height: 0;width: 0;position:absolute;top:0;left:0;display: none;z-index: 200;'><img /></div>");
    this.popShow = $("#guagua_popShow");
    this.img = $("img", "#guagua_popShow");

    var oldSetOption = $.ui.resizable.prototype._setOption;
    $.ui.resizable.prototype._setOption = function (key, value) {
      oldSetOption.apply(this, arguments);
      if (key === "aspectRatio") {
        this._aspectRatio = !!value;
      }
    };

    this.init();
  };

  commonPlugin.QrCode.prototype = {
    init: function () {
      var self = this;
      /*创建二维码与容器，支持拖动、大小改变*/
      this.popShow.draggable({
        scroll: false
      });
      this.popShow.children().resizable({
        aspectRatio: this.aspectRatio /*锁定宽高比 aspectRatio: true*/
      });
      this.popShow.bind('dragstop', function (event, ui) {
        self.savePosition();
      });
      this.popShow.children().bind('resizestop', function (event, ui) {
        self.savePosition();
      });
      if (this.isShow) {
        this.popShow.show();
      }
      /*初始化二维码的位置与大小*/
      if (this.currentTop > parent.innerHeight - this.currentHeight) {
        this.currentTop = parent.innerHeight - this.currentHeight;
      } else if (this.currentTop < 0) {
        this.currentTop = 0;
      }
      if (this.currentLeft > parent.innerWidth - this.currentWidth) {
        this.currentLeft = parent.innerWidth - this.currentWidth;
      } else if (this.currentLeft < 0) {
        this.currentLeft = 0;
      }

      this.popShow.children().css({
        'top': this.currentTop,
        'left': this.currentLeft,
        'height': this.currentHeight,
        'width': this.currentWidth,
        'padding': this.padding,
        'background-color': this.color,
        'position': 'relative'
      });

      this.img.attr("src", window.hostName + "MicroSurvey/Home/GetQrCode?enCodeUrl=" + (this.url));
      this.img.css({
        "height": this.currentHeight,
        "width": this.currentWidth
      });

      /*浏览器大小改变二维码自适应位置*/
      window.addEventListener("resize", function () {
        self.resize(self);
      });
    },
    savePosition: function () {
      var tempTop = this.popShow.children().position().top + this.popShow.position().top;
      var tempLeft = this.popShow.children().position().left + this.popShow.position().left;
      this.top = tempTop / parent.innerHeight;
      this.left = tempLeft / parent.innerWidth;
      this.right = (parent.innerWidth - tempLeft - this.img.width()) / parent.innerWidth;
      this.bottom = (parent.innerHeight - tempTop - this.img.height()) / parent.innerHeight;

      // $.ajax({
      //   url: "/Screen/WallPlugin/SaveQrCodePosition?_taskId_=" + taskId,
      //   type: "post",
      //   data: {
      //     top: this.top,
      //     left: this.left,
      //     right: this.right,
      //     bottom: this.bottom
      //   },
      //   success: function () {
      //     //保存成功
      //   }

      // });
      axios.put(window.baseUrl + "/api/task/modifyQrCodeProperties?screenId=" +
          window.taskId + "&top=" + this.top + "&left=" + this.left + "&right=" + this.right + "&bottom=" + this.bottom, {
            withCredentials: true
          })
        .then(function (r) {
          r = r.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    show: function () {
      this.popShow.fadeIn(1000);
    },
    hide: function () {
      this.popShow.fadeOut(1000);
    },
    setAspectRatio: function (isaspectRatio) {
      this.aspectRatio = isaspectRatio;
      this.popShow.children().resizable("option", "aspectRatio", isaspectRatio);
      this.resize();
    },
    resize: function (self) {
      var oldWidth, oldHeight, oldTop, oldLeft;
      this.popShow = $("#guagua_popShow");
      self = self || this;
      self.popShow.css({
        'top': "0",
        'left': "0"
      });

      //若有新位置使用新位置，否则使用旧的位置
      self.parms.top = self.top || self.parms.top;
      self.parms.bottom = self.bottom || self.parms.bottom;
      self.parms.left = self.left || self.parms.left;
      self.parms.right = self.right || self.parms.right;

      var width = !self.parms.left ? self.size : 1 - self.parms.left - self.parms.right;
      var height = !self.parms.top ? self.size : 1 - self.parms.top - self.parms.bottom;
      if (!self.aspectRatio && self.parms.top) {
        oldWidth = width * parent.innerWidth;
        oldHeight = height * parent.innerHeight;

        oldTop = parseFloat(self.parms.top) * parent.innerHeight;
        oldLeft = parseFloat(self.parms.left) * parent.innerWidth;
      } else {
        var minSize = Math.min(height * parent.innerHeight, width * parent.innerWidth);
        oldWidth = minSize;
        oldHeight = minSize;

        var top = !self.parms.bottom ? (1 - height) * 0.5 : parseFloat(self.parms.top) + ((height * parent.innerHeight - minSize) * 0.5) / parent.innerHeight;
        var left = !self.parms.right ?
          self.isShakeWall ? 0.9 - oldWidth / parent.innerWidth : (1 - oldWidth / parent.innerWidth) * 0.5 :
          parseFloat(self.parms.left) + ((width * parent.innerWidth - minSize) * 0.5) / parent.innerWidth;

        oldTop = top * parent.innerHeight;
        oldLeft = left * parent.innerWidth;
      }

      if (oldTop > parent.innerHeight - oldHeight) {
        oldTop = parent.innerHeight - oldHeight;
      } else if (oldTop < 0) {
        oldTop = 0;
      }
      if (oldLeft > parent.innerWidth - oldWidth) {
        oldLeft = parent.innerWidth - oldWidth;
      } else if (oldLeft < 0) {
        oldLeft = 0;
      }
      self.popShow.children().css({
        'top': oldTop,
        'left': oldLeft,
        'height': oldHeight,
        'width': oldWidth
      });
      self.img.css("height", oldHeight);
      self.img.css("width", oldWidth);
    }
  };
})(jQuery)
