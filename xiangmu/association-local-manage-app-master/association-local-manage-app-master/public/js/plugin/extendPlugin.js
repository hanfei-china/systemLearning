
/*用于扩展大屏幕控件*/

var startButtonState = {
    Init: 0,
    Ongoing: 1,
    Stop: 2,
    Ready: 3
};

var buttonType = {
    prevButton: 0,
    nextButton: 1,
    firstButton: 2,
    lastButton: 3,
    playButton:4
};

(function ($) {
    var buttonTitle = {
        Start: "开始",
        Stop: "停止",
        Continue: "继续",
        Ongoing: "进行中",
        Resize: "重置"
    };

    //按钮对象
    var startButtonObj = {
        id: 'startButton',
        className: 'startButton',
        title: '开始，快捷键[S]',
        children: buttonTitle.Start
    };
    var prevButtonObj = {
        id: 'prevButton',
        className: 'hdWallButton',
        cssInfo: { 'margin-left': '10px' },
        title: '上一页，快捷键[←]',
        children: "<div class='pluginButton prevButtonImg'></div>"
    };
    var nextButtonObj = {
        id: 'nextButton',
        className: 'hdWallButton',
        cssInfo: { 'margin-left': '10px' },
        title: '下一页，快捷键[→]',
        children: "<div class='pluginButton nextButtonImg'></div>"
    };
    var firstButtonObj = {
        id: 'firstButton',
        className: 'hdWallButton',
        title: '首页，快捷键[↑]',
        children: "<div class='pluginButton firstButtonImg'></div>"
    };
    var lastButtonObj = {
        id: 'endButton',
        className: 'hdWallButton',
        cssInfo: { 'margin': '0 10px' },
        title: '末页，快捷键[↓]',
        children: "<div class='pluginButton endButtonImg'></div>"
    };
    var playButtonObj = {
        id: 'playButton',
        className: 'hdWallButton',
        cssInfo: { 'margin-left': '10px' },
        title: '开始/暂停，快捷键[空格]',
        children: "<div class='pluginButton stopButtonImg'></div>"
    };

    var _fncList = [];

    commonPlugin.ExtendPlugin = function (gScreen) {
        this.backgroundImg = "";
        this.musicUrl = commonPlugin.backgroundMusic.ready;
        this.codeUrl = window.location.protocol + "//" + window.location.host + "/Screen/SpeechInteraction/RevisionComment?_taskId_=" + gScreen.screenId + 
        "&groupId=" + gScreen.survey.relatedGroup;
        this.dropListMgr = new dropListManager({ container: "#footer_ul" });
    };

    commonPlugin.ExtendPlugin.prototype = {
        register: function (fnc) {
            if (typeof fnc == "function") {
                _fncList.push(fnc);
            }
        },
        //注册按钮
        registerPrevButton: function (fnc) {

        },
        registerNextButton: function (fnc) {

        },
        registerButton: function (type, fnc) {
            switch (type) {
                case buttonType.firstButton:
                    commonPlugin.addButton(firstButtonObj, fnc);
                    break;
                case buttonType.prevButton:
                    commonPlugin.addButton(prevButtonObj, fnc);
                    break;
                case buttonType.playButton:
                    commonPlugin.addButton(playButtonObj, fnc);
                    break;
                case buttonType.nextButton:
                    commonPlugin.addButton(nextButtonObj, fnc);
                    break;
                case buttonType.lastButton:
                    commonPlugin.addButton(lastButtonObj, fnc);
                    break;
                default:
            }
        },
        registerStartButton: function (title, fnc) {
            startButtonObj.title = title;
            return commonPlugin.addButton(startButtonObj, fnc);
        },
        getButtonState: function () {
            var startButton = $("#startButton");
            var state = parseInt(startButton.attr("data-code"));
            return state;
        },
        setStartButtonState: function (code, isOngoing) {
            var startButton = $("#startButton");
            startButton.attr("data-code", code);
            switch (code) {
                case startButtonState.Ongoing:
                    startButton.html(isOngoing ? buttonTitle.Ongoing : buttonTitle.Stop);
                    break;
                case startButtonState.Stop:
                    startButton.html(buttonTitle.Continue);
                    break;
                case startButtonState.Ready:
                    startButton.html(buttonTitle.Start);
                    break;
                default:
            }
        },
        //注册人数下拉框
        registerCountSelect: function (tCount,isRocker) {
            if (!$("#countSelect")[0]) {
                var countSelectHtml = "<select id='countSelect'></select>";
                $("#footer_ul").append("<li class='countSelect_li'>" +
                    "<div>一次抽取</div >" + countSelectHtml + "<div class='countSelect_person'>人</div>" +
                    "</li>");
            }
            var countSelect = $("#countSelect");
            countSelect.children().remove();
            if (isRocker) {
                for (var i = 1; i <= 10; i++) {
                    countSelect.append("<option value='" + i + "'>" + i + "</option>");
                }
            } else {
                for (var i = 1; i <= 15; i++) {
                    countSelect.append("<option value='" + i + "'>" + i + "</option>");
                }
                if (tCount > 15 && tCount != 30 && tCount != 50) {
                    if (tCount < 30) {
                        countSelect.append("<option value='" + tCount + "'>" + tCount + "</option>");
                        countSelect.append("<option value='30'>30</option>");
                        countSelect.append("<option value='50'>50</option>");
                    } else {
                        countSelect.append("<option value='30'>30</option>");
                        if (tCount < 50) {
                            countSelect.append("<option value='" + tCount + "'>" + tCount + "</option>");
                            countSelect.append("<option value='50'>50</option>");
                        } else {
                            countSelect.append("<option value='50'>50</option>");
                            countSelect.append("<option value='" + tCount + "'>" + tCount + "</option>");
                        }
                    }
                } else {
                    countSelect.append("<option value='30'>30</option>");
                    countSelect.append("<option value='50'>50</option>");
                }
            }           
            return countSelect;
        },
        setCountSelected: function (currentId) {
            var countSelect = $("#countSelect");
            countSelect.find("option:selected").prop("selected", false);
            countSelect.find("[value=" + currentId + "]").prop("selected", true);
        },
        getCountSelect: function () {
            var countSelect = $("#countSelect");
            return countSelect.find("option:selected").val();
        },
        //注册奖品下拉框
        registerPrizeSelect: function (allRewards, changeEvent) {
            if (!allRewards || allRewards.length == 0) {
                return;
            }
            var prizeOptions = "<option value='0'>请选择</option >";
            for (var i = 0; i < allRewards.length; i++) {
                var prize = allRewards[i];
                prizeOptions += "<option value='" + prize.Id + "'>" + prize.Title + "</option>";
            }
            var prizeSelectHtml = "<select id='prizeSelect'>" + prizeOptions + "</select>";

            $("#footer_ul").append("<li class='prizeSelect_li'>" + "<div>奖品切换</div >" + prizeSelectHtml + "</li>");
            var prizeSelect = $("#prizeSelect");
            prizeSelect.on("change", changeEvent);
        },
        setPrizeSelect: function (currentId) {
            var prizeSelect = $("#prizeSelect");
            prizeSelect.find("option:selected").prop("selected", false);
            prizeSelect.find("option[value='" + currentId + "']").prop("selected", true);
        },
        getPrizeSelect: function () {
            var prizeSelect = $("#prizeSelect");
            return prizeSelect.find("option:selected").val();
        },
        deletePrizeSelect: function (result) {
            var prizeSelect = $("#prizeSelect");
            var id = this.getPrizeSelect();
            prizeSelect.find("option[value='" + result.Id + "']").remove();
            if (result.Id == id) {
                setPrizeSelect(result.Id);
            }
        },
        selectEnabled: function () {
            var countSelect = $("#countSelect");
            var prizeSelect = $("#prizeSelect");
            prizeSelect.attr("disabled", false);
            countSelect.attr("disabled", false);
        },
        selectDisabled: function () {
            var countSelect = $("#countSelect");
            var prizeSelect = $("#prizeSelect");
            prizeSelect.attr("disabled", true);
            countSelect.attr("disabled", true);
        },
        selectDisabledAndEnabled: function () {
            var countSelect = $("#countSelect");
            var prizeSelect = $("#prizeSelect");
            prizeSelect.attr("disabled", false);
            countSelect.attr("disabled", true);
        },
        active: function () {
            var firstFnc = _fncList.shift();
            if (firstFnc) {
                firstFnc.apply(null, arguments);
            }
            var self = arguments.callee;
            if (_fncList.length > 0) {
                self();
            }
        },
        //下拉框控件管理器
        getDroplistMgr: function () {
            return this.dropListMgr;
        }
    };

    //下拉框控件管理器
    function dropListManager(option) {
        this.container = $(option.container);
    }

    dropListManager.prototype = {
        add: function (option) {
            /*
            * option={
            *   code:'packetRain',
            *   title:'轮次',
            *   data:[{value:1,title:'第一轮'},{value:2,title:'第二轮'},{value:3,title:'第三轮'}],
            *   onChange:function(e){}
            * }
            */
            var li = document.createElement("li");
            li.setAttribute("code", option.code);
            this.container.append(li);

            var select = document.createElement("select");
            var optElement;
            if (option.title) {
                optElement = document.createElement("option");
                optElement.innerHTML = option.title;
                optElement.setAttribute("disabled", true);
                select.appendChild(optElement);
            }
            for (var i = 0, data; data = option.data[i++];) {
                optElement = document.createElement("option");
                optElement.innerHTML = data.title;
                optElement.setAttribute("value", data.value);
                select.appendChild(optElement);
            }
            li.appendChild(select);
            if (option.onChange) {
                $(select).on("change", option.onChange);
            }
        },
        select: function (code, value) {
            $("li[code=" + code + "] select", this.container).val(value);
        },
        getCurrentSelected: function (code) {
            return $("li[code=" + code + "] select", this.container).val();
        }
    };
})(jQuery)