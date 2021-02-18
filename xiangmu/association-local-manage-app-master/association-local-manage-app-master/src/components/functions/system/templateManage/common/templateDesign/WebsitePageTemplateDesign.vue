<template>
    <div class="website-pro-absolute-fill-parent" style="overflow: hidden;" :style="style">
        <div class="website-pro-absolute-fill-parent website-pro-flex column">
            <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space">
                <div class="website-pro-absolute-fill-parent website-pro website-pro-flex column">
                    <vue-scroll class="flex-fill-in-the-remaining-space" ref="scroll">
                        <div style="z-index: 1;" ref="drop" class="website-pro-module-drop-div" :style="{width: width+'px',height:height+'px'}"
                             @dragover="dragover" @drop="drop">
                            <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                       @setting="setting" @delete="deleteModule(index)"
                                       @setting-if-setting="settingIfSetting" @deleted="closeSetting"/>
                            <div class="page-module-drop-tip website-pro-flex column center" v-show="dropTip">
                                <div class="website-pro-text-center" style="font-size: 18px;color: #333333;letter-spacing: 2px;">放在这里</div>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
        <draggable-resizable class-name="website-pro-modules-and-setting-panel" :default-drag="false" :class="{hidden: !mspVisible}" style="position: absolute;z-index: 930521;" enable-native-drag
                             :resizable="false" :y="100" :x="136" :w="350" :h="700" parent>
            <el-container class="website-pro-absolute-fill-parent">
                <el-header class="website-pro-modules-and-setting-panel-header website-pro-unset-padding website-pro-flex" height="58px">
                    <div class="website-pro-modules-and-setting-panel-drag lrd-dom-drag">
                        <i class="el-icon-menu lrd-dom-drag"/>
                    </div>
                    <div class="flex-fill-in-the-remaining-space website-pro-modules-and-setting-panel-title website-pro-flex website-pro-position-relative">
                        <scroll-container ref="scrollContainer" class="website-pro-absolute-fill-parent" arrow-background="transparent" arrow-color="#FFFFFF">
                            <div v-for="(panel,index) of panels" :key="index" :ref="panel.module"
                                 class="text-nowrap cursor-pointer scroll-container-item" @click="setPanel(panel)" :class="{'website-pro-bottom-triangle': panel.module === mspComponent}"
                                 style="padding: 0 14px;font-size: 15px;line-height: 58px;letter-spacing:1px;">
                                {{panel.title}}
                            </div>
                        </scroll-container>
                    </div>
                    <div class="website-pro-modules-and-setting-panel-close" @click.stop="mspVisible = false">
                        <i class="el-icon-close"/>
                    </div>
                </el-header>
                <el-main class="website-pro-position-relative website-pro-unset-padding">
                    <custom-css v-if="mspVisible && mspComponent === 'customCss'" v-model="module.otherSetting.customCss"/>
                    <module-choose v-show="mspVisible && mspComponent === 'moduleChoose'" @set-group="setGroup" @set-module="setModule"/>
                    <module-tree :module="module" v-show="mspVisible && mspComponent === 'moduleTree'" ref="moduleTree"
                                 @node-click="nodeClick" @setting="setting"
                                 @deleted="closeSetting" @delete-module="treeDeleteModule"/>
                </el-main>
            </el-container>
        </draggable-resizable>
        <div class="website-pro-design-container-left-handlers" v-show="!mspVisible">
            <div v-for="(panel,index) of panels" :key="index">
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" style="padding: 0 25px;">{{panel.title}}</div>
                    <el-button class="website-design-container-left-handler" type="primary" circle @click="setPanel(panel)">
                        <i :class="panel.icon"/>
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <attribute-panel ref="settingPanel" :visible.sync="settingPanelVisible" :module="settingModule"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {addEvent,removeEvent} from "../../../../tools/websitePro/js/util/dom";
    import AttributePanel from "../../../../tools/websitePro/component/attribute/AttributePanel";
    import {moduleBuilder} from "../../../../tools/websitePro/js/modules/moduleBuilder";
    import ScrollContainer from "../../../../../util/scrollContainer/ScrollContainer";
    import CustomCss from "../../../../tools/websitePro/component/manage/CustomCss";
    import ModuleChoose from "../../../../tools/websitePro/component/manage/moduleChoose/ModuleChoose";
    import ModuleTree from "../../../../tools/websitePro/component/manage/ModuleTree";
    import PageMain from "../../../../tools/websitePro/js/modules/page/pageMain";

    import WsButtonSetting from "../../../../tools/websitePro/component/modules/frequently/wsButton/WsButtonSetting";
    import WsTextSetting from "../../../../tools/websitePro/component/modules/frequently/wsText/WsTextSetting";
    import WsImageSetting from "../../../../tools/websitePro/component/modules/frequently/wsImage/WsImageSetting";
    import WsFillContainerSetting from "../../../../tools/websitePro/component/modules/layout/wsFillContainer/WsFillContainerSetting";
    import WsFreeContainerSetting from "../../../../tools/websitePro/component/modules/layout/wsFreeContainer/WsFreeContainerSetting";
    import WsArticleListSetting from "../../../../tools/websitePro/component/modules/base/wsArticleList/WsArticleListSetting";
    import WsGreatEventsSetting from "../../../../tools/websitePro/component/modules/base/wsGreatEvents/WsGreatEventsSetting";
    import WsMenuSetting from "../../../../tools/websitePro/component/modules/base/wsMenu/WsMenuSetting";
    import WsRichTextSetting from "../../../../tools/websitePro/component/modules/base/wsRichText/WsRichTextSetting";
    import WsWheelPlantingSetting from "../../../../tools/websitePro/component/modules/base/wsWheelPlanting/WsWheelPlantingSetting";
    import WsBreadcrumbSetting from "../../../../tools/websitePro/component/modules/base/wsBreadcrumb/WsBreadcrumbSetting";

    import DraggableResizable from "../../../../tools/websitePro/component/modules/vue-draggable-resizable/DraggableResizable";
    import WsSideMenuSetting from "../../../../tools/websitePro/component/modules/base/wsSideMenu/WsSideMenuSetting";

    export default {
        name: "WebsitePageTemplateDesign",
        components: {
            WsSideMenuSetting,
            DraggableResizable,
            ModuleTree, ModuleChoose, CustomCss, ScrollContainer, AttributePanel,

            WsBreadcrumbSetting,
            WsWheelPlantingSetting,
            WsRichTextSetting,
            WsMenuSetting,
            WsGreatEventsSetting,
            WsArticleListSetting,
            WsFreeContainerSetting,
            WsFillContainerSetting, WsImageSetting, WsTextSetting, WsButtonSetting
        },
        props:{
            templateConfig: Object,
        },
        data(){
            return {
                style: {},
                provideData: null,

                //组件属性设置面板
                settingModule: null,
                //属性面板显示
                settingPanelVisible: false,

                mspComponent: '',
                mspVisible: false,

                module: {
                    modules: [],
                    title: '',
                    otherSetting:{
                        customCss: '',
                        pageHeaderId: '',
                        pageFooterId: '',
                        fixedHeader: false
                    }
                },
                loading: true,
                shortId: '',

                width: window.innerWidth,

                //释放提示
                dropTip: false,

                styleElement:null
            }
        },
        provide(){
            const provideData = Vue.observable({
                scrollEl: null,
                settingPanel: null,
                group: '',
                dropModule:'',
                dropModuleConfig: null
            });
            this.provideData = provideData;
            return {
                designProvide: provideData
            };
        },
        computed:{
            panels(){
                return [
                    {title:'结构', module:'moduleTree', icon:'el-icon-s-operation'},
                    {title:'模块', module:'moduleChoose', icon:'el-icon-menu'},
                    {title:'样式', module:'customCss', icon:'iconfont icon-css'},
                ]
            },
            height(){
                let result = 0;
                if(this.module){
                    for(let module of this.module.modules){
                        let {attributes} = module;

                        let {top,height} = attributes.layoutGroup.attributes.layout.value;

                        if(top+height > result){
                            result = top + height;
                        }

                    }
                }
                if(this.dropTip){
                    result += 100;
                }

                return result;
            }
        },
        methods:{
            setPanel(panel){
                this.mspVisible = true;
                this.mspComponent = panel.module;
            },
            setGroup(group){
                this.provideData.group = group;
            },
            setModule(module,moduleConfig){
                this.provideData.dropModule = module;
                this.provideData.dropModuleConfig = moduleConfig;
            },
            computeContainerStyle(){
                this.width = window.innerWidth;
                this.style = {
                    width: window.innerWidth+'px',
                    height: window.innerHeight-60+'px'
                };
            },
            setting(module){
                this.settingModule = module;
                this.settingPanelVisible = true;
            },
            deleteModule(index){
                this.module.deleteModule(index);
            },
            treeDeleteModule(data){
                let parentModules = this.module.modules;
                let index = -1;
                for(let i in parentModules){
                    let module = parentModules[i];
                    if(module.id === data.id){
                        index = i;
                        break;
                    }
                }
                if(index > -1){
                    this.deleteModule(index);
                }
            },
            settingIfSetting(module){
                this.$refs.moduleTree.setCurrentKey(module.id);
            },
            getRefs(node,refs){
                let {data,parent} = node;
                if(data && parent){
                    refs.push(data.id);
                    this.getRefs(parent,refs);
                }
            },
            nodeClick(node){
                let {data,parent} = node;

                if(this.settingPanelVisible){
                    this.settingModule = data;
                }

                if(data.name === 'wsMenuItem' || data.name === 'wsBreadcrumbItem'
                    || data.name === 'wsSideMenuItem'){
                    return;
                }

                let refs = [];
                if(data){
                    refs.push(data.id);
                }

                if(parent){
                    this.getRefs(parent,refs);
                }

                if(refs.length > 0){

                    let module = null;

                    for(let index = refs.length - 1;index >= 0;index--){
                        let ref = refs[index];
                        if(module){
                            let modules = module.$refs[ref];
                            if(modules && modules.length > 0){
                                module = module.$refs[ref][0];
                            }
                        }else{
                            module = this.$refs[ref][0];
                        }
                    }
                    if(module){
                        module.$refs.setting.settingActive = true;
                    }
                }
            },
            dragover(event) {
                if (this.provideData.group === 'website-module') {
                    event.preventDefault();
                }
            },
            getTop(element) {
                let offset = element.offsetTop;
                if (element.offsetParent) {
                    offset += this.getTop(element.offsetParent);
                }
                return offset;
            },
            getLeft(element) {
                let offset = element.offsetLeft;
                if (element.offsetParent != null) {
                    offset += this.getLeft(element.offsetParent);
                }
                return offset;
            },
            getParentSize() {
                return {
                    top: this.getTop(this.$refs.drop),
                    left: this.getLeft(this.$refs.drop),
                }
            },
            drop(event) {
                let scrollTop = this.$refs.drop.parentElement.parentElement.scrollTop;
                let {pageX, pageY} = event;
                let {left, top} = this.getParentSize();

                if (left > pageX) {
                    left = 0;
                } else {
                    left = pageX - left;
                }

                if (top > pageY) {
                    top = 0;
                } else {
                    top = pageY - top;
                }

                top += scrollTop;

                let moduleName = this.provideData.dropModule;

                let position = {left, top};

                let module = moduleBuilder(moduleName, this.provideData.dropModuleConfig).setPosition(position);
                this.module.addModule(module);
            },
            windowDragOver(event) {
                event.preventDefault();
                this.dropTip = true;
            },
            windowDragEnd() {
                this.dropTip = false;
            },
            emitChange(){
                let result = this.module.toJson();

                this.$emit('change',JSON.stringify({
                    modules: result.modules,
                    otherSetting:{
                        customCss: result.otherSetting.customCss,
                    }
                }));
            },
            closeSetting(){
                this.settingPanelVisible = false;
            }
        },
        created() {
            this.computeContainerStyle();
            addEvent(window,'resize',this.computeContainerStyle);
            addEvent(window, 'dragover', this.windowDragOver);
            addEvent(window, 'dragend', this.windowDragEnd);

            let obj = {
                title: '',
                id: 'main',
                modules: this.templateConfig.modules,
                otherSetting: {
                    customCss: this.templateConfig.otherSetting.customCss
                }
            };

            this.module = Vue.observable(new PageMain(obj));
        },
        mounted(){
            this.provideData.scrollEl = this.$refs.scroll.$refs.scrollPanel;
            this.provideData.settingPanel = this.$refs.settingPanel;

            let style = document.createElement('style');
            style.innerHTML = this.module.otherSetting.customCss;
            if(document.body.append){
                document.body.append(style);
            }else{
                document.body.appendChild(style);
            }
            this.styleElement = style;
        },
        beforeDestroy() {
            removeEvent(window,'resize', this.computeContainerStyle);
            removeEvent(window, 'dragover', this.windowDragOver);
            removeEvent(window, 'dragend', this.windowDragEnd);
        },
        watch:{
            'module.otherSetting.customCss'(val){
                if(this.styleElement){
                    this.styleElement.innerHTML = val;
                }else{
                    let style = document.createElement('style');
                    style.innerHTML = val;
                    if(document.body.append){
                        document.body.append(style);
                    }else{
                        document.body.appendChild(style);
                    }
                    this.styleElement = style;
                }
                this.emitChange();
            },
            'module.modules':{
                deep:true,
                handler(){
                    this.emitChange();
                }
            }
        }
    }
</script>
