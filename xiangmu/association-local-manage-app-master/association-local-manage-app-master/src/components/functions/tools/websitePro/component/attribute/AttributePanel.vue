<template>
    <draggable-resizable :default-drag="false" ref="container" class-name="website-pro-modules-and-setting-panel" :class="{hidden: !visible}" style="position: absolute;z-index: 930521;" enable-native-drag
                             :resizable="false" :y="60" :x="left" :w="350" :h="700" parent>
        <el-container class="website-pro-absolute-fill-parent">
            <el-header class="website-pro-unset-padding website-pro-flex" height="58px">
                <div class="website-pro-modules-and-setting-panel-drag lrd-dom-drag">
                    <i class="el-icon-menu lrd-dom-drag"/>
                </div>
                <div class="flex-fill-in-the-remaining-space website-pro-modules-and-setting-panel-title website-pro-flex website-pro-position-relative">
                    <div class="text-nowrap cursor-pointer scroll-container-item" :class="{'website-pro-bottom-triangle': settingPanel === 'attributeSetting'}"
                         style="padding: 0 14px;font-size: 15px;line-height: 58px;letter-spacing:1px;"
                         @click="changePanel('attributeSetting')" >
                        属性设置
                    </div>
                    <div class="text-nowrap cursor-pointer scroll-container-item" v-show="openModules" :class="{'website-pro-bottom-triangle': settingPanel === 'childrenManage'}"
                         style="padding: 0 14px;font-size: 15px;line-height: 58px;letter-spacing:1px;"
                         @click="changePanel('childrenManage')" >
                        子级管理
                    </div>
                </div>
                <div class="website-pro-modules-and-setting-panel-close" @click.stop="$emit('update:visible',false)">
                    <i class="el-icon-close"/>
                </div>
            </el-header>
            <el-main class="website-pro-position-relative website-pro-unset-padding">
                <attribute-setting v-show="settingPanel === 'attributeSetting'" :module="module" ref="attributeSetting"/>
                <component v-if="openModules" v-show="settingPanel === 'childrenManage'"
                           :is="module.name + 'ChildrenManage'" :module="module"/>
            </el-main>
            <el-footer v-if="saveAsTemplate" class="website-pro-flex column center" style="background-color: #409EFF;">
                <div class="text-align-center">
                    <el-button type="text" style="color: white;" @click="templateDialogVisible=true"><i class="iconfont icon-save" style="padding-right: 4px;font-weight: bold;"/>保存为模版</el-button>
                </div>
            </el-footer>
        </el-container>
        <el-dialog :visible.sync="templateDialogVisible" title="保存为模版"
                   :close-on-click-modal="false" append-to-body width="760px">
            <template-form v-if="templateDialogVisible" :template-type="1" :module-id="moduleId"
                           :seq="0" :template-config="templateConfig"
                           @close="templateDialogVisible=false" @refresh="$emit('refresh-module-template')"/>
        </el-dialog>
    </draggable-resizable>
</template>

<script>
    import AttributeGroup from "./AttributeGroup";
    import DraggableResizable from "../modules/vue-draggable-resizable/DraggableResizable";
    import WsMenuChildrenManage from "../modules/base/wsMenu/WsMenuChildrenManage";
    import AttributeSetting from "./AttributeSetting";
    import WsBreadcrumbChildrenManage from "../modules/base/wsBreadcrumb/WsBreadcrumbChildrenManage";
    import WsSideMenuChildrenManage from "../modules/base/wsSideMenu/WsSideMenuChildrenManage";
    import TemplateForm from "../../../../system/templateManage/common/TemplateForm";

    export default {
        name: "AttributePanel",
        components: {
            TemplateForm,
            WsSideMenuChildrenManage,
            WsBreadcrumbChildrenManage,
            AttributeSetting, WsMenuChildrenManage, AttributeGroup,DraggableResizable},
        props:{
            module: Object,
            visible: {
                type: Boolean,
                default: false
            },
            saveAsTemplate: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return {
                active: [],
                left: 436,
                settingPanel: 'attributeSetting',
                templateDialogVisible: false
            }
        },
        computed:{
            attributes(){
                return this.module ? this.module.attributes : {};
            },
            openModules(){
                return this.module ? this.module.openModules : false;
            },
            templateConfig(){
                return JSON.stringify(this.module.toJsonWithoutId());
            },
            moduleId(){
                return this.module.name;
            }
        },
        watch:{
            attributes(val){
                this.active = ['moduleTitle'];
                for(let key in val){
                    this.active.push(key);
                }
            },
            openModules(val){
                if(!val){
                    this.settingPanel = 'attributeSetting';
                }
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return this.$refs.attributeSetting.isChildren(e) || target === this.$refs.container.$el ||  this.$refs.container.$el.contains(target);
            },
            changePanel(index){
                this.settingPanel = index;
            }
        },
        mounted() {
            this.left = window.innerWidth - 380;
        }
    }
</script>
<style lang="less">
    .module-template-save{
        color: white;
        font-size: 20px;
        cursor: pointer;
    }
</style>
