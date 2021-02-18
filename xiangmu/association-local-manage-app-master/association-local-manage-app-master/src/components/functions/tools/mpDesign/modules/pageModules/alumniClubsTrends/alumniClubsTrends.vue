<template>
    <div class="trends-container">
        <div class="func-title">{{attributes.title.value}}</div>
        <div class="trends">
            <alumni-clubs-trend v-for="trend in trends" :trend="trend" :key="trend.trendId"></alumni-clubs-trend>
        </div>
    </div>
</template>

<script>
    import alumniClubsTrend from './alumniClubsTrend';

    export default {
        name: "alumniClubsTrends",
        components: {
            alumniClubsTrend
        },
        props: {
            module: Object
        },
        data() {
            return {
                trends:  [{
                    trendId: "ECF4419FE64943BF946112BB5B4F2CF7",
                    content: "洪崖洞和火锅！\n重庆真棒！",
                    otherContent: "{\"type\":1,\"config\":[\"https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/e742d2290f154e3bb615b4714886c101.jpg\",\"https://xyh.huiyixing.com/group1/M00/00/03/CgIlOl2Bj7-ASGeaAABPSRh8WTg504.jpg\"]}",
                    address: null,
                    praiseNum: 1,
                    reviewNum: 0,
                    createTime: "2019-02-27",
                    avatar: "https://wxstore.blob.core.chinacloudapi.cn/0004e3f869864cef8cc6d3842d2954e0-sys-databaseupgrade/1.jpg",
                    nickname: "小水仙",
                    userId: "7b66b8f771f14483ae5f30aa763252ea",
                    isPraise: 0
                }, {
                    trendId: "BA5025B5EB4044F29444B86582D12BFA",
                    content: "秋",
                    otherContent: "{\"type\":1,\"config\":[\"https://xyh.huiyixing.com/group1/M00/00/03/CgIlOl2Bj7-ASGeaAABPSRh8WTg504.jpg\"]}",
                    address: null,
                    praiseNum: 0,
                    reviewNum: 0,
                    createTime: "2019-02-27",
                    avatar: "https://wxstore.blob.core.chinacloudapi.cn/0004e3f869864cef8cc6d3842d2954e0-sys-databaseupgrade/1.jpg",
                    nickname: "小水仙",
                    userId: "005c9b7702fb4b3d863df437e1954651",
                    isPraise: 0
                }]
            }
        },
        computed:{
            attributes() {
                return this.module.attributes;
            },
        },
    }
</script>

<style scoped>

    .func-title {
        background-color: #FFFFFF;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        padding: 16px 16px;
    }
</style>
