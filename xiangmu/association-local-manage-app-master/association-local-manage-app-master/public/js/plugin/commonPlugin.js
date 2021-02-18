/*用于公共大屏幕控件*/

/*---------------------属性----------------------*/
var audio = document.getElementById('media'),
  ulContainer = $("#ulContainer"),
  ul = $("#footer_ul");

var commonPlugin = window.commonPlugin || {
  /*---------------------常量----------------------*/
  //大屏幕类型
  wallType: {
    rewardWall: 7,
    messageWall: 1,
    signInWall: 2,
    startWall: 3,
    voteWall: 4,
    shakeWall: 5,
    orderWall: 8,
    horseRacing: 11,
    digitalPrize: 12,
    PacketRain: 13,
    photoWallScreen: 14,
    prize3D: 15,
    rainScreen: 17,
    tug: 19,
    wishScreen: 18,
    speedAnswer: 21,
    archery: 22,
    adventrue: 20
  },
  backgroundMusic: {
    ready: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/ready.mp3",
    signInWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/signInWall.mp3",
    rewardWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/rewardWall.mp3",
    messageWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/hdWall.mp3",
    startWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/startWall.mp3",
    voteWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/voteWall.mp3",
    shakeWall: "https://wxstore.blob.core.chinacloudapi.cn/jcp-sys-wallmusic/shakeWall.mp3"

  },
  //背景图片
  backgroundImg: {
    prizeWall: "https://event.huiyixing.com/Areas/Screen/Content/images/prizeScreen/backgroundImg.jpg",
    signInWall: "https://event.huiyixing.com/Areas/Screen/Content/images/signInScreen/backgroundImg.jpg",
    startWall: "https://event.huiyixing.com/Areas/Screen/Content/images/StartScreen/backgroundImg.jpg",
    voteWall: "https://event.huiyixing.com/Areas/Screen/Content/images/voteScreen/backgroundImg.jpg",
    orderWall: "https://event.huiyixing.com/Areas/Screen/Content/images/orderScreen/backgroundImg.png",
    digitalPrizeWall: "https://event.huiyixing.com/Areas/Screen/Content/images/prizeScreen/digitalprizebg.png",
    prize3DWall: "https://event.huiyixing.com/Areas/Screen/Content/images/prizeScreen/prize3Dbg.jpg",
    packetRain: "https://event.huiyixing.com/Areas/Screen/Content/images/packetRainScreen/bj.jpg",
    rainScreen: "https://event.huiyixing.com/Areas/Screen/Content/images/packetRainScreen/bj.jpg",
    speedAnswer: "https://event.huiyixing.com/Areas/Screen/Content/images/SpeedAnswer/bg.jpg",
    archery: "https://event.huiyixing.com/Areas/Screen/Content/images/Archery/bg.jpg",
    adventrue: "https://event.huiyixing.com/Areas/Screen/Content/images/AdventrueScreen/trunbg.png"
  },
  /*---------------------方法----------------------*/
  /*获取当前时间*/
  getTime: function () {
    var d = new Date(),
      str = '';
    str += d.getFullYear() + '-';
    str += d.getMonth() + 1 + '-';
    str += d.getDate() + ' ';
    str += d.getHours() + ':';
    str += d.getMinutes() + ':';
    str += d.getSeconds() + '';
    return str;
  },
  /*判断是否为PC端*/
  isPc: function () {
    var agent = navigator.userAgent.toLowerCase(),
      isWin = agent.indexOf('window') > -1,
      isUbuntu = agent.indexOf('ubuntu') > -1,
      isLinux = agent.indexOf('linux') > -1,
      isMac = agent.indexOf('macintosh') > -1;
    return isWin || isUbuntu || isLinux || isMac;
  },
  /*添加插件功能按钮*/
  addButton: function (eleObject, clickEvent) {
    ul = $("#footer_ul");
    ul.append("<li id='" + eleObject.id + "'></li>");
    var li = $("#" + eleObject.id);
    li.attr({
      "class": eleObject.className,
      "title": eleObject.title
    });
    if (eleObject.cssInfo) {
      li.css(eleObject.cssInfo);
    }
    li.append(eleObject.children);
    if (clickEvent) {
      li.on("click", clickEvent);
    }
    return li;
  },
  /*添加插件功能按钮*/
  addCountSelect: function () {
    if (!$("#countSelect")) {
      var countSelectHtml = "<select id='countSelect'></select>";
      $("#footer_ul").append("<li class='countSelect_li'>" +
        "<div>一次抽取</div >" + countSelectHtml + "<div class='countSelect_person'>人</div>" +
        "</li>");
    }
    var countSelect = $("#countSelect");
    return countSelect;
  },
  /*初始化插件*/
  init: function (survey, walls) {
    ulContainer = $("#ulContainer"),
      ul = $("#footer_ul");
    //插件显示处理
    ulContainer.fadeIn(1000);

    var showCode;
    $(".footer").on("mouseover", function () {
      clearTimeout(showCode);
      ulContainer.fadeIn(1000);
    });

    $(".footer").on("mouseout", function () {
      clearTimeout(showCode);
      showCode = setTimeout(function () {
        ulContainer.fadeOut(1000);
      }, 2000);
    });

    showCode = setTimeout(function () {
      $("#ulContainer").fadeOut(1000);
    }, 6000);

    // helper.initLineStatus();
    // helper.initSelectWall(walls, survey.screenId);
    // // helper.initDanmu(survey.DanmuIsShow, survey.TaskSubType);
    helper.initQrcode();
    helper.initMusic();
    helper.initBackGroundImg();
    helper.initFullScreen();
    helper.initSetting();
  },
  /*初始化背景图片*/
  initBackgroundImg: function (url) {
    $("body").css("background-image", "url('" + url + "')");
  },
  /*初始化背景音乐*/
  initAudioUrl: function (url, musicIsOn) {
    audio = document.getElementById('media');
    audio.src = url;
    if (musicIsOn) {
      audio.play();
      helper.buttonOpen($("#music"));
    }
  },
  /*切换背景音乐*/
  changeMusic: function (url) {
    audio.src = url;
    var state = $("#music").attr("data-code");
    if (state == "true") {
      audio.play();
    }
  },
  /*初始化二维码链接等属性*/
  initCode: function (parm, isQrShow, isShakeWall, rewardInfo) {
    commonPlugin.code = new commonPlugin.QrCode(parm, isShakeWall);
    if (isShakeWall) {
      if (isQrShow && rewardInfo && (rewardInfo.RewardCurrentStatus == 3 || rewardInfo.RewardCurrentStatus == 0)) {
        commonPlugin.codeShow();
      }
    } else {
      if (isQrShow) {
        commonPlugin.codeShow();
      }
    }
    commonPlugin.QrCodeIsShow = isQrShow;
  },
  /*控制弹幕显示状态*/
  danmuShow: function () {
    commonPlugin.danmu.start();
    helper.buttonOpen($("#danmu"));
  },
  danmuHide: function () {
    commonPlugin.danmu.stop();
    helper.buttonClose($("#danmu"));
  },
  /*控制二维码显示状态*/
  codeShow: function () {
    commonPlugin.code.show();
    helper.buttonOpen($("#qrCode"));
  },
  codeHide: function () {
    commonPlugin.code.hide();
    helper.buttonClose($("#qrCode"));
  },
  /*显示网络状态*/
  offLine: function () {
    helper.turnOffLine();
  },
  onLine: function () {
    helper.turnOnLine();
  },
};

var helper = {
  /*初始化大屏幕插件按钮*/
  initDanmu: function (danmuIsShow, tasktype) {
    //弹幕
    var liObject = {
      id: 'danmu',
      className: 'footer_li',
      title: '弹幕，快捷键[D]',
      children: "<div class='pluginButton danmuImg'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      var state = $(this).attr("data-code");
      var isShow = true;
      if (state == "true") {
        commonPlugin.danmuHide();
        isShow = false;
      } else {
        commonPlugin.danmuShow();
      }
      $.post("/Screen/WallPlugin/DanmuIsShow?_taskId_=" + window.taskId + "&isShow=" + isShow);
    });

    commonPlugin.danmu = new commonPlugin.Barrage(comments, tasktype);
    if (danmuIsShow) {
      commonPlugin.danmu.start();
      helper.buttonOpen($("#danmu"));
    }
  },
  initQrcode: function () {
    //二维码
    var liObject = {
      id: 'qrCode',
      className: 'footer_li',
      cssInfo: {},
      title: '二维码，快捷键[E]',
      children: "<div class='pluginButton qrcodeImg'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      var state = $(this).attr("data-code");
      var isShow = true;
      if (state == "true") {
        commonPlugin.codeHide();
        isShow = false;
      } else {
        commonPlugin.codeShow();
      }
      //存储二维码显示状态
      // $.post("/Screen/WallPlugin/QrCodeIsShow?_taskId_=" + window.taskId + "&isShow=" + isShow);
      axios.put(window.baseUrl + "/api/task/modifyQrCodeProperties?screenId=" +
          window.taskId + "&isShow=" + isShow, {
            withCredentials: true
          })
        .then(function (r) {
          r = r.data;
        })
        .catch(function (err) {
          console.log(err);
        });
      commonPlugin.QrCodeIsShow = isShow;
    });
  },
  initBackGroundImg: function () {
    //背景图片
    var liObject = {
      id: 'upLoad',
      className: 'footer_li',
      cssInfo: {},
      title: '背景图片，快捷键[T]',
      children: "<div class='pluginButton beijingImg'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      return $("#uploadedfile").click();
    });
    $('#uploadedfile').change(function () {

      function ajaxFileUpload() {
        $("#importform").ajaxSubmit({
          url: "http://liuqingyun.97jgg.com/Screen/WallPlugin/SaveBackgroundUrl?_taskId_=" + window.taskId,
          type: "post",
          success: function (result) {
            $("body").css("background-image", "url('" + result + "')");
            $("#uploadedfile").val("");
            //特殊处理摇一摇
            // if (survey.TaskSubType == commonPlugin.wallType.shakeWall) {
            //   BackImgUrl = result;
            // }
          },
          error: function () {
            //window.weui.alert("提示", "上传失败");
          }
        });
      }

      if (!!$(this).val()) {
        ajaxFileUpload();
      }
    });
  },
  initMusic: function () {
    //背景音乐
    var liObject = {
      id: 'music',
      className: 'footer_li',
      cssInfo: {},
      title: '背景音乐，快捷键[Y]',
      children: "<div class='pluginButton musicImg'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      var state = $("#music").attr("data-code");
      var isOn = true;
      if (state == "true") {
        audio.pause();
        helper.buttonClose($("#music"));
        isOn = false;
      } else {
        audio.play();
        helper.buttonOpen($("#music"));
      }
      //存储音乐播放状态
      // $.post("/Screen/WallPlugin/MusicIsOn?_taskId_=" + window.taskId + "&isOn=" + isOn);

      axios.put(window.baseUrl + "/api/task/modifyScreenPlugin?screenId=" +
          window.taskId + "&musicOn=" + isOn, {
            withCredentials: true
          })
        .then(function (r) {
          r = r.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  },
  initFullScreen: function () {
    //全屏
    var liObject = {
      id: 'fullScreen',
      className: 'footer_li',
      cssInfo: {},
      title: '全屏，快捷键[Q]',
      children: "<div class='pluginButton fullscreenImg'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      var state = $(this).attr("data-code");
      if (state == "true") {
        $(this).attr("data-code", false);
        if (parent.document.exitFullscreen) {
          parent.document.exitFullscreen();
        } else if (parent.document.mozCancelFullScreen) {
          parent.document.mozCancelFullScreen();
        } else if (parent.document.webkitCancelFullScreen) {
          parent.document.webkitCancelFullScreen();
        }
      } else {
        $(this).attr("data-code", true);
        var docElement = parent.document.documentElement;
        if (docElement.requestFullscreen)
          docElement.requestFullscreen();
        else if (docElement.mozRequestFullScreen)
          docElement.mozRequestFullScreen();
        else if (docElement.webkitRequestFullScreen)
          docElement.webkitRequestFullScreen();
        else if ("undefined" != typeof window.ActiveXObject) {
          var t = new ActiveXObject("WScript.Shell");
          t && t.SendKeys("{F11}");
        }
      }
    });

  },
  initSelectWall: function (walls, tid) {
    var wallOptions = "";
    if (!walls || walls.length == 0) {
      return;
    }
    for (var i = 0; i < walls.length; i++) {
      var w = walls[i];
      var selected = w.screenId == tid ? " selected = 'selected'" : "";
      wallOptions += "<option data-code=" + w.TaskSubType + selected + " value=" + w.screenId + ">" + w.screenName + "</option>";
    }
    var wallSelect = "<select id='wallSelect'>" + wallOptions + "</select>";

    ul.append("<li class='wallSelect_li'>" + wallSelect + "</li>");
    //大屏幕切换处理
    $("#wallSelect").on("change", function (e) {
      var selectOption = $(this).find("option:selected");
      var currentId = selectOption.val();
      var currentType = selectOption.attr("data-code");
      var host = window.location.host;
      var oldframe = parent.document.getElementsByTagName("iframe")[0];
      var newframe = parent.document.createElement("iframe");
      newframe.style.display = "none";
      $(parent.document.body).append(newframe);
      newframe.onload = function () {
        newframe.style.display = "block";
        oldframe.remove();
      };
      newframe.src = "/Screen/Screen/Screen?_taskId_=" + currentId + "&wallType=" + parseInt(currentType);
    });
  },
  initSetting: function () {
    //设置
    var liObject = {
      id: 'setting',
      className: 'footer_li',
      cssInfo: {},
      title: '设置，快捷键[P]',
      children: "<div class='pluginButton setting'></div>"
    };
    commonPlugin.addButton(liObject, function () {
      var settingDIv = $(".settingDiv");
      if (settingDIv.is(":hidden")) {
        settingDIv.slideDown();
      } else {
        settingDIv.slideUp();
      }
    });
    $(".delbtn , .cancelSettingButton ").on("click", function () {
      $(".settingDiv").slideUp();
    });

    $(".confrimSettingButton").on("click", function () {
      //Todo:记录二维码的保持纵横比
      var aspectRatio = $("#qrcode_aspectRatio").prop("checked");

      axios.put(window.baseUrl + "/api/task/modifyQrCodeProperties?screenId=" +
          window.taskId + "&aspectRatio=" + aspectRatio, {
            withCredentials: true
          })
        .then(function (r) {
          r = r.data;
          commonPlugin.code.setAspectRatio(aspectRatio);
          window.jNoty("保存成功！");          
        })
        .catch(function (err) {
          console.log(err);
        });
      // $.ajax({
      //   url: "/Screen/WallPlugin/QrCodeIsAspectRatio?_taskId_=" + window.taskId + "&isAspectRatio=" + aspectRatio,
      //   type: "post",
      //   contentType: "application/json",
      //   headers: {
      //     ISGZIPDATA: "0"
      //   },
      //   success: function () {
      //     window.jNoty("保存成功！");
      //     commonPlugin.code.setAspectRatio(aspectRatio);
      //   }
      // });
    });
  },
  initLineStatus: function () {
    //连接状态
    var liObject = {
      id: 'lineStatus',
      className: 'footer_li',
      cssInfo: {
        "border": "none",
        "cursor": "default",
        "position": "absolute",
        "left": "10px"
      },
      title: '',
      children: "<div class='pluginButton offLine'></div>"
    };
    commonPlugin.addButton(liObject);
  },

  turnOnLine: function () {
    $("#lineStatus").children().eq(0).removeClass("offLine");
    $("#lineStatus").children().eq(0).addClass("onLine");
  },
  turnOffLine: function () {
    $("#lineStatus").children().eq(0).removeClass("onLine");
    $("#lineStatus").children().eq(0).addClass("offLine");
  },

  /*插件按钮启用不启用*/
  buttonOpen: function (obj) {
    obj.attr("data-code", true);
    obj.css("border", "2px solid rgba(255,255,255,0.8)");
    obj.find("div").css("opacity", "1");
  },
  buttonClose: function (obj) {
    obj.attr("data-code", false);
    obj.css("border", "");
    obj.find("div").css("opacity", "0.4");
  }
};
