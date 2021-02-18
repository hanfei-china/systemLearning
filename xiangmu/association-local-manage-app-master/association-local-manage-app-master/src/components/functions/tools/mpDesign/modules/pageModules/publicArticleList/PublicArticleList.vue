<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title style="padding: 8px 16px;" :title="title" :color="titleColor" :icon="titleIcon" :icon-position="titleIconPosition"
                        has-more></function-title>
        <div class="image-container">
            <div class="public-article-item" v-for="item of itemList" :key="item.mediaId">
                <div class="box-shadow public-article-item-container">
                    <temp-var :articles="item.content.articles">
                        <template v-slot="{articles}">
                            <template v-for="(article,index) of articles">
                                <div v-if="index === 0" :key="index" class="public-first-article website-module-background-image-style"
                                     :style="{backgroundImage: `url(${article.thumbUrl})`}">
                                    <div class="public-first-article-title text-overflow">
                                        {{article.title}}
                                    </div>
                                </div>
                                <div :key="index" v-else class="public-other-article flex">
                                    <div class="public-other-article-title flex-fill-in-the-remaining-space text-overflow">
                                        {{article.title}}
                                    </div>
                                    <div class="public-other-article-image website-module-background-image-style"
                                         :style="{backgroundImage: `url(${article.thumbUrl})`}"></div>
                                </div>
                            </template>
                        </template>
                    </temp-var>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from '../../../common/FunctionTitle';
    import TempVar from "../../../../../../util/TempVar";

    export default {
        name: "PublicArticleList",
        components: {TempVar, FunctionTitle},
        props: {
            module: Object,
        },
        data() {
            return {
                itemList: [{
                    "mediaId": "fEf2cUBmX5J2lJe-3VKZVJsI8BDuvHJTE_xgPl8AkhE",
                    "updateTime": 1570606496000,
                    "content": {
                        "createTime": 1562214782000,
                        "updateTime": 1570606496000,
                        "articles": [{
                            "thumbUrl": "https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/e742d2290f154e3bb615b4714886c101.jpg",
                            "title": "联系我们",
                            "digest": "您好，感谢您关注久其软件校友苑公众号，在这里您可以看到最新的校友会基金会资讯动态。",
                        }, {
                            "thumbUrl": "https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/071efa68c338436a926630f9d2c506ed.jpg",
                            "title": "为校友工作插上“互联网+”的翅膀",
                            "digest": "2019年5月26日，久其软件中标重庆师范大学校友会综合信息管理系统项目。",
                        }, {
                            "thumbUrl": "https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/e742d2290f154e3bb615b4714886c101.jpg",
                            "title": "久其软件简介—风雨同舟22年",
                            "digest": "久其软件是专业的管理软件供应商和聚焦B2B2C的大数据综合服务提供商。",
                        }],
                        "empty": false
                    }
                }, {
                    "mediaId": "fEf2cUBmX5J2lJe-3VKZVBQFSJA87HJOOp_OucnN70c",
                    "updateTime": 1562214267000,
                    "content": {
                        "createTime": 1562214241000,
                        "updateTime": 1562214267000,
                        "articles": [{
                            "thumbUrl": "https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/071efa68c338436a926630f9d2c506ed.jpg",
                            "title": "久其软件简介—风雨同舟22年",
                            "digest": "久其软件是专业的管理软件供应商和聚焦B2B2C的大数据综合服务提供商。",
                        }],
                        "empty": false
                    }
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
            dataMaxCount() {
                return this.attributes.dataMaxCount.value;
            },
        },
    }
</script>

<style scoped>
    .module-container {
        position: relative;
    }

    .image-container {
        position: relative;
    }

    .public-article-item{
        padding: 16px;
    }

    .public-article-item:not(:last-child){
        padding-bottom: 0;
    }

    .public-article-item:first-child{
        padding-top: 6px;
    }

    .public-article-item-container{
        border-radius: 4px;
        overflow: hidden;
    }

    .public-first-article{
        height: 150px;
        position: relative;
    }

    .public-first-article-title{
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        height: 40px;
        line-height: 40px;
        background-color: rgba(0,0,0,0.3);
        padding: 0 16px;
        color: #ffffff;
    }

    .public-other-article{
        padding: 16px;
    }

    .public-other-article:not(:last-child){
        border-bottom: 1px solid #eaeaea;
    }

    .public-other-article-title{
        height: 45px;
        line-height: 45px;
    }

    .public-other-article-image{
        height: 45px;
        flex:  0 0 45px;
        margin-left: 16px;
    }
</style>
