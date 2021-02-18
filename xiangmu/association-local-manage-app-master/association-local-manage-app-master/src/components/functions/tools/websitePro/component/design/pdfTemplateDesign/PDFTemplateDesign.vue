<template>
    <div class="website-pro-fixed-fill-parent" style="overflow: hidden;" v-loading="loading">
        <div class="website-pro-absolute-fill-parent website-pro-flex column">
            <div class="website-pro-design-container-header website-pro-unset-padding">
                <div class="website-pro-design-container-header-handler website-pro-flex end" style="max-width: calc(100% - 32px);padding: 0 16px;">
                    <div class="flex-fill-in-the-remaining-space website-pro-design-container-title website-pro-flex">
                        <div class="website-pro-border-bottom-after website-pro-cursor-pointer"
                             style="padding: 0 16px;outline: none;user-select: none;">
                            {{title}}
                        </div>
                    </div>
                    <div class="website-pro-flex column center">
                        <div class="website-pro-flex" style="height: 40px;">
                            <a class="website-pro-flex column center lrd-a" style="margin-right: 16px;" target="_blank" :href="previewUrl">预览证书样例</a>
                            <a class="website-pro-flex column center lrd-a" style="margin-right: 16px;" :href="downloadUrl">下载证书样例</a>
                            <el-button type="primary" @click="save">保存</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space" style="background-color: #f2f5f8;">
                <vue-scroll>
                    <div style="padding: 20px 0;position: relative;">
                        <ws-p-d-f-page class="website-pro-opacity" :module="module" @template-change="templateChange"/>
                        <div style="z-index: 1;" ref="drop" :style="containerStyle"
                             @dragover="dragover" @drop="drop">
                            <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                       @setting="setting" @delete="deleteModule(index)" @refLineParams="getRefLineParams"
                                       @setting-if-setting="settingIfSetting" @deleted="closeSetting"/>
                            <div class="website-pro-flex column center website-pro-absolute-fill-parent" style="overflow: hidden;background-color: rgba(64, 158, 255, 0.3);" v-show="dropTip">
                                <div class="website-pro-text-center" style="font-size: 14px;color: #333333;letter-spacing: 2px;">放在这里</div>
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
                    </div>
                </vue-scroll>
            </div>
        </div>
        <draggable-resizable class-name="website-pro-modules-and-setting-panel" :default-drag="false"
                             :class="{hidden: !mspVisible}" style="position: absolute;z-index: 930521;" enable-native-drag
                             :resizable="false" :y="40" :x="40" :w="350" :h="700" parent>
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
                    <module-choose v-show="mspVisible && mspComponent === 'moduleChoose'" ref="moduleChooseView"
                                   :show-modules="showModules" :is-get-templates="false"
                                   @set-group="setGroup" @set-module="setModule"/>
                    <module-tree :module="module" v-show="mspVisible && mspComponent === 'moduleTree1'"
                                 ref="moduleTree" :drag-drop-props="dragDropProps"
                                 @node-click="nodeClick" @setting="setting"
                                 @deleted="closeSetting" @delete-module="treeDeleteModule"/>
                    <attribute-setting hidden-module-title :module="module" v-show="mspVisible && mspComponent === 'containerSetting'"/>
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
                         :module="settingModule"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {addEvent,removeEvent} from "../../../js/util/dom";
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";

    import WsPDFPageTs from "../../../js/modules/pdf/wsPDFPage";
    import AttributePanel from "../../attribute/AttributePanel";
    import {moduleBuilder} from "../../../js/modules/moduleBuilder";
    import ScrollContainer from "../../../../../../util/scrollContainer/ScrollContainer";
    import ModuleChoose from "../../manage/moduleChoose/ModuleChoose";
    import ModuleTree from "../../manage/ModuleTree";
    import DraggableResizable from "../../modules/vue-draggable-resizable/DraggableResizable";
    import WsPDFImageSetting from "../../modules/pdf/wsPDFImage/WsPDFImageSetting";
    import AttributeSetting from "../../attribute/AttributeSetting";
    import WsPDFFieldSetting from "../../modules/pdf/wsPDFField/WsPDFFieldSetting";
    import WsPDFTextSetting from "../../modules/pdf/wsPDFText/WsPDFTextSetting";
    import WsPDFPage from "../../modules/pdf/wsPDFPage/WsPDFPage";


    export default {
        name: "PDFTemplateDesign",
        components: {
            WsPDFPage,
            WsPDFTextSetting,
            WsPDFFieldSetting,
            AttributeSetting,
            WsPDFImageSetting,
            DraggableResizable,
            ModuleTree, ModuleChoose, ScrollContainer, AttributePanel,
        },
        data(){
            return {
                requestBaseUrl,
                showModules: [
                    {
                        title: '常用',
                        name: 'frequently',
                        modules: [
                            {name: 'wsPDFText', title: '文字', icon: 'iconfont icon-ws-text'},
                            {name: 'wsPDFImage', title: '图片', icon: 'iconfont iconfont icon-ws-image'},
                            {name: 'wsPDFField', title: '字段', icon: 'iconfont icon-ws-field'},
                        ]
                    },
                ],

                provideData: null,

                //组件属性设置面板
                settingModule: null,
                //属性面板显示
                settingPanelVisible: false,

                mspComponent: '',
                mspVisible: false,

                module:  new WsPDFPageTs({}),
                templateInfo: {},
                loading: true,


                //释放提示
                dropTip: false,

                styleElement:null,

                templateDialogVisible: false,

                dragDropProps:{
                    allowDrop(draggingNode, dropNode,dropType) {
                        return dropType !== 'inner';
                    },
                    allowDrag() {
                        return true;
                    },
                },

                vLine: [],
                hLine: [],
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
            moduleId(){
                return this.$route.params.moduleId;
            },
            downloadUrl(){
                return requestBaseUrl+'/api/common/designTemplate/certificateSample/' + this.moduleId;
            },
            previewUrl(){
                return requestBaseUrl+'/api/common/designTemplate/certificateSamplePreview/' + this.moduleId;
            },
            containerStyle(){
                let style = {};

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.styleGroup.attributes.background.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                style.margin = '0 auto';
                style.position = 'relative';
                return style;
            },
            moduleName(){
                return this.templateInfo && this.templateInfo.templateName ? this.templateInfo.templateName : '证书';
            },
            title(){
                return `${this.moduleName}设计`;
            },
            panels(){
                return [
                    {title:'设置', module:'containerSetting', icon:'el-icon-setting'},
                    {title:'结构', module:'moduleTree1', icon:'el-icon-s-operation'},
                    {title:'模块', module:'moduleChoose', icon:'el-icon-menu'},
                ]
            },
        },
        methods:{
            getRefLineParams (params) {
                const { vLine, hLine } = params;
                this.vLine = vLine;
                this.hLine = hLine;
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
                this.loading = true;
                this.$request.post(`/api/common/designTemplate/certificateTemplateInfo/${this.moduleId}`).then(res=>{
                    let {data} = res;
                    if(data){
                        let {templateConfig} = data;
                        this.templateInfo = data;
                        this.module = Vue.observable(new WsPDFPageTs(JSON.parse(templateConfig)));
                        this.$nextTick(()=>{
                            this.$nextTick(()=>{ this.loading = false; })
                        })
                    }
                })
            },
            templateChange(html){
                this.templateInfo.templateExt = html;
            },
            save(){
                let data = this.module.toJson();

                this.$request.put('/api/admin/designTemplate/certificateConfig',{
                    id: this.templateId,
                    ...this.templateInfo,
                    templateConfig: JSON.stringify(data)
                }).then(()=>{
                    this.$message.success(`${this.moduleName}配置更新成功`);
                });
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
                let scrollTop = this.$refs.drop.parentElement.parentElement.parentElement.scrollTop;
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
        },
        created() {
            addEvent(window, 'dragover', this.windowDragOver);
            addEvent(window, 'dragend', this.windowDragEnd);
            this.getModuleInfo();
        },
        mounted(){
            this.provideData.settingPanel = this.$refs.settingPanel;
        },
        beforeDestroy() {
            removeEvent(window, 'dragover', this.windowDragOver);
            removeEvent(window, 'dragend', this.windowDragEnd);
        },
        watch:{
            moduleId(){
                this.getModuleInfo();
            },
        }
    }
</script>
