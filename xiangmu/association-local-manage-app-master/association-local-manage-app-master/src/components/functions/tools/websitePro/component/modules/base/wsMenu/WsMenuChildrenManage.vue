<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
            <draggable class="website-pro-position-relative" style="padding:16px;" tag="div"
                       handle=".ui-sortable-handle" :animation="300" v-model="module.modules">
                <ws-menu-child-setting v-for="(item,index) in module.modules" :key="item.id" :module="item"
                                       @new-item="newItem(index)" @delete-item="deleteItem(index)"
                                       @setting-item="settingItem(item)" @setting-child="settingChild"/>
            </draggable>
        </vue-scroll>
        <el-container class="website-pro-absolute-fill-parent-width right background-color-white"
                      :class="{show:showSetting}">
            <el-header class="website-pro-flex column center" height="49px">
                <div class="website-pro-flex">
                    <div class="website-pro-flex column center" @click="close" style="cursor: pointer;">
                        <i class="iconfont icon-back-parent"></i>
                    </div>
                    <div class="website-pro-flex" style="padding-left: 16px;">
                        <div :class="{'website-pro-is-link':childSettingModule.id}"
                             class="website-pro-text-overflow" style="max-width: 100px;"
                             v-if="settingModule.id" @click="nativeSettingItem(settingModule)">
                            {{settingModule.title}}
                        </div>
                        <div v-if="childSettingModule.id" class="website-pro-is-link" @click="nativeSettingItem(settingModule)">
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <div class="website-pro-text-overflow" style="max-width: 100px;padding-left: 4px;" v-if="childSettingModule.id">
                            {{childSettingModule.title}}
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main class="website-pro-unset-padding website-pro-position-relative">
                <attribute-setting :module="resultModule"/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import WsMenuChildSetting from "./WsMenuChildSetting";
    import AttributeSetting from "../../../attribute/AttributeSetting";

    export default {
        name: "WsMenuChildrenManage",
        components: {AttributeSetting, WsMenuChildSetting},
        props: {
            module: Object
        },
        data() {
            return {
                settingModule: {},
                childSettingModule: {},
                showSetting: false,
            }
        },
        computed:{
            isChild(){
                return this.childSettingModule.id;
            },
            resultModule(){
                return this.isChild ? this.childSettingModule : this.settingModule;
            },
        },
        methods: {
            newItem(index) {
                this.module.addModule(index);
            },
            deleteItem(index) {
                this.module.deleteModule(index);
            },
            settingItem(item) {
                this.settingModule = item;
                this.childSettingModule = {};
                this.showSetting = true;
            },
            nativeSettingItem(item) {
                if(this.childSettingModule.id){
                    this.settingModule = item;
                    this.childSettingModule = {};
                }
            },
            settingChild({item, child}) {
                this.settingModule = item;
                this.childSettingModule = child;
                this.showSetting = true;
            },
            close(){
                this.settingModule = {};
                this.childSettingModule = {};
                this.showSetting = false;
            }
        },
    }
</script>
