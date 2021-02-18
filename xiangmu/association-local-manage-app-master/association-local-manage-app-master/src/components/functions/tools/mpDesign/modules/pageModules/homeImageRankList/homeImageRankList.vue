<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" :icon-position="titleIconPosition" has-more />
        <div class="image-container">
            <div class="image-wrapper-container" v-for="item in contentList" :key="item.id">
                <div class="image-wrapper" :style="getBackgroundImage(item.poster)"></div>
                <div class="content-title">{{item.title}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from '../../../common/FunctionTitle';

    export default {
        name: "homeImageRankList",
        components: {FunctionTitle},
        props: {
            module: Object,
        },
        data() {
            return {
                contentList: [{
                    contentId: -1,
                    defaultImg: this.defaultImg
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
            defaultImg() {
                return this.attributes.defaultImg.value;
            },
            branchId(){
                return this.$store.state.branchId;
            }
        },
        methods: {
            getBackgroundImage(poster) {
                return {backgroundImage: 'url(' + (poster ? poster : this.defaultImg) + ')'};
            },
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
                                id: -1,
                                defaultImg: this.defaultImg
                            }];
                        }
                    })
                } else {
                    this.contentList = [{
                        contentId: -1,
                        defaultImg: this.defaultImg
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

    .image-container {
        position: relative;
    }

    .image-wrapper {
        width: 165px;
        height: 152px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 8px;
        overflow: hidden;
    }

    .content-title {
        margin-top: 10px;
        width: 165px;
        font-size: 12px;
        line-height: 18px;
        height: 36px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .image-wrapper-container:nth-child(odd) {
        margin-right: 9px;
    }

    .image-wrapper-container {
        margin-bottom: 9px;
        display: inline-block;
    }
</style>
