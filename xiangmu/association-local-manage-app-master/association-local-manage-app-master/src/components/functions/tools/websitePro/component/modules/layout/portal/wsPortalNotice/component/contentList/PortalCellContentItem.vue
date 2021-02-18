<template>
    <div class="website-pro-flex portal-cell-content-item">
        <div class="portal-cell-content-item-spot-container website-pro-flex column center">
            <i class="portal-cell-content-item-spot"/>
        </div>
        <a v-if="content.contentType === 0 || content.contentType === 6 || content.contentType === 7"  @click.stop="contentDetail(content.id)"
           class="portal-cell-content-item-title flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{ content.title }}</a>
        <a v-else-if="content.contentType === 1 || content.contentType === 3" :href="content.linkAddress" target="_blank"
           class="portal-cell-content-item-title flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{ content.title }}</a>
        <a v-else-if="content.contentType === 2" @click.stop="contentDetail(content.otherId)"
           class="portal-cell-content-item-title flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{ content.title }}</a>
        <a v-else-if="content.contentType === 5" class="portal-cell-content-item-title flex-fill-in-the-remaining-space cursor-pointer lrd-a underline"
           :href="download+content.id">{{ content.title }}</a>
        <a v-else-if="content.contentType === 4" class="portal-cell-content-item-title flex-fill-in-the-remaining-space cursor-pointer lrd-a underline"
           @click.stop="videoDisplayVisible=true">{{ content.title }}</a>
        <div class="portal-cell-content-item-time website-pro-flex column center" >{{content.publishTime | yyyyMMddHHmm}}</div>
        <el-dialog :visible.sync="videoDisplayVisible" title="视频播放" append-to-body width="600px">
            <video-display v-if="videoDisplayVisible" :content="content" videoWidth="560px" videoHeight="300px"/>
        </el-dialog>
        <el-dialog :visible.sync="contentVisible" top="40px" append-to-body width="840px">
            <template v-slot:title>
                <div>
                    <div style="font-size: 16px;">{{content.title}}</div>
                    <div class="portal-cell-content-item-time" >{{content.publishTime | yyyyMMddHHmm}}</div>
                </div>
            </template>
            <div style="height: 600px;position: relative;">
                <content-detail :content-id="contentId" only-show-content/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../../../../../js/config/serviceConfig";
    import VideoDisplay from "../../../../../../../../content/contentManage/util/VideoDisplay";
    import ContentDetail from "../../../../../../../../content/contentManage/ContentDetail";

    export default {
        name: "PortalCellContentItem",
        components: {ContentDetail, VideoDisplay},
        props:{
            content: Object
        },
        data(){
            return {
                download: requestBaseUrl + '/api/common/content/anon/download/',
                videoDisplayVisible: false,
                contentVisible: false,
                contentId: this.content.id
            }
        },
        methods:{
            contentDetail(id){
                this.contentId = id;
                this.contentVisible= true;
            }
        }
    }
</script>
<style lang="less" scoped>
    .portal-cell-content-item{

        &:not(:last-child){
            margin-bottom: 8px;
        }

        &-spot{
            width: 4px;
            height: 4px;
            background: #d1d5d9;
            border-radius: 50%;

            &-container{
                text-align: center;
                padding-right: 4px;
            }
        }

        &-title{
            color: #5E6C82;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &-time{
            color: #808A95;
            font-size: 12px;
            padding-left: 4px;
        }
    }
</style>
