(function () {
  var utils, heightManager, todoManager, pageManager, barDrawer,
    container, colWidthConst = 230,
    created = false;

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
      },
      eventsDic: {},
      registerEvent: function (name, func) {
        utils.eventsDic[name] = func;
      },
      triggerEvent: function (name, args) {
        var func = utils.eventsDic[name];
        if (created && func) {
          func(args);
        }
      },
      loadCssList: function (list) {
        if (!list) {
          return;
        }
        var fileName = list.shift();
        if (!fileName) {
          return;
        }
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = fileName;
        document.body.appendChild(link);
        var self = arguments.callee;
        link.onload = function () {
          self(list);
        };
      },
      loadJsList: function (list) {
        if (!list) {
          return;
        }
        var fileName = list.shift();
        if (!fileName) {
          return;
        }
        var script = document.createElement("script");
        script.src = fileName;
        document.body.appendChild(script);
        var self = arguments.callee;
        script.onload = function () {
          self(list);
        };
      },
      remove: function (array, keyTitle, keyValue) {
        var tmp = array.find(function (e) {
          return e[keyTitle] == keyValue;
        });
        if (tmp) {
          var index = $.inArray(tmp, array);
          array.splice(index, 1);
        }
        return tmp;
      },
      getItemByKey: function (array, keyTitle, keyValue) {
        var tmp = array.find(function (e) {
          return e[keyTitle] == keyValue;
        });
        if (!tmp) {
          return null;
        }
        return tmp;
      },
      //给列表的每一项加上序号
      markIndex: function (array) {
        if ("vsIndex" in array[0]) {
          return;
        }
        for (var i = 0, item; item = array[i++];) {
          item.vsIndex = i;
        }
      },
      //获取列表某一项的序号
      getIndex: function (item) {
        return item.vsIndex;
      },
      //设置列表某一项的序号
      setIndex: function (item, index) {
        if (item.vsIndex == undefined) {
          item.vsIndex = index;
        }
      },
      addNum: function (num1, num2) {
        var sq1, sq2, m;
        try {
          sq1 = num1.toString().split(".")[1].length;
        } catch (e) {
          sq1 = 0;
        }
        try {
          sq2 = num2.toString().split(".")[1].length;
        } catch (e) {
          sq2 = 0;
        }
        m = Math.pow(10, Math.max(sq1, sq2));
        return ((num1 * m + num2 * m) / m).toFixed(2);
      }
    };

    //有序列表初始化
    function orderedList(datas) {
      if (!datas || datas.length == 0) {
        this.list = [];
        return;
      }

      this.list = datas.slice(0);
      utils.markIndex(this.list);
      this.list.sort(function (e1, e2) {
        return e2.value - e1.value;
      });
    }

    orderedList.prototype = {
      /*添加一项*/
      add: function (data) {
        if (!data) {
          return;
        }
        utils.remove(this.list, "key", data.key);
        var inserted = false;
        var dataIndex = utils.getIndex(data);
        for (var i = 0, item; item = this.list[i++];) {
          var itemIndex = utils.getIndex(item);
          if (item.value < data.value || (item.value == data.value && dataIndex < itemIndex)) {
            this.list.splice(i - 1, 0, data);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          this.list.push(data);
        }
        utils.setIndex(data, this.list.length - 1);
        this.ranked = false;
      },
      /*累加更新*/
      update: function (k, v) {
        var tmp = utils.remove(this.list, "key", k);
        if (!tmp) {
          return;
        }
        tmp.value = parseFloat(utils.addNum(tmp.value, v));
        this.add(tmp);
      },
      /*更新排序*/
      updateIndex: function (k) {
        var tmp = utils.remove(this.list, "key", k);
        if (!tmp) {
          return;
        }
        this.add(tmp);
      },
      /*总数更新*/
      updateWithTotal: function (k, v) {
        var tmp = utils.remove(this.list, "key", k);
        if (!tmp) {
          return;
        }
        tmp.value = v;
        this.add(tmp);
      },
      /*获取*/
      get: function (start, length) {
        var listLength = this.list.length;
        if (start == undefined) {
          start = 0;
        }
        if (start < 0) {
          start = 0;
        }
        if (start >= listLength) {
          start = listLength - 1;
        }
        if (length == undefined) {
          length = 1;
        }
        if (length < 0) {
          length = 0;
        }
        var end = start + length;
        if (end > listLength) {
          end = listLength;
        }
        var result = [];
        for (var i = start, item; i < end; i++) {
          item = this.list[i];
          result.push(item);
        }
        return result;
      },
      ranked: false,
      /*获取排名*/
      getRankDic: function () {
        if (!this.ranked) {
          this.rankDic = {};
          var curRank = 0,
            preV = null;
          for (var i = 0, item; item = this.list[i++];) {
            if (preV != null && preV == item.value) {
              curRank--;
            }
            this.rankDic[item.key] = ++curRank;
            preV = item.value;
          }
          this.ranked = true;
        }
        return this.rankDic;
      },
      getLength: function () {
        return this.list.length;
      },
      clear: function () {
        for (var i = 0, item; item = this.list[i++];) {
          item.value = 0;
        }
      },
      getMax: function () {
        return this.list[0];
      }
    };

    //无序列表初始化
    function noOrderedList(datas) {
      this.orderedList = new orderedList(datas);
      if (!datas || datas.length == 0) {
        this.list = [];
        return;
      }
      this.list = datas.slice(0);
    }

    noOrderedList.prototype = {
      /*添加一项*/
      add: function (data) {
        if (!data) {
          return;
        }
        var tmp = utils.getItemByKey(this.list, "key", data.key);
        if (tmp) {
          var index = $.inArray(tmp, this.list);
          this.list.splice(index, 1, data);
        } else {
          this.list.push(data);
        }
        this.orderedList.add(data);
      },
      /*累加更新*/
      update: function (k, v) {
        var tmp = utils.getItemByKey(this.list, "key", k);
        if (!tmp) {
          return;
        }
        tmp.value = parseFloat(utils.addNum(tmp.value, v));
        this.orderedList.updateIndex(k);
      },
      /*总数更新*/
      updateWithTotal: function (k, v) {
        var tmp = utils.getItemByKey(this.list, "key", k);
        if (!tmp) {
          return;
        }
        tmp.value = v;
        this.orderedList.updateIndex(k);
      },
      /*获取*/
      get: function (start, length) {
        var listLength = this.list.length;
        if (start == undefined) {
          start = 0;
        }
        if (start < 0) {
          start = 0;
        }
        if (start >= listLength) {
          start = listLength - 1;
        }
        if (length == undefined) {
          length = 1;
        }
        if (length < 0) {
          length = 0;
        }
        var end = start + length;
        if (end > listLength) {
          end = listLength;
        }
        var result = [];
        for (var i = start, item; i < end; i++) {
          item = this.list[i];
          result.push(item);
        }
        return result;
      },
      /*获取排名*/
      getRankDic: function () {
        return this.orderedList.getRankDic();
      },
      getLength: function () {
        return this.list.length;
      },
      clear: function () {
        for (var i = 0, item; item = this.list[i++];) {
          item.value = 0;
        }
      },
      getMax: function () {
        return this.orderedList.getMax();
      }
    };

    //负责维护当前步长和计算高度
    heightManager = (function () {
      /*
       * 1.初始化时，票数最多的项占整个高度的1/2，此时有一个初始步长；
       * 2.如果最大票数为0，初始步长定为整个高度的1/10；
       * 3.达到4/5高度时，步长缩短1/4。
       */
      var step = 0, //一个单位对应的高度
        //最大高度
        max = 0,
        //警戒值
        alarmCount = 0,
        //调整高度 半个头像50，底座80，排名80
        fixHeight = 210,
        baseHeight = 120,
        //调整步长后，最大值到警戒值的缓冲数。
        countToRise = 10,
        //达到最大高度后的缩放比率
        hmZoomRate = 0.75;

      function calAlarmCount() {
        if (step == 0) {
          return 0;
        }
        return Math.floor(max * 0.95 / step);
      }
      var manager = {
        /*初始化*/
        init: function (parentHeight, maxCount, fixH, zoomRate) {
          if (fixH) {
            fixHeight = fixH;
          }
          if (zoomRate) {
            hmZoomRate = zoomRate;
          }
          if (maxCount < 1) {
            maxCount = 1;
          }
          max = parentHeight - fixHeight - baseHeight;
          this.resetStep(maxCount);
        },
        resetStep: function (maxCount) {
          if (maxCount > 0) {
            step = max * 0.5 / maxCount;
          } else {
            step = max * 0.75 / (1 + countToRise);
          }
          alarmCount = calAlarmCount();
        },
        /*根据票数计算高度*/
        calHeight: function (count) {
          var alarm = count > alarmCount;
          if (alarm) {
            step = max * hmZoomRate / (count + countToRise);
            alarmCount = calAlarmCount();
          }
          var h = step * count + baseHeight;
          return {
            alarm: alarm,
            height: h
          };
        },
        /*设置一项的高度(废弃)*/
        setItemHeight: function (itemDiv, v) {
          var calResult = this.calHeight(v);
          if (calResult.alarm) {
            this.initHeight();
          } else {
            $("div.vsItemBar", itemDiv).height(calResult.height);
            $("div.vsItemValue", itemDiv).html(v);
          }
        },
        /*设置所有项的高度(废弃)*/
        initHeight: function () {
          var itemDivs = $("div.vsItemDiv", container);
          for (var i = 0, itemDiv; itemDiv = itemDivs[i++];) {
            var v = $(itemDiv).attr("value");
            this.setItemHeight(itemDiv, v);
          }
        },
        /*窗口尺寸改变*/
        onResize: function () {
          var parentHeight = container.height();
          max = parentHeight - fixHeight - baseHeight;
          alarmCount = calAlarmCount();
        }
      };
      return manager;
    })();
    //负责维护待办队列
    todoManager = (function () {
      var todoList = [],
        isDoing = false;

      function excuteCmd() {
        var item = todoList.shift();
        utils.triggerEvent(item.commandName, item.commandArgs);
        if (todoList.length == 0) {
          isDoing = false;
        } else {
          excuteCmd();
        }
      }
      var manager = {
        add: function (cmdName, cmdArgs) {
          todoList.push({
            commandName: cmdName,
            commandArgs: cmdArgs
          });
          if (isDoing) {
            return;
          }
          isDoing = true;
          excuteCmd();
        }
      };
      return manager;
    })();
    //负责维护每页显示的项，和排序
    pageManager = (function () {
      var curPage = 1,
        lastPage = 1,
        listManager,
        maxCountPerPage = 6,
        pmAutoSort = true,
        pmSpecialDisplayCount, rankShow = true;

      function getListOfPage(pageNo) {
        var result = [];
        if (pageNo <= lastPage) {
          var startIndex = maxCountPerPage * (pageNo - 1);
          result = listManager.get(startIndex, maxCountPerPage);
        }
        return result;
      }

      function updateItem(key, v) {
        listManager.update(key, v);
      }

      function updateItemWithTotal(key, v) {
        listManager.updateWithTotal(key, v);
      }

      function initListManagerAndLastPage(list) {
        if (pmAutoSort) {
          listManager = new orderedList(list);
        } else {
          listManager = new noOrderedList(list);
        }
      }

      function initLastPage() {
        lastPage = Math.ceil(listManager.getLength() / maxCountPerPage);
        if (lastPage == 0) {
          lastPage = 1;
        }
      }

      var manager = {
        /*初始化*/
        init: function (list, colCount, autoSort, rank) {
          maxCountPerPage = colCount;
          if (autoSort != undefined) {
            pmAutoSort = autoSort;
          }
          if (rank != undefined) {
            if (rank.count != undefined) {
              pmSpecialDisplayCount = parseInt(rank.count);
            }
            if (rank.show != undefined) {
              rankShow = rank.show;
            }
          }

          initListManagerAndLastPage(list);
          initLastPage();
          return getListOfPage(curPage);
        },
        /*向前翻一页*/
        pre: function () {
          if (curPage == 1) {
            return [];
          }
          curPage--;
          return getListOfPage(curPage);
        },
        /*向后翻一页*/
        next: function () {
          if (curPage == lastPage) {
            return [];
          }
          curPage++;
          return getListOfPage(curPage);
        },
        /*获取当前页码*/
        getCurPageNo: function () {
          return curPage;
        },
        /*获取每页最多显示数*/
        getMaxCountPerPage: function () {
          return maxCountPerPage;
        },
        /*增加某项的值*/
        update: function (key, v) {
          updateItem(key, v);
          return getListOfPage(curPage);
        },
        /*增加某些项的值*/
        updateBatch: function (ktc) {
          for (var key in ktc) {
            updateItem(key, ktc[key]);
          }
          return getListOfPage(curPage);
        },
        /*更新某项的值*/
        updateWithTotal: function (key, v) {
          updateItemWithTotal(key, v);
          return getListOfPage(curPage);
        },
        /*更新某些项的值*/
        updateWithTotalBatch: function (ktc) {
          for (var key in ktc) {
            updateItemWithTotal(key, ktc[key]);
          }
          return getListOfPage(curPage);
        },
        /*追加项*/
        append: function (list) {
          for (var i = 0, item; item = list[i++];) {
            listManager.add(item);
          }
          initLastPage();
          return getListOfPage(curPage);
        },
        /*清空项的值*/
        clear: function () {
          if (!listManager || listManager.getLength() == 0) {
            return [];
          }
          listManager.clear();
          return getListOfPage(curPage);
        },
        showRank: function () {
          rankShow = true;
          return getListOfPage(curPage);
        },
        hideRank: function () {
          rankShow = false;
          return getListOfPage(curPage);
        },
        getRankDic: function () {
          if (!rankShow) {
            return {};
          }
          return listManager.getRankDic();
        },
        getMax: function () {
          return listManager.getMax();
        },
        onResize: function (colWidth) {
          var containerWidth = container.width();
          maxCountPerPage = Math.floor(containerWidth / colWidth);
          initLastPage();
          if (lastPage < curPage) {
            curPage = lastPage;
          }
          return getListOfPage(curPage);
        },
        getSpecialDisplayCount: function () {
          return pmSpecialDisplayCount;
        }
      };
      return manager;
    })();
    //负责画条形图
    barDrawer = (function () {
      var colWidth = 0,
        customDraw, containerWidth = 0,
        mq = new window.Marquee({
          direction: "left",
          speed: 50,
          step: 2,
          always: false
        });

      function appendOne(data, height, barColor, rank) {
        var itemDiv = utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemDiv",
            "key": data.key,
            "value": data.value
          },
          parent: container
        });
        $(itemDiv).width(colWidth);

        var baseDiv = utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemBase"
          },
          parent: itemDiv
        });

        var title = data.title;
        var titleDiv = utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemTitle"
          },
          parent: baseDiv,
          innerHtml: title
        });
        mq.draw(titleDiv, title);

        var bar = utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemBar"
          },
          parent: itemDiv
        });
        $(bar).css("background-color", data.color ? data.color : barColor).height(height > 0 ? height : 1);

        utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemValue"
          },
          parent: bar,
          innerHtml: data.value
        });

        if (rank != undefined) {
          utils.createElement({
            tag: "div",
            attr: {
              "class": "vsItemRank"
            },
            parent: bar,
            innerHtml: rank
          });
        }

        var headImgDiv = utils.createElement({
          tag: "div",
          attr: {
            "class": "vsItemHeadImg"
          },
          parent: bar
        });
        if (data.headImg) {
          $(headImgDiv).css("background-image", "url(" + data.headImg + ")");
        }
      }

      //var colorList = ['#68BDFF', '#FF7872', '#85E2F3', '#FF9704', '#FCA6F1'];
      //var getColor = (function () {
      //    var curIndex = 0, keyToIndex = {};

      //    return function (key) {
      //        var index = keyToIndex[key];
      //        if (index == undefined) {
      //            index = curIndex++;
      //            index %= colorList.length;
      //            keyToIndex[key] = index;
      //        }
      //        return colorList[index];
      //    };
      //})();

      function calHeightOfList(list) {
        var result = {};
        for (var i = 0, item; item = list[i++];) {
          var r = heightManager.calHeight(item.value);
          if (r.alarm) {
            return arguments.callee(list);
          }
          result[item.key] = r.height;
        }
        return result;
      }

      var drawer = {
        init: function (w, drawFunc) {
          containerWidth = w;
          customDraw = drawFunc;
        },
        draw: function (list) {
          if (customDraw) {
            customDraw(list, container);
            return;
          }
          if (!list || list.length == 0) {
            $(container).html("");
            return;
          }
          container.html("");
          var curPage = pageManager.getCurPageNo();
          if (curPage == 1) {
            colWidth = containerWidth / list.length;
          } else {
            colWidth = containerWidth / pageManager.getMaxCountPerPage();
          }
          var keyToHeight = calHeightOfList(list);
          var rankDic = pageManager.getRankDic(list);
          var rank, color, specialDisplayCount = pageManager.getSpecialDisplayCount();
          for (var i = 0, item; item = list[i++];) {
            rank = rankDic[item.key];
            if (rank != undefined && rank <= specialDisplayCount) {
              color = "#fbd70f";
              appendOne(item, keyToHeight[item.key], color, rank);
            } else {
              color = "#bf6e0d";
              appendOne(item, keyToHeight[item.key], color);
            }
          }
        },
        onResize: function () {
          containerWidth = container.width();
        }
      };
      return drawer;
    })();
  })();

  window.barChart = {
    create: function (options) {
      /*
       * options={
       *          selector:"#containerId",
       *          datas:[{key:1,title:小明,headImg:"http://www.abc.com",value:10},
       *          {key:2,title:小刚,headImg:"http://www.abc.com",value:8}],
       *          customDraw:{
       *              colWidth:230,//用于计算每页最多显示个数
       *              fixHeight:300,//容器高度与柱子最大高度的差值
       *              drawFunc:function(list, container){
       *                      //这里写自定义的条形图绘制方法
       *                  }
       *              },
       *          autoSort:true,
       *          zoomRate:0.75,
       *          rank:{
       *                  show:true,
       *                  count:3
       *              }
       *          }
       * 其中：selector——容器选择器；datas——选项初始化列表；customDraw——条形图绘制方法，为空时使用默认方法绘制；
       *      autoSort——自动排序，默认为true；rank——特别显示前几名，默认显示前三名；
       *      zoomRate——达到最大值时的缩放比率，为小于1的正小数。
       */
      var selector = options.selector;
      container = $(selector);
      if (!container) {
        return;
      }
      created = true;
      container.html("");
      var preDiv = utils.createElement({
        tag: "div",
        attr: {
          "class": "vsPre"
        },
        parent: container
      });
      var tmpContainer = utils.createElement({
        tag: "div",
        attr: {
          "class": "vsContainer"
        },
        parent: container
      });
      var nextDiv = utils.createElement({
        tag: "div",
        attr: {
          "class": "vsNext"
        },
        parent: container
      });
      container = $(tmpContainer);
      var containerHeight = container.height();
      var containerWidth = container.width();
      $(preDiv).on("click", function () {
        var lts = pageManager.pre();
        if (lts.length == 0) {
          return;
        }
        barDrawer.draw(lts);
      });
      $(nextDiv).on("click", function () {
        var lts = pageManager.next();
        if (lts.length == 0) {
          return;
        }
        barDrawer.draw(lts);
      });

      var drawFunc = null,
        fixHeight = 0;
      if (options.customDraw) {
        colWidthConst = options.customDraw.colWidth;
        fixHeight = options.customDraw.fixHeight;
        drawFunc = options.customDraw.drawFunc;
      }
      barDrawer.init(containerWidth, drawFunc);
      var colCount = Math.floor(containerWidth / colWidthConst);
      if (!options.datas || options.datas.length == 0) {
        heightManager.init(containerHeight, 0, fixHeight, options.zoomRate);
        pageManager.init([], colCount, options.autoSort, options.rank);
        return;
      }
      var listToShow = pageManager.init(options.datas, colCount, options.autoSort, options.rank);
      heightManager.init(containerHeight, pageManager.getMax().value, fixHeight, options.zoomRate);
      barDrawer.draw(listToShow);
    },
    todo: function (commandName, commandArgs) {
      todoManager.add(commandName, commandArgs);
    },
    calHeight: function (count) {
      return heightManager.calHeight(count);
    },
    getCurPageNo: function () {
      return pageManager.getCurPageNo();
    }
  };

  utils.registerEvent("vote", function (args) {
    var key = args.key,
      value = args.value;
    var listToShow = pageManager.update(key, value);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("voteBatch", function (args) {
    var listToShow = pageManager.updateBatch(args.keyToCount);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("updateWithTotal", function (args) {
    var key = args.key,
      value = args.value;
    var listToShow = pageManager.updateWithTotal(key, value);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("updateWithTotalBatch", function (args) {
    var listToShow = pageManager.updateWithTotalBatch(args.keyToCount);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("append", function (args) {
    var listToShow = pageManager.append(args.list);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("clear", function () {
    var listToShow = pageManager.clear();
    heightManager.resetStep(0);
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("showRank", function () {
    var listToShow = pageManager.showRank();
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("hideRank", function () {
    var listToShow = pageManager.hideRank();
    barDrawer.draw(listToShow);
  });
  utils.registerEvent("resize", function (args) {
    heightManager.onResize();
    barDrawer.onResize();
    var listToShow = pageManager.onResize(args.colWidth);
    barDrawer.draw(listToShow);
  });
})();
