<template>
    <video ref="myVideo" class="video-js vjs-big-play-centered">
        <source :src="content.linkAddress" type="video/mp4" />
    </video>
</template>

<script>
    export default {
        name: "VideoDisplay",
        props: ['content','videoWidth','videoHeight'],
        data() {
            return {
                player: null
            }
        },
        mounted(){
            this.initVideo();
        },
        beforeDestroy() {
            if (this.player) {
                this.player.dispose();
            }
        },
        watch: {
            content(){
                if (this.player) {
                    this.player.dispose();
                    this.player = null;
                }
                this.initVideo();
            }
        },
        methods: {
            initVideo() {
                //初始化视频方法
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
            },
        }
    }
</script>

<style scoped>

</style>