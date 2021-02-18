<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" :icon-position="titleIconPosition" has-more></function-title>
        <div style="height:152px;overflow:hidden;width: 343px;">
            <vue-scroll>
                <div class="image-container" :style="containerStyle">
                    <div class="image-wrapper" v-for="item in contentList" :key="item.id"
                         :style="getBackgroundImage(item.poster)"></div>
                </div>
            </vue-scroll>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from '../../../common/FunctionTitle';

    export default {
        name: "homeImageScrollList",
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
            containerStyle() {
                return {
                    width: (this.contentList.length * (167 + 9) - 9) + 'px'
                }
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
        height: 152px;
        position: relative;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .image-wrapper {
        width: 167px;
        height: 152px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 8px;
        overflow: hidden;
        display: inline-block;
    }

    .image-wrapper:not(:last-child) {
        margin-right: 9px;
    }

</style>
