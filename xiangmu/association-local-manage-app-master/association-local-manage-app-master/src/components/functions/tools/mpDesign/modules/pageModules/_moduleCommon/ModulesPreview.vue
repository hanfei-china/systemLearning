<template>
    <div class="modules-preview-container" :class="{'un-design' : !isDesign}">
        <draggable v-if="isDesign" class="module-drop-div" v-model="pageConfig.modules" @change="log"  group="newPageModule">
            <module-cover v-for="(module, index) of pageConfig.modules" :key="index">
                <component style="margin-bottom: 7px;" :is="module.name"
                           :module="module"/>
                <template v-slot:cover>
                    <div class="absolute-fill-parent" style="background-color: rgba(0,0,0,0.3)">
                        <div class="handler-btn-container">
                            <el-button-group class="cover-button-group position-relative" style="padding-top: 5px;">
                                <el-button type="primary" icon="el-icon-setting" circle @click="settingModule(module)"
                                           size="mini"/>
                                <el-button type="primary" icon="el-icon-rank" circle size="mini"/>
                                <el-button type="primary" icon="el-icon-delete" circle @click="deleteModule(index)"
                                           size="mini"/>
                            </el-button-group>
                        </div>
                    </div>
                </template>
            </module-cover>
        </draggable>
        <div class="module-drop-div" v-else>
            <component  v-for="(module, index) of pageConfig.modules" :key="index" style="margin-bottom: 7px;" :is="module.name"
                       :module="module"/>
        </div>
    </div>
</template>

<script>
    import ModuleCover from './ModuleCover';

    import alumniClubs from '../alumniClubs/alumniClubs';
    import alumniClubsActivities from '../alumniClubsActivities/alumniClubsActivities';
    import alumniClubsTrends from '../alumniClubsTrends/alumniClubsTrends';

    import entryGroup from '../entryGroup/entryGroup';

    import homeBanner from '../homeBanner/homeBanner';

    import homeBtnContainer from '../homeBtnContainer/homeBtnContainer';
    import homeBtnArea from '../homeBtnArea/homeBtnArea';

    import homeImageRankList from '../homeImageRankList/homeImageRankList';
    import homeImageScrollList from '../homeImageScrollList/homeImageScrollList';
    import homeImageTextList from '../homeImageTextList/homeImageTextList';

    import homeRowImageBtn from '../homeRowImageBtn/homeRowImageBtn';

    import homeSimpleTextBanner from '../homeSimpleTextBanner/homeSimpleTextBanner';

    import logout from '../logout/logout';

    import my from '../my/my';

    import onlineDonationList from '../onlineDonationList/onlineDonationList';
    import topLogoArea from '../topLogoArea/topLogoArea';
    import publicArticleList from '../publicArticleList/PublicArticleList';

    import Album from '../album/Album';
    import countDown from '../countDown/countDown';

    import draggable from 'vuedraggable';

    export default {
        name: "ModulesPreview",
        components: {
            ModuleCover, draggable,
            alumniClubs, alumniClubsActivities, alumniClubsTrends,
            entryGroup,
            homeBanner,
            homeBtnContainer,
            homeBtnArea,
            homeImageRankList, homeImageScrollList, homeImageTextList,
            homeRowImageBtn,
            homeSimpleTextBanner,
            logout,
            my,
            onlineDonationList,
            topLogoArea,
            publicArticleList,
            Album,
            countDown
        },
        props: {
            pageConfig: {
                type: Object,
                default() {
                    return null;
                }
            },
            isDesign: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            modules() {
                return this.pageConfig.modules;
            }
        },
        methods: {
            settingModule(module) {
                this.$emit('module-setting', module);
            },
            deleteModule(index) {
                this.pageConfig.deleteModule(index);
                this.$emit('close-setting');
            },
            log(evt) {
                let added = evt.added;
                if(added){
                    let {element} = added;
                    this.$emit('module-setting', element);
                }
            }
        }
    }
</script>

<style lang="less">
    .modules-preview-container {
        min-height: 650px;

        .module-drop-div {
            min-height: 650px;
        }

        &.un-design{
            min-height: 600px;

            .module-drop-div {
                min-height: 600px;
            }
        }

    }

    .is-has-title .modules-preview-container {
        min-height: 600px;

        .module-drop-div {
            min-height: 600px;
        }

        &.un-design{
            min-height: 550px;

            .module-drop-div {
                min-height: 550px;
            }
        }


    }

    .handler-btn-container {
        display: flex;
        justify-content: flex-end;


        .handler-btn:nth-last-child(1) {
            margin-bottom: 0;
        }

        .handler-btn:hover {
            background: #35363c;
        }

        .handler-btn {
            display: inline-block;
        }

        .el-button-group .el-button.is-circle:first-child:last-child {
            border-radius: 50%;
            border-color: #409EFF;
        }

        .cover-button-group .el-button {
            padding: 8px;
            font-size: 14px;
        }
    }

</style>
