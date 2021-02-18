<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
            <draggable class="website-pro-position-relative" style="padding:16px;" tag="div"
                       handle=".ui-sortable-handle" :animation="300" v-model="module.modules">
                <ws-side-menu-child-setting v-for="(item,index) in module.modules" :key="item.id" :module="item"
                                             @new-item="newItem(index)" @delete-item="deleteItem(index)"
                                             @setting-item="settingItem(item)"/>
            </draggable>
        </vue-scroll>
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
    import WsSideMenuChildSetting from "./WsSideMenuChildSetting";

    export default {
        name: "WsSideMenuChildrenManage",
        components: {WsSideMenuChildSetting, AttributeSetting},
        props: {
            module: Object
        },
        data() {
            return {
                settingModule: {},
                showSetting: false,
            }
        },
        computed:{
            dataSrc(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc;
            },
        },
        methods: {
            setActiveName(activeName){
                this.activeName = activeName;
            },
            newItem(index) {
                this.module.addModule(index);
            },
            deleteItem(index) {
                this.module.deleteModule(index);
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
