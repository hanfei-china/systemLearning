<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor"  :icon="titleIcon" :icon-position="titleIconPosition"/>
        <el-carousel height="22px" arrow="never" direction="vertical" indicator-position="none">
            <el-carousel-item v-for="item in contentList" :key="item.id">
                <div class="title-wrapper">{{item.title}}</div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import FunctionTitle from '../../../common/FunctionTitle';

    export default {
        name: "homeSimpleTextBanner",
        components: {FunctionTitle},
        props: {
            module: Object
        },
        data() {
            return {
                contentList: [{
                    contentId: -1,
                    title: '暂无数据...'
                }],

            }
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            title() {
                return this.attributes.title.value;
            },
            titleColor() {
                return this.attributes.titleColor.value;
            },
            titleIcon() {
                return this.attributes.titleIcon.value;
            },
            titleIconPosition() {
                return this.attributes.titleIconPosition.value;
            },
            contentClass() {
                return this.attributes.contentClass.value;
            },
            queryMode() {
                return this.attributes.queryMode.value;
            },
            dataMaxCount() {
                return this.attributes.dataMaxCount.value;
            },
            branchId(){
                return this.$store.state.branchId;
            }
        },
        methods: {
            getContentList() {
                if (this.contentClass) {
                    this.$request.get('/api/common/content/anon/list',{
                        params: {
                            branchId: this.branchId,
                            classId: this.contentClass,
                            limit: this.dataMaxCount,
                            filterUnPublish: true,
                            topModel: this.queryMode === 1,
                            offset: 0
                        }
                    }).then(res=>{
                        let {data} = res;
                        if (data.list.length > 0) {
                            this.contentList = data.list;
                        } else {
                            this.contentList = [{
                                contentId: -1,
                                title: '暂无数据...'
                            }];
                        }
                    })
                } else {
                    this.contentList = [{
                        contentId: -1,
                        title: '暂无数据...'
                    }];
                }
            }
        },
        mounted() {
            this.getContentList();
        },
        watch: {
            contentClass: function () {
                this.getContentList();
            },
            queryMode: function () {
                this.getContentList();
            },
            dataMaxCount: function () {
                this.getContentList();
            }
        }
    }
</script>

<style scoped>
    .module-container {
        padding: 8px 16px;
        position: relative;
    }

    .title-wrapper {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

</style>
