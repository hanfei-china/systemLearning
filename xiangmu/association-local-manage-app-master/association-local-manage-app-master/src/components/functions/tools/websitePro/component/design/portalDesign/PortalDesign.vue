<template>
     <div class="website-pro-fixed-fill-parent" style="overflow: hidden;">
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
                                   <el-button type="primary" @click="save">保存</el-button>
                              </div>
                         </div>
                    </div>
               </div>
               <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space" style="background-color: #f2f5f8;">
                    <div style="z-index: 1;" ref="drop" class="website-pro-absolute-fill-parent website-pro-flex"
                         @dragover="dragover" @drop="drop" :style="styles.containerStyle">
                         <div class="flex-fill-in-the-remaining-space website-pro-flex" :style="componentContainerStyle">
                              <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                         @setting="setting" @delete="deleteModule(index)"
                                         @setting-if-setting="settingIfSetting" @deleted="closeSetting"/>
                         </div>
                         <div class="website-pro-flex column center" :style="styles.dropTipStyle" style="overflow: hidden;background-color: rgba(64, 158, 255, 0.3);" v-show="dropTip">
                              <div class="website-pro-text-center" style="font-size: 14px;color: #333333;letter-spacing: 2px;">放在这里</div>
                         </div>
                    </div>
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

     import AttributePanel from "../../attribute/AttributePanel";
     import {moduleBuilder} from "../../../js/modules/moduleBuilder";
     import ScrollContainer from "../../../../../../util/scrollContainer/ScrollContainer";
     import ModuleChoose from "../../manage/moduleChoose/ModuleChoose";
     import ModuleTree from "../../manage/ModuleTree";
     import DraggableResizable from "../../modules/vue-draggable-resizable/DraggableResizable";
     import WsCellContainer from "../../../js/modules/layout/wsCell/wsCellContainer";
     import WsColSetting from "../../modules/layout/portal/wsCol/WsColSetting";
     import WsRowSetting from "../../modules/layout/portal/wsRow/WsRowSetting";
     import WsPortalNoticeSetting from "../../modules/layout/portal/wsPortalNotice/WsPortalNoticeSetting";
     import WsCellTitleContainerSetting from "../../modules/layout/portal/wsCellTitleContainer/WsCellTitleContainerSetting";
     import WsPortalButtonSetting from "../../modules/layout/portal/wsPortalButton/WsPortalButtonSetting";
     import WsPortalChartSetting from "../../modules/layout/portal/wsPortalChart/WsPortalChartSetting";
     import WsPortalRichTextSetting from "../../modules/layout/portal/wsPortalRichText/WsPortalRichTextSetting";


     export default {
          name: "PortalDesign",
          components: {
               WsPortalRichTextSetting,
               WsPortalChartSetting,
               WsPortalButtonSetting,
               WsCellTitleContainerSetting,
               WsPortalNoticeSetting,
               WsRowSetting,
               WsColSetting,
               DraggableResizable,
               ModuleTree, ModuleChoose, ScrollContainer, AttributePanel,
          },
          data(){
               return {
                    provideData: null,

                    //组件属性设置面板
                    settingModule: null,
                    //属性面板显示
                    settingPanelVisible: false,

                    mspComponent: '',
                    mspVisible: false,

                    module: new WsCellContainer({}),
                    templateInfo: {},
                    loading: true,


                    //释放提示
                    dropTip: false,

                    styleElement:null,

                    templateDialogVisible: false,

                    dragDropProps:{
                         allowDrop(draggingNode, dropNode,dropType) {
                              let {data:draggingData} = draggingNode;
                              let {data: dropData} = dropNode;
                              let {name: draggingName} = draggingData;
                              let {name: dropName, modules} = dropData;

                              if(dropType !== 'inner'){
                                   return dropName === draggingName;
                              }else{
                                   if(draggingName === 'wsCellTabPane'){
                                        return dropName === 'wsCellTitleContainer' && dropData.attributes.advancedGroup.attributes.containerType.value === 'tab';
                                   }
                                   for(let module of modules){
                                        let moduleName = module.name;
                                        if(moduleName !== draggingName){
                                             return false;
                                        }
                                   }

                                   return true;
                              }
                         },
                         allowDrag() {
                              return true;
                         },
                    },

                    roleInfo: null
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
               showModules(){
                    let first = {};
                     if(['main','branch'].indexOf(this.moduleId)>-1){
                          first = {
                               title: '常用',
                               name: 'frequently',
                               modules: [
                                    {name: 'wsPortalNotice', title: '图文列表', icon: 'iconfont icon-ws-article-list'},
                                    {name: 'wsPortalButton', title: '按钮', icon: 'iconfont icon-ws-button'},
                                    {name: 'wsPortalChart', title: '图表', icon: 'iconfont icon-ws-portal-chart'},
                                    {name: 'wsPortalRichText', title: '富文本', icon: 'iconfont icon-ws-portal-rich-text'},
                               ]
                          };
                    }else{
                          first = {
                               title: '常用',
                               name: 'frequently',
                               modules: [
                                    {name: 'wsPortalNotice', title: '图文列表', icon: 'iconfont icon-ws-article-list'},
                                    {name: 'wsPortalButton', title: '按钮', icon: 'iconfont icon-ws-button'},
                                    {name: 'wsPortalRichText', title: '富文本', icon: 'iconfont icon-ws-portal-rich-text'},
                               ]
                          };
                    }

                    return [
                         first,
                         {
                              title: '排版',
                              name: 'layout',
                              modules: [
                                   {name: 'wsRow', title: '行', icon: 'iconfont icon-ws-row'},
                                   {name: 'wsCol', title: '列', icon: 'iconfont icon-ws-col'},
                                   {name: 'wsCellTitleContainer', title: '容器', icon: 'iconfont icon-ws-cell-title-container'},
                                   {name: 'wsCellTabsContainer', title: '页签容器', icon: 'iconfont icon-ws-portal-tabs-container'},
                                   {name: 'wsCellTabPane', title: '页签项', icon: 'iconfont i icon-ws-portal-tab-pane'},
                              ]
                         }
                    ]
               },
               moduleId(){
                    return this.$route.params.moduleId;
               },
               isHasRow(){
                    for(let module of this.module.modules){
                         let {name} = module;
                         if(name === 'wsRow'){
                              return true;
                         }
                    }
                    return false;
               },
               isHasCol(){
                    for(let module of this.module.modules){
                         let {name} = module;
                         if(name === 'wsCol'){
                              return true;
                         }
                    }
                    return false;
               },
               isEmptyContainer(){
                    return this.module.modules.length<1;
               },
               componentContainerStyle(){
                    if(this.isHasRow){
                         return {
                              flexDirection: 'column'
                         }
                    }

                    return {};
               },
               styles(){
                    let moduleName = this.provideData.dropModule;
                    if(moduleName === 'wsCol'){
                         return {
                              containerStyle: {},
                              dropTipStyle:{
                                   flex: '0 0 80px',
                              },
                              isCol: true
                         }
                    }else if(moduleName === 'wsRow'){
                         return {
                              containerStyle: {
                                   flexDirection: 'column'
                              },
                              dropTipStyle:{
                                   flex: '0 0 80px',
                              },
                              isRow: true
                         }
                    }else{
                         return {
                              containerStyle: {
                                   flexDirection: 'column'
                              },
                              dropTipStyle:{
                                   flex: '0 0 80px',
                              },
                              isCell: true
                         }
                    }
               },
               moduleName(){
                    if(this.moduleId === 'main'){
                         return '总会首页';
                    }else if(this.moduleId === 'branch'){
                         return '分会首页';
                    }else{
                         if(this.roleInfo){
                              return `【${this.roleInfo.name}】首页`;
                         }else{
                              return '';
                         }

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
                    return `${this.moduleName}设计`;
               },
               panels(){
                    return [
                         {title:'结构', module:'moduleTree1', icon:'el-icon-s-operation'},
                         {title:'模块', module:'moduleChoose', icon:'el-icon-menu'},
                    ]
               },
          },
          methods:{
               getRoleInfo(){
                    this.$request.get('/api/admin/group/getGroup', {params: {type: 8,operate:0,id:this.moduleId}}).then(res => {
                         this.roleInfo = res.data[0];
                    });
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
                    if(this.moduleId){
                         this.loading = true;
                         this.$request.post('/api/common/designTemplate/portalInfo',{
                              moduleId:this.moduleId
                         }).then(res=>{
                              let {data} = res;
                              let {templateConfig} = data;
                              this.templateInfo = data;
                              this.module = Vue.observable(new WsCellContainer(JSON.parse(templateConfig)));
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

                    this.$request.put('/api/admin/designTemplate/config',{
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
               drop() {
                    if(this.dropTip){
                         let moduleName = this.provideData.dropModule;

                         let module = moduleBuilder(moduleName, this.provideData.dropModuleConfig);
                         this.module.addModule(module);

                    }
               },
               windowDragOver(event) {
                    event.preventDefault();
                    if((this.isEmptyContainer
                            || this.isHasRow && this.styles.isRow
                            || this.isHasCol && this.styles.isCol) &&  this.provideData.dropModule !== 'wsCellTabPane'){
                         this.dropTip = true;
                    }
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
               this.getRoleInfo();
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
               type(){
                    this.getModuleInfo();
               },
               moduleId(){
                    this.getRoleInfo();
                    this.$nextTick(()=>{
                         this.getModuleInfo();
                    })
               },
          }
     }
</script>
