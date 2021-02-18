<template>
    <div class="absolute-fill-parent" style="background-color: #FFFFFF;">
        <vue-scroll>
            <div>
                <div class="module-group-title">
                    <span>通用模块</span>
                </div>
                <div class="module-group">
                    <draggable :list="generalModules" :clone="clone" :sort="false" :group="{ name: 'newPageModule', pull: 'clone', put: false }">
                        <module-label v-for="module in generalModules" :key="module.name"
                                      :icon="module.icon" :title="module.title" :name="module.name"></module-label>
                    </draggable>
                </div>
            </div>
            <div>
                <div class="module-group-title">
                    <span>定制化模块</span>
                    <el-tooltip content="定制化模块是指绑定了特定业务场景的模块，其个性化能力较差" placement="right" effect="dark">
                        <label class="el-icon-question"
                               style="font-size: 18px;cursor: pointer;;display: inline-block;position: relative;top: 1px;"></label>
                    </el-tooltip>
                </div>
                <div class="module-group">
                    <draggable :list="customizedModules" :clone="clone" :sort="false" :group="{ name: 'newPageModule', pull: 'clone', put: false }">
                        <module-label v-for="module in customizedModules" :key="module.name"
                                      :icon="module.icon" :title="module.title" :name="module.name"/>
                    </draggable>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    import ModuleLabel from './ModuleLabel';
    import draggable from 'vuedraggable';
    import moduleBuilder from '../../../../../../../js/miniProgram/moduleBuilder';

    export default {
        name: "ModuleChoose",
        components: {ModuleLabel,draggable},
        data() {
            return {
                generalModules: [
                    {name: 'topLogoArea', title: 'LOGO容器', icon: 'icon-module-logo-area'},
                    {name: 'homeBanner', title: '轮播图', icon: 'icon-module-home-banner'},
                    {name: 'homeRowImageBtn', title: '图片按钮', icon: 'icon-module-row-image-btn'},
                    {name: 'homeSimpleTextBanner', title: '文字轮播', icon: 'icon-module-text-banner'},
                    {name: 'homeImageScrollList', title: '图片列表-滚动', icon: 'icon-module-image-scroll-list'},
                    {name: 'homeImageRankList', title: '图片列表-排列', icon: 'icon-module-image-rank-list'},
                    {name: 'homeImageTextList', title: '图文列表', icon: 'icon-module-image-text-list'},
                    {name: 'homeBtnContainer', title: '按钮阵列', icon: 'icon-module-btn-container'},
                    {name: 'entryGroup', title: '按钮列表', icon: 'icon-module-entry-list'},
                    {name: 'onlineDonationList', title: '捐赠项目列表', icon: 'icon-module-online-donation-list'},
                    {name: 'album', title: '相册', icon: 'icon-module-album'},
                    {name: 'homeBtnArea', title: '块状按钮', icon: 'icon-module-btn-area'},
                    {name: 'countDown', title: '倒计时', icon: 'icon-module-count-down'},
                ],
                customizedModules: [
                    {name: 'alumniClubs', title: '社群', icon: 'icon-module-aluminum-clubs'},
                    {name: 'alumniClubsActivities', title: '社群活动', icon: 'icon-module-activities'},
                    {name: 'alumniClubsTrends', title: '社群动态', icon: 'icon-module-aluminum-clubs-trend'},
                    {name: 'my', title: '我的', icon: 'icon-module-my'},
                    {name: 'logout', title: '退出登录', icon: 'icon-module-logout'},
                ]
            }
        },
        methods:{
            clone({name}){
                return moduleBuilder(name);
            }
        }
    }
</script>
