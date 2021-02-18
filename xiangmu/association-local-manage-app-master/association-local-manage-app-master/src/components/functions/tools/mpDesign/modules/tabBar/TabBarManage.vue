<template>
    <el-container class="absolute-fill-parent" style="">
        <el-header style="padding: 7px 10px;" height="auto">
            <div style="display: flex;">
                <el-button type="primary" icon="el-icon-setting" size="medium" @click="settingTabBar" plain>菜单设置
                </el-button>
                <el-button class="flex-fill-in-the-remaining-space" type="primary" size="medium" @click="addTab" plain>
                    +添加菜单项
                </el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <vue-scroll>
                <div style="padding: 7px 10px;">
                    <div class="page-item" v-for="(tab,index) in tabBar.list" :key="index"
                         :class="{'is-active': index === activeTabIndex}" @click="changeTab(index)">
                        <div class="page-title">{{tab.attributes.text.value}}</div>
                        <div class="page-handler">
                            <div class="page-handler-icon iconfont icon-up" title="上移" @click="upTab(index)"
                                 v-show="isShowUp(index)"></div>
                            <div class="page-handler-icon iconfont icon-down" title="下移" @click="downTab(index)"
                                 v-show="isShowDown(index)"></div>
                            <div class="el-icon-setting page-handler-icon" @click="settingTab(tab)" title="设置"></div>
                            <div class="el-icon-delete page-handler-icon" @click="deleteTab(index)" title="删除"></div>
                        </div>
                    </div>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>
<script>

    export default {
        name: "TabBarManage",
        inject: ['mpUserConfig'],
        props: {
            activeTabIndex: {
                type: Number,
                default() {
                    return 0;
                }
            },
            beingSetUp: {
                type: Boolean,
                default() {
                    return true;
                }
            },
        },
        computed: {
            tabBar() {
                return this.mpUserConfig.getTabBar();
            },
            tabCount() {
                return this.tabBar.list.length;
            }
        },
        data() {
            return {}
        },
        methods: {
            addTab() {
                try {
                    this.tabBar.addTab();
                } catch (e) {
                    this.$message.warning(e.message);
                }

            },
            changeTab(index) {
                this.$emit('tab-change', index);
            },
            deleteTab(index) {
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    try {
                        this.tabBar.deleteTab(index);
                    } catch (e) {
                        this.$message.warning(e.message);
                    }
                }).catch(()=>{});
            },
            upTab(index) {
                this.tabBar.moveTab(index, index - 1, -1);
            },
            downTab(index) {
                this.tabBar.moveTab(index, index + 1, 1);
            },
            isShowUp(index) {
                if (this.tabCount <= 1) {
                    return false;
                }

                if (index === 0) {
                    return false;
                }

                return true;
            },
            isShowDown(index) {
                if (this.tabCount <= 1) {
                    return false;
                }

                if (index === this.tabCount - 1) {
                    return false;
                }

                return true;
            },
            settingTab(tab) {
                this.$emit('tab-setting', tab);
            },
            settingTabBar() {
                this.$emit('tab-bar-setting', this.tabBar);
            },
            setHeight() {

            }
        },
        mounted() {

        },
    }
</script>
