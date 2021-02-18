<template>
    <el-container style="width: 375px;background-color: #F1F1F1;height: 650px;margin: 0 auto;">
        <el-main class="unset-padding position-relative">
            <page-preview v-show="page" :page-config="page" style="height: 600px;" :is-design="false"/>
            <local-page-preview v-show="image" :image="image" :attributes="tab.attributes"/>
        </el-main>
        <el-footer class="unset-padding tab-bar-wrapper" height="50px" v-if="tabBar && tabBar.list.length > 0">
            <tab-bar-preview :tab-bar="tabBar" :active-tab-index="activeTabIndex" @tab-change="tabChange" />
        </el-footer>
    </el-container>
</template>

<script>
    import PagePreview from '../page/PagePreview';

    import TabBarPreview from './TabBarPreview';

    import {getMPLocalImage} from "../../../../../../js/config/mpLocalImages";
    import LocalPagePreview from "./LocalPagePreview";

    export default {
        name: "TabPreview",
        components:{
            LocalPagePreview,
            PagePreview,
            TabBarPreview,
        },
        inject: ['mpUserConfig'],
        props:{
            activeTabIndex:{
                type: Number,
                default(){
                    return 0;
                }
            },
        },
        computed:{
            tabBar(){
                return this.mpUserConfig.getTabBar();
            },
            tab(){
                return this.tabBar.getTab(this.activeTabIndex);
            },
            page(){
                if(this.tab != null){
                    let {pageType, pagePath} =  this.tab.attributes;
                    if(!pageType || pageType.value === 'design' ){
                        return this.mpUserConfig.getPageByPageId(pagePath.value);
                    }
                }
                return null;
            },
            image(){
                if(this.tab != null){
                    let {pageType, localPagePath} =  this.tab.attributes;
                    if(pageType.value === 'local'){
                        return getMPLocalImage(localPagePath.value);
                    }
                }
                return null;
            },
        },
        methods:{
            tabChange(index){
                this.$emit('tab-change',index);
            }
        }
    }
</script>

<style scoped>

    .tab-bar-wrapper{
        border-top: 1px solid #eee;
    }
</style>
