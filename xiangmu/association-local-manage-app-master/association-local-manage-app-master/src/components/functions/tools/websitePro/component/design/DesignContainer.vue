<template>
    <div class="website-pro-fixed-fill-parent" :style="style">
        <div class="website-pro-absolute-fill-parent website-pro-flex column">
            <div class="website-pro-design-container-header website-pro-unset-padding">
                <div class="website-pro-design-container-header-handler website-pro-flex end">
                    <div class="flex-fill-in-the-remaining-space website-pro-design-container-title website-pro-flex">
                        <el-popover v-model="wmVisible" trigger="manual" placement="right-start" width="350">
                            <div class="website-pro-position-relative" style="height: 600px;">
                                <website-manage @close="wmVisible = false" @page-config-change="pageConfigChange"/>
                            </div>
                            <div class="website-pro-border-bottom-after website-pro-cursor-pointer" @click="wmVisible = !wmVisible"
                                 slot="reference" style="padding: 0 16px;outline: none;user-select: none;">
                                {{title}}<i :class="{'el-icon-caret-bottom': wmVisible, 'el-icon-caret-top': !wmVisible}"/>
                            </div>
                        </el-popover>
                    </div>
                    <div class="website-pro-flex column center">
                        <div class="website-pro-flex" style="height: 40px;">
                            <el-button type="text" @click="templateDialogVisible = true">保存为模版</el-button>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="primary" class="website-pro-position-relative" v-show="type === 'main'">
                                <span style="opacity: 0;">预览</span>
                                <a :href="previewHref" target="_blank" class="absolute-fill-parent" style="color: #ffffff;line-height: 36px;">预览</a>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space">
                <div class="website-pro-absolute-fill-parent website-pro website-pro-flex column">
                    <page-view style="z-index: 2;" v-if="module.otherSetting.fixedHeader && module.otherSetting.pageHeaderId"
                               design :module-id="module.otherSetting.pageHeaderId" type="header"/>
                    <vue-scroll class="flex-fill-in-the-remaining-space" ref="scroll">
                        <page-view style="z-index: 2;" design :module-id="module.otherSetting.pageHeaderId"
                                   v-if="!module.otherSetting.fixedHeader && module.otherSetting.pageHeaderId" type="header"/>
                        <div style="z-index: 1;" ref="drop" class="website-pro-module-drop-div" :style="{width: width+'px',height:height+'px'}"
                             @dragover="dragover" @drop="drop">
                            <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                       @setting="setting" @delete="deleteModule(index)"
                                       @setting-if-setting="settingIfSetting" @deleted="closeSetting"
                                       @refLineParams="getRefLineParams"/>
                            <div class="page-module-drop-tip website-pro-flex column center" v-show="dropTip">
                                <div class="website-pro-text-center" style="font-size: 18px;color: #333333;letter-spacing: 2px;">放在这里</div>
                            </div>
                            <span class="ref-line v-line"
                                  v-for="(item,index) in vLine" :key="`v-line${index}`"
                                  v-show="item.display"
                                  :style="{ left: item.position, top: item.origin, height: item.lineLength}"/>
                            <span class="ref-line h-line"
                                  v-for="(item,index) in hLine" :key="`h-line${index}`"
                                  v-show="item.display"
                                  :style="{ top: item.position, left: item.origin, width: item.lineLength}"/>
                        </div>
                        <page-view style="z-index: 2;" design :module-id="module.otherSetting.pageFooterId" v-if="module.otherSetting.pageFooterId" type="footer"/>
                    </vue-scroll>
                </div>
            </div>
        </div>
        <draggable-resizable class-name="website-pro-modules-and-setting-panel" :default-drag="false" :class="{hidden: !mspVisible}" style="position: absolute;z-index: 930521;" enable-native-drag
                                 :resizable="false" :y="100" :x="136" :w="typeComputed.settingPanelWidth" :h="700" parent>
            <el-container class="website-pro-absolute-fill-parent">
                <el-header class="website-pro-modules-and-setting-panel-header website-pro-unset-padding website-pro-flex" height="58px">
                    <div class="website-pro-modules-and-setting-panel-drag lrd-dom-drag">
                        <i class="el-icon-menu lrd-dom-drag"/>
                    </div>
                    <div class="flex-fill-in-the-remaining-space website-pro-modules-and-setting-panel-title website-pro-flex website-pro-position-relative">
                        <scroll-container ref="scrollContainer" class="website-pro-absolute-fill-parent" arrow-background="transparent" arrow-color="#FFFFFF">
                            <div v-for="(panel,index) of panels" :key="index" :ref="panel.module"
                                 class="text-nowrap cursor-pointer scroll-container-item"
                                 @click="setPanel(panel)" :class="{'website-pro-bottom-triangle': panel.module === mspComponent}"
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
                    <page-template v-show="mspVisible && mspComponent === 'pageTemplate'" ref="pageTemplateView"
                                   :template-type="0" :module-id="type" :img-width="typeComputed.pageTemplateImgWidth" @use="useTemplate"/>
                    <module-choose v-show="mspVisible && mspComponent === 'moduleChoose'" ref="moduleChooseView"
                                   :col-count="typeComputed.colCount" :img-width="typeComputed.moduleTemplateImgWidth"
                                   @set-group="setGroup" @set-module="setModule"/>
                    <module-tree :module="module" v-show="mspVisible && mspComponent === 'moduleTree1'" ref="moduleTree"
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
        <attribute-panel ref="settingPanel" :visible.sync="settingPanelVisible"
                         :module="settingModule" save-as-template @refresh-module-template="refreshModuleTemplate"/>
        <el-dialog :visible.sync="templateDialogVisible" title="保存为模版"
                   :close-on-click-modal="false" append-to-body width="760px">
            <template-form v-if="templateDialogVisible" :template-type="0" :module-id="type"
                           :seq="0" :template-config="templateConfig"
                           @close="templateDialogVisible=false" @refresh="refreshPageTemplate"/>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {addEvent,removeEvent} from "../../js/util/dom";
    import WebsiteManage from "../manage/WebsiteManage";
    import AttributePanel from "../attribute/AttributePanel";
    import PageFooter from '../../js/modules/page/pageFooter';
    import PageHeader from '../../js/modules/page/pageHeader';
    import PageMain from '../../js/modules/page/pageMain';
    import {moduleBuilder} from "../../js/modules/moduleBuilder";
    import ScrollContainer from "../../../../../util/scrollContainer/ScrollContainer";
    import CustomCss from "../manage/CustomCss";
    import ModuleChoose from "../manage/moduleChoose/ModuleChoose";
    import ModuleTree from "../manage/ModuleTree";
    import PageHeaderAttr from "../attribute/PageHeaderAttr";
    import PageFooterAttr from "../attribute/PageFooterAttr";

    import WsButtonSetting from "../modules/frequently/wsButton/WsButtonSetting";
    import WsTextSetting from "../modules/frequently/wsText/WsTextSetting";
    import WsImageSetting from "../modules/frequently/wsImage/WsImageSetting";
    import WsFillContainerSetting from "../modules/layout/wsFillContainer/WsFillContainerSetting";
    import WsFreeContainerSetting from "../modules/layout/wsFreeContainer/WsFreeContainerSetting";
    import WsArticleListSetting from "../modules/base/wsArticleList/WsArticleListSetting";
    import WsScrollListSetting from "../modules/base/wsScrollList/WsScrollListSetting";
    import WsGreatEventsSetting from "../modules/base/wsGreatEvents/WsGreatEventsSetting";
    import WsMenuSetting from "../modules/base/wsMenu/WsMenuSetting";
    import WsRichTextSetting from "../modules/base/wsRichText/WsRichTextSetting";
    import WsWheelPlantingSetting from "../modules/base/wsWheelPlanting/WsWheelPlantingSetting";
    import WsBreadcrumbSetting from "../modules/base/wsBreadcrumb/WsBreadcrumbSetting";
    import PageView from "../view/PageView";
    import DraggableResizable from "../modules/vue-draggable-resizable/DraggableResizable";
    import WsSideMenuSetting from "../modules/base/wsSideMenu/WsSideMenuSetting";
    import PageTemplate from "../manage/pageTemplate/PageTemplate";
    import TemplateForm from "../../../../system/templateManage/common/TemplateForm";

    export default {
        name: "DesignContainer",
        components: {
            TemplateForm,
            PageTemplate,
            WsSideMenuSetting,
            DraggableResizable,
            PageView,
            PageFooterAttr,
            PageHeaderAttr, ModuleTree, ModuleChoose, CustomCss, ScrollContainer, AttributePanel, WebsiteManage,

            WsBreadcrumbSetting,
            WsWheelPlantingSetting,
            WsRichTextSetting,
            WsMenuSetting,
            WsGreatEventsSetting,
            WsArticleListSetting,
            WsScrollListSetting,
            WsFreeContainerSetting,
            WsFillContainerSetting, WsImageSetting, WsTextSetting, WsButtonSetting
        },
        props:{
            moduleId: String,
            type: String
        },
        data(){
            return {
                style: {},
                provideData: null,
                //网站管理面板
                wmVisible: false,
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

                styleElement:null,

                templateDialogVisible: false,

                vLine: [],
                hLine: []
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
            typeComputed(){
                return {
                    settingPanelWidth: 350,
                    colCount: 4,
                    pageTemplateImgWidth: 316,
                    moduleTemplateImgWidth: 150,
                }
            },
            moduleName(){
                if(this.type === 'main'){
                    return '页面';
                }else if(this.type === 'header'){
                    return '页头';
                }else if(this.type === 'footer'){
                    return '页尾';
                }else{
                    return '';
                }
            },
            templateConfig(){
                let result = this.module.toJson();

                return JSON.stringify({
                    modules: result.modules,
                    otherSetting:{
                        customCss: result.otherSetting.customCss,
                    }
                });
            },
            title(){
                return `${this.moduleName}设计【${this.module.title}】`;
            },
            panels(){
                return [
                    {title:'模版', module:'pageTemplate', icon:'iconfont icon-template'},
                    {title:'结构', module:'moduleTree1', icon:'el-icon-s-operation'},
                    {title:'模块', module:'moduleChoose', icon:'el-icon-menu'},
                    {title:'样式', module:'customCss', icon:'iconfont icon-css'},
                ]
            },
            infoUrl(){
                if(this.type === 'main'){
                    return '/api/admin/website/anon/pageMain';
                }else if(this.type === 'header'){
                    return '/api/admin/website/anon/pageHeader';
                }else if(this.type === 'footer'){
                    return '/api/admin/website/anon/pageFooter';
                }else{
                    return '';
                }
            },
            builder(){
                if(this.type === 'main'){
                    return PageMain;
                }else if(this.type === 'header'){
                    return PageHeader;
                }else if(this.type === 'footer'){
                    return PageFooter;
                }else{
                    return null;
                }
            },
            saveUrl(){
                if(this.type === 'main'){
                    return '/api/admin/website/pageMain/config';
                }else if(this.type === 'header'){
                    return '/api/admin/website/pageHeader/config';
                }else if(this.type === 'footer'){
                    return '/api/admin/website/pageFooter/config';
                }else{
                    return '';
                }
            },
            previewHref(){
                return this.$router.resolve({path:`/page/${this.shortId}`}).href;
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
            pageConfigChange(otherSetting){
                let {pageHeaderId,pageFooterId,fixedHeader} = otherSetting;
                this.module.otherSetting.pageHeaderId = pageHeaderId;
                this.module.otherSetting.pageFooterId = pageFooterId;
                this.module.otherSetting.fixedHeader = fixedHeader;
            },
            setPanel(panel){
                this.mspVisible = true;
                this.mspComponent = panel.module;
                this.$refs.scrollContainer.childScroll(this.$refs[panel.module][0]);
            },
            setGroup(group){
                this.provideData.group = group;
            },
            setModule(module,moduleConfig){
                this.provideData.dropModule = module;
                this.provideData.dropModuleConfig = moduleConfig;
            },
            getModuleInfo(){
                this.closeSetting();
                if(this.moduleId && this.infoUrl){
                    this.loading = true;
                    this.$request.get(this.infoUrl,{
                        params:{
                            id:this.moduleId
                        }
                    }).then(res=>{
                        let {data} = res;
                        let obj = {
                            title: data.title,
                            id: data.id,
                            modules: JSON.parse(data.modules),
                            otherSetting: JSON.parse(data.otherSetting || "{}")
                        };
                        this.shortId = data.shortId;
                        this.module = Vue.observable(new this.builder(obj));
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            },
            useTemplate(templateConfig){
                this.loading = true;
                this.settingPanelVisible = false;
                let obj = {
                    title: this.module.title,
                    id: this.module.id,
                    modules: templateConfig.modules,
                    otherSetting: {
                        ...this.module.otherSetting,
                        customCss: templateConfig.otherSetting.customCss
                    }
                };
                this.module = Vue.observable(new this.builder(obj));
                this.$nextTick(()=>{ this.loading = false; })
            },
            save(){
                let data = this.module.toJson();

                this.$request.put(this.saveUrl,{
                    id:this.moduleId,
                    modules: JSON.stringify(data.modules),
                    otherSetting: JSON.stringify(data.otherSetting)
                }).then(()=>{
                    this.$message.success(`${this.moduleName}配置更新成功`);
                });
            },
            computeContainerStyle(){
                this.width = window.innerWidth;
                this.style = {
                    width: window.innerWidth+'px',
                    height: window.innerHeight+'px'
                };
            },
            setting(module){
                this.settingModule = module;
                this.settingPanelVisible = true;
            },
            deleteModule(index){
                this.module.deleteModule(index);
                this.closeSetting();
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
                if(this.settingPanelVisible){
                    this.settingModule = module;
                }
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
            closeSetting(){
                this.settingModule = null;
                this.settingPanelVisible = false;
            },
            refreshModuleTemplate(){
                this.$refs.moduleChooseView.getModuleTemplates();
            },
            refreshPageTemplate(){
                this.$refs.pageTemplateView.getModuleTemplates();
            },
            getRefLineParams (params) {
                const { vLine, hLine } = params;
                this.vLine = vLine;
                this.hLine = hLine;
            }
        },
        created() {
            this.computeContainerStyle();
            addEvent(window,'resize',this.computeContainerStyle);
            addEvent(window, 'dragover', this.windowDragOver);
            addEvent(window, 'dragend', this.windowDragEnd);

            this.getModuleInfo();
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
            type(){
                this.getModuleInfo();
            },
            moduleId(){
                this.$nextTick(()=>{
                    this.getModuleInfo();
                })
            },
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
            }
        }
    }
</script>
