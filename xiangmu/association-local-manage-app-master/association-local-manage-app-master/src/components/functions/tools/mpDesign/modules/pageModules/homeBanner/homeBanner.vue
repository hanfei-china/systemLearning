<template>
    <div class="image-container" style="background-color: #FFFFFF;" :style="{height: height}">
        <el-carousel :height=height arrow="never">
            <el-carousel-item v-for="item in contentList" :key="item.id">
                <div class="image-wrapper" :style="getBackgroundImage(item.poster)"></div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>

    export default {
        name: "homeBanner",
        data() {
            return {
                contentList: [{
                    id: -1,
                    defaultImg: this.defaultImg
                }],
            }
        },
        props: {
            module: Object
        },
        computed: {
            attributes() {
                return this.module.attributes;
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
            },
            height(){
                return this.attributes.height.value + 'px';
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
            },
            getBackgroundImage(poster) {
                return {backgroundImage: 'url(' + (poster ? poster : this.defaultImg) + ')'};
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
    .image-container {
        /*height: 216px;*/
        /*padding: 10px;*/
        position: relative;
        overflow: hidden;
    }

    .image-wrapper {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        /*border-radius: 8px;*/
        overflow: hidden;
    }

</style>
<style>
    .image-container .el-carousel {
        /*border-radius: 8px;*/
    }

    .image-container .el-carousel__button {
        width: 8px;
        height: 8px;
        margin: 0;
        padding: 0;
        border-radius: 4px;
    }

    .image-container .el-carousel__indicator.is-active .el-carousel__button {
        background-color: #fe556f;
    }
</style>
