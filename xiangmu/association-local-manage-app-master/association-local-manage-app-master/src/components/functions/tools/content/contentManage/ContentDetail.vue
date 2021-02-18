<template>
    <div class="absolute-fill-parent">
        <vue-scroll>
            <div class="device-pc">
                <div class="content-title" style="padding-top: 32px;" v-show="!onlyShowContent">{{title}}</div>
                <div class="content-labels-time" v-show="!onlyShowContent">{{publishTime | yyyyMMddHHmmss}}</div>
                <div v-html="content"></div>
                <div v-show="attachments.length>0" style="margin-top: 10px;">
                    <div>附件下载</div>
                    <a style="display: block;" class="lrd-a underline" v-for="(attachment,index) of attachments" :key="attachment.uid"
                       :href="`${attachment.url}?attname=${encodeURI(attachment.name)}&&time=${new Date().getTime()}`">{{(index+1) + '. '+ attachment.name}}</a>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "ContentDetail",
        props:{
            contentId: String,
            onlyShowContent: Boolean
        },
        computed:{
            id(){
                return this.contentId || this.$route.params.contentId;
            }
        },
        data() {
            return {
                content: '',
                attachments: [],
                publishTime: '',
                title: '',
                loading: false
            }
        },
        created() {
            if (this.id) {
                this.loading = true;
                this.$request.get('/api/common/content/anon/detail', {
                    params: {id: this.id}
                }).then(res => {
                    let {data} = res;
                    this.content = data.content;
                    this.attachments = data.attachments ? JSON.parse(data.attachments) : [];
                    this.publishTime = data.publishTime;
                    this.title = data.title;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            }
        }
    }
</script>

<style scoped>
    .device-pc {
        width: 800px;
        margin: 0 auto;
        max-width: 800px;
        padding-bottom: 16px;
    }

    .content-title {
        font-size: 22px;
        line-height: 1.4;
        margin-bottom: 14px;
    }

    .content-labels-time {
        margin-bottom: 22px;
        color: rgba(0, 0, 0, .3);
        font-size: 15px;
        height: 22px;
        line-height: 22px;
    }
</style>
