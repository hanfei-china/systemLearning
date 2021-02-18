<template>
    <vue-ueditor-wrap style="line-height: initial;" @ready="ready" :config="myConfig" v-model="copyContent"></vue-ueditor-wrap>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap';
    import {requestBaseUrl} from "../../../js/config/serviceConfig";

    let ue = null;
    export default {
        name: "Editor",
        components: {VueUeditorWrap},
        data() {
            return {
                ue: null,
                baseUrl: requestBaseUrl,
                myConfig: {
                    // 如果需要上传功能,找后端小伙伴要服务器接口地址
                    serverUrl: requestBaseUrl + '/api/common/anon/editor',
                    // 你的UEditor资源存放的路径,相对于打包后的index.html(路由使用history模式注意使用绝对路径或者填写正确的相对路径)
                    UEDITOR_HOME_URL: 'ueditor/',
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: this.initialFrameHeight,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 关闭自动保存
                    enableAutoSave: false,


                    toolbars: [
                        ["undo", "redo", "|", "fontsize", "fontfamily", "blockquote", "|", "removeformat", "formatmatch", "|", "link", "spechars", "superscript", "subscript", "|", "PastePlain", "directionalityltr", "directionalityrtl", "|", 'touppercase', 'tolowercase',
                            "bold", "italic", "underline", "strikethrough", "forecolor", "shadowcolor", "backcolor", "|", "indent", "lineheight", 'letterspacing', 'outpadding', "rowspacingtop", "rowspacingbottom", "|", "justifyleft", "justifycenter", "justifyright", "justifyjustify", "insertorderedlist", "insertunorderedlist", "|", "autotypeset", 'simpleupload', "horizontal", "searchreplace", "|", "source",]
                    ],

                    zIndex: 2999,
                    charset: "utf-8",
                    textarea: "content",
                    initialStyle: "",
                    autoClearEmptyNode: !1,
                    saveInterval: 5e6,
                    imagePopup: !0,
                    emotionLocalization: !0,
                    insertorderedlist: {
                        decimal: "",
                        "lower-alpha": "",
                        "lower-roman": "",
                        "upper-alpha": "",
                        "upper-roman": "",
                        "cjk-ideographic": "一、二、三、",
                        "lower-greek": "α,β,γ,δ"
                    },
                    insertunorderedlist: {
                        circle: "",
                        disc: "",
                        square: ""
                    },
                    listDefaultPaddingLeft: "30",
                    maxListLevel: -1,
                    autoTransWordToList: !0,
                    fontfamily: [{
                        label: "",
                        name: "yahei",
                        val: "微软雅黑"
                    }, {
                        label: "",
                        name: "songti",
                        val: "宋体,SimSun"
                    }, {
                        label: "",
                        name: "kaiti",
                        val: "楷体,楷体_GB2312,SimKai"
                    }, {
                        label: "",
                        name: "heiti",
                        val: "黑体,SimHei"
                    }, {
                        label: "",
                        name: "lishu",
                        val: "隶书,SimLi"
                    }, {
                        label: "",
                        name: "arial",
                        val: "arial,helvetica,sans-serif"
                    }],
                    fontsize: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 28, 32, 36],
                    letterspacing: [0, 0.5, 1, 1.5, 2, 3, 4, 5],
                    enableContextMenu: !0,
                    elementPathEnabled: !1,
                    wordCount: !1,
                    removeFormatTags: "a,b,big,code,del,dfn,em,font,i,section,blockquote,pre,fieldset,ins,kbd,q,samp,small,span,label,strike,strong,sub,sup,tt,u,let",
                    removeFormatAttributes: "class,style,lang,width,accuse,height,align,hspace,valign,data-width,data-brushtype,opacity,border,title,placeholder",
                    maxUndoCount: 50,
                    scaleEnabled: !1,
                    imageScaleEnabled: !1,
                    autoFloatEnabled: !1,
                    autotypeset: {
                        mergeEmptyline: !0,
                        removeClass: !1,
                        removeEmptyline: !1,
                        textAlign: !1,
                        imageBlockLine: !1,
                        pasteFilter: !1,
                        clearFontSize: !1,
                        clearFontFamily: !1,
                        removeEmptyNode: !1,
                        indent: !1,
                        indentValue: "2em",
                        bdc2sb: !1,
                        tobdc: !1
                    },
                    sourceEditor: "codemirror",
                    catchRemoteImageEnable: false,
                    xssFilterRules: true,
                    //input xss过滤
                    inputXssFilter: true,
                    //output xss过滤
                    outputXssFilter: true,
                    whitList:{
                        span: ['class', 'x-id'],
                    }
                },
                copyContent: this.content
            }
        },
        props: {
            openImgMaxWidth:{
                type: Boolean,
                default: true
            },
            content: {
                type: String,
                default() {
                    return '';
                }
            },
            initialFrameHeight: {
                type: Number,
                default() {
                    return 500;
                }
            },
            zIndex: {
                type: Number,
                default() {
                    return 3000;
                }
            },
            toolbars: {
                type: Array,
                default() {
                    return [[
                        'undo', 'redo', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
                        'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                        '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', '|',
                        'simpleupload', 'emotion', 'attachment', '|',
                        'horizontal', 'date', 'time', 'spechars', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts'
                    ]];
                }
            }
        },
        model: {
            prop: 'content',
            event: 'change'
        },
        watch: {
            copyContent(newValue) {
                if(this.openImgMaxWidth){
                    let dom = document.createElement('div');
                    dom.innerHTML = newValue;

                    let images = $(dom).find('img');
                    for(let i = 0;i < images.length;i++){
                        $(images[i]).css('max-width','100%');
                    }
                    this.$emit('change', dom.innerHTML);
                }else{
                    this.$emit('change', newValue);
                }
            },
            content(newValue) {
                if(!this.copyContent){
                    this.copyContent = newValue;
                }
            }
        },
        methods: {
            ready(editorInstance) {
                let that = this;
                ue = editorInstance;
                this.ue = editorInstance;
                ue.addListener('afterSelectionChange', function () {
                    if (ue.hasContents()) { //有内容
                        $(ue.body).removeClass("indicate");
                    } else {
                        $(ue.body).addClass("indicate");
                    }
                })

                clearSelectLine();

                $(ue.body).delegate('.KolEditor', 'click', function (event) {
                    let target = event.srcElement || event.target;
                    if ($(target).get(0).tagName.toLowerCase() !== 'img') {
                        clearSelectLine();
                        $(this).addClass("checkSelected");
                        // 加载素材操作工具条
                        materialOperation($(this));
                    }
                });
                // 当点击照片的时候，跳转到图库列表，并且点击的时候可以替换
                $(ue.body).delegate('img', 'click', function () {
                    clearSelectLine();
                    $(this).parent().addClass("checkSelected");
                    // 加载素材操作工具条
                    materialOperation($(this));
                })
                $(ue.body).click(function (event) {
                    let target = event.srcElement || event.target;
                    if ($(target).get(0).tagName.toLowerCase() === 'body') {
                        clearSelectLine();
                        that.$emit('change', ue.getContent());
                    }
                });

                //替换图片地址
                let k = "";
                $(ue.body).keydown(function (event) {
                    if (event.ctrlKey === 1) {
                        if (document.all) {
                            k = event.keyCode
                        } else {
                            k = event.which
                        }
                        // ctrl+v
                        if (k === 86) {
                            ue.addListener('selectionchange', function () {
                                $(ue.body).find("img").each(function () {
                                    if ($(this).attr("src").indexOf(":") !== -1 && $(this).attr("src").split(":")[1].substr(0, 15) === '//mmbiz.qpic.cn') {
                                        $(this).attr("data-src", $(this).attr("src"));
                                        let imgurl = $(this).attr("src").split(":")[1].substr(15).split("?")[0];
                                        $(this).attr("src", location.protocol + "//" + location.host + "/" + "weixin" + imgurl);
                                    }
                                })
                            })

                            // ctrl+s
                        } else if (k === 83) {
                            return false;
                        }
                        $(ue.body).find(".checkSelected").removeClass("checkSelected");
                    }
                })

                $(window).scroll(function () {
                    if ($(".material-operation-tools").length > 0) {
                        clearSelectLine();
                        $(".material-operation-tools").remove();
                        $("[id*=collorpicker_]").hide();
                        that.$emit('change', ue.getContent());
                    }
                })


                // 隐藏工具条
                $(document).click(function (event) {
                    let target = event.srcElement || event.target;
                    if ($(target).parents(".tools-bar").size() <= 0 && $(target).parents(".colpick").size() <= 0) {
                        clearSelectLine();
                        $(".material-operation-tools").remove();
                        $("[id*=collorpicker_]").hide();
                        that.$emit('change', ue.getContent());
                    }
                    target = event.srcElement || event.target;
                    if ($(target).parents(".tools-bar").size() <= 0 && $(target).parents(".colpick").size() <= 0) {
                        clearSelectLine();
                        $(".material-operation-tools").remove();
                        $("[id*=collorpicker_]").hide();
                        that.$emit('change', ue.getContent());
                    }
                });
                window.uetext = function () {
                    return ue.getContent();
                }
                window.clearUeContent = function () {
                    ue.setContent('<p></p>');
                }


            },
            appendContent(content){
                this.copyContent += content;
            }
        },

    }


    // 素材操作工具条
    function materialOperation(material) {
        material.materialToolsBar(ue, requestBaseUrl);
    }

    // 删除选中框
    function clearSelectLine() {
        $(ue.body).find(".checkSelected").removeClass("checkSelected");
        $("menu").remove();
        $(".material-operation-tools").remove();
        $("[id*=collorpicker_]").hide();
    }


</script>
