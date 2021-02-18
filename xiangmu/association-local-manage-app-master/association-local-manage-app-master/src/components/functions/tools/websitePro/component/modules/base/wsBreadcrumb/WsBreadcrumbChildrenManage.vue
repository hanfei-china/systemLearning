<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll v-show="dataSrc === 1" :ops="{scrollPanel:{scrollingX: false}}">
            <draggable class="website-pro-position-relative" style="padding:16px;" tag="div"
                       handle=".ui-sortable-handle" :animation="300" v-model="module.modules">
                <ws-breadcrumb-child-setting v-for="(item,index) in module.modules" :key="item.id" :module="item"
                                       @new-item="newItem(index)" @delete-item="deleteItem(index)"
                                       @setting-item="settingItem(item)"/>
            </draggable>
        </vue-scroll>
        <el-container v-show="dataSrc === 2" class="website-pro-absolute-fill-parent">
            <el-aside width="80px" class="border-right">
                <el-menu class="border-right-unset custom-el-menu" :default-active="activeName" @select="setActiveName">
                    <el-menu-item index="prefixModules">前置项</el-menu-item>
                    <el-menu-item index="suffixModules">后置项</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="website-pro-unset-padding website-pro-position-relative">
                <el-container class="website-pro-absolute-fill-parent">
                    <el-header class="border-bottom flex flex-center flex-column" height="56px">
                        <div class="flex flex-end">
                            <el-button size="small" type="primary" @click="addItem(null)">新增{{button}}</el-button>
                        </div>
                    </el-header>
                    <el-main class="website-pro-unset-padding">
                        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                            <draggable class="website-pro-position-relative" style="padding:16px;" tag="div"
                                       handle=".ui-sortable-handle" :animation="300" v-model="module[activeName]">
                                <ws-breadcrumb-child-setting v-for="(item,index) in module[activeName]" :key="item.id" :module="item"
                                                             @new-item="addItem(index)" @delete-item="deleteItem1(index)"
                                                             @setting-item="settingItem(item)"/>
                            </draggable>
                        </vue-scroll>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
        <el-container class="website-pro-absolute-fill-parent-width right background-color-white"
                      :class="{show:showSetting}">
            <el-header class="website-pro-flex column center" height="49px">
                <div class="website-pro-flex">
                    <div class="website-pro-flex column center" @click="close" style="cursor: pointer;">
                        <i class="iconfont icon-back-parent"/>
                    </div>
                    <div class="website-pro-flex" style="padding-left: 16px;">
                        <div>{{settingModule.title}}</div>
                    </div>
                </div>
            </el-header>
            <el-main class="website-pro-unset-padding website-pro-position-relative">
                <attribute-setting :module="settingModule"/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import AttributeSetting from "../../../attribute/AttributeSetting";
    import WsBreadcrumbChildSetting from "./WsBreadcrumbChildSetting";

    export default {
        name: "WsBreadcrumbChildrenManage",
        components: {WsBreadcrumbChildSetting, AttributeSetting},
        props: {
            module: Object
        },
        data() {
            return {
                settingModule: {},
                showSetting: false,
                activeName: 'prefixModules'
            }
        },
        computed:{
            dataSrc(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc;
            },
            button(){
                if(this.activeName === 'prefixModules'){
                    return '前置项';
                }else if(this.activeName === 'suffixModules'){
                    return '后置项';
                }else{
                    return '';
                }
            }
        },
        methods: {
            setActiveName(activeName){
                this.activeName = activeName;
            },
            newItem(index) {
                this.module.addModule(index);
            },
            addItem(index){
                if(this.activeName === 'prefixModules'){
                    this.module.addPrefixModule(index);
                }else if(this.activeName === 'suffixModules'){
                    this.module.addSuffixModule(index);
                }
            },
            deleteItem(index) {
                this.module.deleteModule(index);
            },
            deleteItem1(index) {
                if(this.activeName === 'prefixModules'){
                    this.module.deletePrefixModule(index);
                }else if(this.activeName === 'suffixModules'){
                    this.module.deleteSuffixModule(index);
                }
            },
            settingItem(item) {
                this.settingModule = item;
                this.showSetting = true;
            },
            close(){
                this.settingModule = {};
                this.showSetting = false;
            }
        },
    }
</script>
