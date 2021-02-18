<template>
    <div :class="dragClass">
        <!--            图文-->
        <div v-show="content.contentType === 0 || content.contentType === 6 || content.contentType === 7">
            <div v-html="content.content"  :class="dragClass"></div>
            <div v-show="content.attachments&& JSON.parse(content.attachments).length>0" style="margin-top: 10px;">
                <div>附件下载</div>
                <a style="display: block;" class="lrd-a underline" v-for="(attachment,index) of JSON.parse(content.attachments)" :key="attachment.uid" :href="`${attachment.url}?attname=${encodeURI(attachment.name)}&&time=${new Date().getTime()}`">{{(index+1) + '. '+ attachment.name}}</a>
            </div>
        </div>
        <!--            外部链接-->
        <div v-show="content.contentType === 1"  :class="dragClass" class="website-pro-rich-text-other-link" @click="openOuterLink">
            {{content.linkAddress}}
        </div>
        <!--            活动-->
        <div v-show="content.contentType === 3"  :class="dragClass" class="website-pro-rich-text-other-link" @click="openActivity">
            {{`${hostName}events/${content.otherId}`}}
        </div>
        <!--            视频-->
        <div v-show="content.contentType === 4"  :class="dragClass">
            <video ref="myVideo" class="video-js vjs-big-play-centered"  :class="dragClass">
                <source :src="content.linkAddress" type="video/mp4"  :class="dragClass"/>
            </video>
        </div>
        <!--            附件-->
        <div class="content-rich-content" :class="dragClass" v-show="content.contentType === 5">
            <a class="lrd-content-download-file" :href="itemHref"  :class="dragClass">
                <i class="icon content_iconfont content-icon-test"  :class="dragClass"></i>
                <span  :class="dragClass">{{content.otherId}}</span>
            </a>
        </div>
    </div>
</template>

<script>
    import {hostName} from "../../../../../../../../js/config/serviceConfig";
    import {contentClick} from "../../../../js/util/util";

    export default {
        name: "RichTextDetail",
        props: ['content', 'module','otherHeight','design'],
        data() {
            return {
                player: null,
                hostName
            }
        },
        computed:{
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            videoWidth(){
                return this.module.attributes.layoutGroup.attributes.layout.value.width;
            },
            videoHeight(){
                return this.module.attributes.layoutGroup.attributes.layout.value.height - this.otherHeight;
            },
            itemHref(){
                return contentClick(this.$router, this.content, this.design);
            },
        },
        methods: {
            initVideo() {
                //初始化视频方法

                if(!this.player){
                    this.player = this.$video(this.$refs.myVideo, {
                        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                        controls: true,
                        //自动播放属性,muted:静音播放
                        autoplay: "muted",
                        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                        preload: "auto",
                        //设置视频播放器的显示宽度（以像素为单位）
                        width: this.videoWidth,
                        //设置视频播放器的显示高度（以像素为单位）
                        height: this.videoHeight
                    });
                }

                this.player.off('timeupdate');
                this.player.reset();
                this.player.src({src: this.content.linkAddress, type: "video/mp4"});
                this.player.play();
            },
            display() {
                if (this.content) {
                    let type = this.content.contentType;
                    if (type === 4) {
                        this.initVideo();
                    }
                    if (type === 2) {
                        this.$emit('change-content-id',this.content.otherId);
                    }
                }

            },
            openOuterLink(){
                this.$msgbox.confirm('即将打开一个外部链接，本站不保证该链接的安全性，请确认是否继续前往！！！','提示',{type: 'warning',confirmButtonText:'继续前往'}).then(()=>{
                    window.open(this.content.linkAddress,'_blank');
                }).catch(()=>{});
            },
            openActivity(){
                this.$msgbox.confirm('即将打开一个外部链接，本站不保证该链接的安全性，请确认是否继续前往！！！','提示',{type: 'warning',confirmButtonText:'继续前往'}).then(()=>{
                    window.open(`${hostName}events/${this.content.otherId}`,'_blank');
                }).catch(()=>{});
            }
        },
        beforeDestroy() {
            if (this.player) {
                this.player.dispose();
            }
        },
        mounted() {
            this.display();
        },
        watch: {
            content() {
                this.display();
            },
            videoWidth(val){
                if(val){
                    this.player && this.player.width(val);
                }
            },
            videoHeight(val){
                if(val){
                    this.player && this.player.height(val);
                }
            }
        },
    }
</script>

