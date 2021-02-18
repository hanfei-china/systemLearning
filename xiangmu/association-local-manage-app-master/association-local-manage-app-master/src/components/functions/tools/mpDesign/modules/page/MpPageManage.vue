<template>
    <el-container class="absolute-fill-parent" style="">
        <el-header style="padding: 7px 10px;" height="auto">
            <div>
                <el-button style="width: 100%;" type="primary" @click="addPage" size="medium" plain>+添加页面</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <vue-scroll>
                <div style="padding: 7px 10px;">
                    <div class="page-item" v-for="(page,index) in pages" :key="page.pageId"
                         :class="{'is-active': index == activePageIndex}" @click.stop="changePage(index)">
                        <div class="page-title">
                            {{!page.attributes.title.value || page.attributes.title.value.trim() ==
                            '' ? `页面${index+1}` : page.attributes.title.value}}
                        </div>
                        <div class="page-handler">
                            <div class="page-handler-icon iconfont icon-up" title="上移" @click="upPage(index)"
                                 v-show="isShowUp(index)"></div>
                            <div class="page-handler-icon iconfont icon-down" title="下移" @click="downPage(index)"
                                 v-show="isShowDown(index)"></div>
                            <div class="page-handler-icon page-handler-text" @click="designPage(index)" title="设计页面">
                                设计页面
                            </div>
                            <div class="el-icon-setting page-handler-icon" @click="settingPage(page)"></div>
                            <div class="el-icon-delete page-handler-icon" @click="deletePage(index)"></div>
                        </div>
                    </div>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "MpPageManage",
        inject: ['mpUserConfig'],
        props: {
            activePageIndex: Number
        },
        methods: {
            addPage() {
                this.mpUserConfig.addPage();
            },
            upPage(index) {
                this.mpUserConfig.movePage(index, index - 1, -1);
            },
            downPage(index) {
                this.mpUserConfig.movePage(index, index + 1, 1);
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
            changePage(index) {
                this.$emit('page-change', index);
            },
            deletePage(index) {
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    try {
                        this.mpUserConfig.deletePage(index);
                        this.$emit('close-setting');
                    } catch (e) {
                        this.$message.success(e.message);
                    }
                }).catch(()=>{});
            },
            settingPage(page) {
                this.$emit('page-setting', page);
            },
            designPage(index) {
                this.$emit('page-design', index);
            },
        },
        computed: {
            pages() {
                return this.mpUserConfig.pages;
            }
        },
    }
</script>
