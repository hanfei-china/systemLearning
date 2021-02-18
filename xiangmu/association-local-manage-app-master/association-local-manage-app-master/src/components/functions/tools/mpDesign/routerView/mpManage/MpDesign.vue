<template>
    <el-container class="absolute-fill-parent">
        <el-aside class="unset-padding" width="414px">
            <el-container class="absolute-fill-parent">
                <el-aside width="70px" class="position-relative flow-hidden"
                          style="background-color: rgba(46, 60, 69, .1);">
                    <vue-scroll>
                        <el-menu v-if="loading" class="full-parent-vertical design-el-menu" :default-active="panel" mode="vertical"
                                 :collapse="true" @select="panelSelect">
                            <el-menu-item index="tabs" style="padding: 0;">
                                <div class="design-el-menu-item">
                                    <label><label
                                            class="icon iconfont icon-mp-tab design-el-menu-item-icon"/></label>
                                    <label class="design-el-menu-item-title">菜单</label>
                                </div>
                            </el-menu-item>
                            <el-menu-item index="pages" style="padding: 0;">
                                <div class="design-el-menu-item">
                                    <label><label
                                            class="icon iconfont icon-mp-page design-el-menu-item-icon"/></label>
                                    <label class="design-el-menu-item-title">页面</label>
                                </div>
                            </el-menu-item>
                            <el-menu-item index="modules" style="padding: 0;">
                                <div class="design-el-menu-item">
                                    <label><label class="icon iconfont icon-mp-module design-el-menu-item-icon"/></label>
                                    <label class="design-el-menu-item-title">模块</label>
                                </div>
                            </el-menu-item>
                        </el-menu>
                    </vue-scroll>
                </el-aside>
                <el-aside width="344px" style="background-color: #FFFFFF;" class="position-relative flow-hidden">
                    <mp-page-manage v-if="panel === 'pages'" :active-page-index="activePageIndex"
                                    @page-change="pageChange" @page-design="pageDesign" @page-setting="setting"
                                    @close-setting="clearAttributes" />
                    <tab-bar-manage v-if="panel === 'tabs'" :active-tab-index="activeTabIndex"
                                    @tab-setting="setting" @tab-bar-setting="setting" @tab-change="tabChange"/>
                    <module-choose v-if="panel == 'modules'" />
                </el-aside>
            </el-container>
        </el-aside>
        <el-main>
            <vue-scroll>
                <tab-preview v-if="panel === 'tabs'" :active-tab-index="activeTabIndex"
                             @tab-change="tabChange" style="box-shadow: 2px 2px 4px 2px rgba(150,150,150,0.8);" />
                <page-preview :page-config="activePage" v-else style="box-shadow: 2px 2px 4px 2px rgba(150,150,150,0.8);"
                              @module-setting="setting" @close-setting="clearAttributes"/>
            </vue-scroll>
        </el-main>
        <el-aside class="unset-padding" width="344px" :style="settingPanelStyle" v-loading="settingLoading" v-show="!showChildAttributes">
            <el-container class="absolute-fill-parent background-color-white" v-show="showChildren || showAttributes">
                <el-header class="unset-padding" height="61px">
                    <el-menu mode="horizontal" :default-active="settingPanel" @select="settingPanelChange" class="padding-left-menu">
                        <el-menu-item index="attributes">
                            属性设置
                        </el-menu-item>
                        <el-menu-item index="children" v-if="hasChildrenModule">
                            {{childrenComponentTitle}}
                        </el-menu-item>
                    </el-menu>
                </el-header>
                <el-main class="unset-padding">
                    <div class="absolute-fill-parent" v-show="showAttributes">
                        <vue-scroll>
                            <module-setting :attributes="attributes" :educationList="educationList" :collegeList="collegeList" :majorList="majorList" />
                        </vue-scroll>
                    </div>
                    <component v-show="showChildren" :is="childrenComponent" :module="hasChildrenModule" @child-module-setting="childSetting"/>
                </el-main>
            </el-container>
        </el-aside>
        <el-aside class="unset-padding" width="344px" :style="settingPanelStyle" v-loading="settingLoading" v-show="showChildAttributes">
            <el-container class="absolute-fill-parent">
                <el-header class="unset-padding" height="61px">
                    <div class="position-absolute" style="top:18px;left: 16px;z-index: 333;cursor: pointer;" @click.stop="closeChildSettingPanel">
                        <iconfont icon="icon-back-parent"/>
                    </div>
                    <el-menu mode="horizontal" default-active="attributes" class="padding-left-menu">
                        <el-menu-item index="attributes">
                            属性设置
                        </el-menu-item>
                    </el-menu>
                </el-header>
                <el-main class="unset-padding">
                    <div class="absolute-fill-parent">
                        <vue-scroll>
                            <module-setting :attributes="childAttributes" :educationList="educationList" :collegeList="collegeList" :majorList="majorList"/>
                        </vue-scroll>
                    </div>
                </el-main>
            </el-container>
        </el-aside>

    </el-container>
</template>

<script>
    import ModuleChoose from '../../modules/pageModules/_moduleCommon/ModuleChoose';
    import PagePreview from '../../modules/page/PagePreview';
    import MpPageManage from '../../modules/page/MpPageManage';
    import TabPreview from '../../modules/tabBar/TabPreview';
    import TabBarManage from '../../modules/tabBar/TabBarManage';
    import ModuleSetting from '../../modules/pageModules/_moduleCommon/ModuleSetting';
    import Iconfont from '../../util/Iconfont';

    import homeBtnContainerChildren from '../../modules/pageModules/homeBtnContainer/homeBtnContainerChildren';
    import homeBtnAreaChildren from '../../modules/pageModules/homeBtnArea/homeBtnAreaChildren';
    import entryGroupChildren from '../../modules/pageModules/entryGroup/entryGroupChildren';
    import pageChildren from '../../modules/page/pageChildren';

    export default {
        name: "MpDesign",
        components: {
            Iconfont,
            ModuleSetting,
            MpPageManage,
            TabPreview,
            TabBarManage,
            ModuleChoose,
            PagePreview,
            homeBtnContainerChildren,
            homeBtnAreaChildren,
            entryGroupChildren,
            pageChildren
        },
        inject: ['mpUserConfig'],
        data() {
            return {
                panel: 'pages',
                activePageIndex: 0,
                activeTabIndex: 0,
                activeTab: '',
                attributes: null,
                settingLoading: false,
                openSettingPanel: false,
                hasChildrenModule: false,
                childrenComponent: '',
                settingPanel: 'attributes',
                openChildSettingPanel: false,
                childAttributes: null,
                loading: true,

                educationList:[],
                collegeList:[],
                majorList:[]
            }
        },
        computed: {
            activePage() {
                return this.mpUserConfig.getPageByIndex(this.activePageIndex);
            },
            settingPanelStyle() {
                let style = {};
                if (this.openSettingPanel) {
                    style.backgroundColor = '#FFFFFF';
                } else {
                    style.backgroundColor = 'transparent';
                }

                return style;
            },
            showAttributes(){
                return this.settingPanel === 'attributes' && this.attributes;
            },
            showChildren(){
                return this.settingPanel === 'children' && this.hasChildrenModule;
            },
            showChildAttributes(){
                return (this.showAttributes || this.showChildren) && this.childAttributes && this.openChildSettingPanel;
            },
            childrenComponentTitle(){
                if('pageChildren' === this.childrenComponent){
                    return '侧停按钮管理';
                }else{
                    return '子级管理';
                }
            },
        },
        methods: {
            panelSelect(value) {
                if(value === 'templates'){
                    this.$emit('change-template');
                    this.$nextTick(()=>{ this.loading = false; })
                    setTimeout(()=>{
                        this.loading = true;
                    },20)
                }else{
                    this.panel = value;
                }
                this.clearAttributes();
            },
            pageChange(index) {
                let length = this.mpUserConfig.getPageCount();
                if (index >= length) {
                    this.activePageIndex = length - 1;
                } else {
                    this.activePageIndex = index;
                }
                this.clearAttributes();
            },
            tabChange(index){
                let length = this.mpUserConfig.getTabBar().list.length;
                if (index >= length) {
                    this.activeTabIndex = length - 1;
                } else {
                    this.activeTabIndex = index;
                }
            },
            pageDesign(index) {
                this.activePageIndex = index;
                this.panel = 'modules';
            },
            setting(module) {
                this.attributes = null;
                this.openSettingPanel = true;
                this.settingLoading = true;
                this.hasChildrenModule = null;
                this.childrenComponent = '';
                this.settingPanel = 'attributes';
                this.childAttributes = null;
                this.openChildSettingPanel = false;

                setTimeout(() => {
                    this.attributes = module.attributes;
                    this.settingLoading = false;
                    let name = module.name;
                    if (['homeBtnContainer', 'entryGroup', 'page', 'homeBtnArea'].indexOf(name) > -1) {
                        this.hasChildrenModule = module;
                        this.childrenComponent = name + 'Children';
                    }
                }, 200);

            },
            clearAttributes() {
                this.hasChildrenModule = null;
                this.childrenComponent = '';
                this.attributes = null;
                this.openSettingPanel = false;
                this.childAttributes = null;
                this.openChildSettingPanel = false;
            },
            settingPanelChange(index){
                this.settingPanel = index;
            },
            childSetting(module){
                this.childAttributes = module.attributes;
                this.openChildSettingPanel = true;
            },
            closeChildSettingPanel(){
                this.childAttributes = null;
                this.openChildSettingPanel = false
            }
        },
        created(){
            this.$request.get('/api/common/associator/historyCollege/educations').then(res=>{
                this.educationList = res.data;
            })
            this.$request.get('/api/common/associator/historyCollege/colleges').then(res => {
                this.collegeList = res.data;
            })
            this.$request.get('/api/common/associator/historyCollege/majors').then(res => {
                this.majorList = res.data;
            })
        }
    }
</script>
