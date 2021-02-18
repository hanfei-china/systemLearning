<template>
    <div>
        <div class="text-align-center" style="padding-bottom: 20px;">打开微信，点击底部“发现”，使用“扫一扫”即可将活动分享至朋友圈</div>
        <div class="flex flex-center">
            <div style="border: 1px solid #ebeef5;background-color: white;">
                <div v-loading="activityMpCodeLoading"
                     element-loading-text="拼命加载中"
                     element-loading-background="rgba(150, 150, 150, 0.1)" style="width: 180px;height: 210px;">
                    <canvas v-if="activityMpCode" ref="canvas" style="width: 180px;height: 210px;"></canvas>
                </div>
                <img @load="drawCanvas" ref="image" crossorigin="anonymous" :src="activityMpCode"
                     v-if="activityMpCode" style="width: 180px; height: 180px;display: none;"/>
                <div style="font-size: 14px;padding-top:0;height: 35px;text-align: center;"><a @click.stop="downloadCode" class="lrd-a">下载小程序分享二维码</a></div>
            </div>

            <!-- <div style="margin-left: 100px;border: 1px solid #ebeef5;background-color: white;">
                <div v-loading="activityShareCodeLoading"
                     element-loading-text="拼命加载中"
                     element-loading-background="rgba(150, 150, 150, 0.1)" style="width: 180px;height: 210px;background-color: white;position: relative;">
                    <div style="z-index: 1;position: absolute;width: 50px;height: 50px;background-color: white;top: 62px;left: 66px;border-radius: 50%;text-align: center;line-height: 45px;">
                        <img :src="logo" style="width: 40px;height: 40px;z-index: -1;">
                    </div>
                    <canvas v-if="activityShareCode" ref="shareCanvas" style="width: 180px;height: 180px;z-index: 2;"></canvas>
                    <div style="font-size: 10px;text-align: center;position: relative;top: -6px;">
                        <i class="iconfont icon-mp-design" style="color: rgb(24,175,22);font-size: 16px;"></i>
                        微信扫一扫，分享活动
                    </div>
                </div>
                <img @load="drawShareCanvas" ref="shareImage" crossorigin="anonymous" :src="activityShareCode"
                     v-if="activityMpCode" style="width: 180px; height: 180px;display: none;"/>
                <div style="font-size: 14px;padding-top:0;height: 35px;text-align: center;"><a @click.stop="downloadShareCode" class="lrd-a">下载H5分享二维码</a></div>
            </div> -->
        </div>
    </div>
</template>

<script>
    import {mobileH5} from "../../../../../js/config/serviceConfig";
    import {download} from "../../../../../js/util/download";
    import QRCode from 'qrcode';

    export default {
        name: "QrCode",
        props:{
            activityName: {
                type: String,
            },
            activityId: {
                type: String,
            },
            activityMpCode: {
                type: String,
            }
        },
        computed:{
            activityDetailLink(){
                return mobileH5.activeDetail+this.activityId;
            },
            logo(){
                return this.$store.state.systemSetting.systemLogo;
            },
            activityMpName(){
                return this.activityName + '(小程序二维码)';
            },
            activityShareName(){
                return this.activityName + '(H5二维码)';
            },
        },
        data(){
            return {
                activityMpCodeLoading: true,

                activityShareCodeLoading: true,
                activityShareCode: '',
            }
        },
        methods:{
            drawCanvas() {
                let canvas = this.$refs.canvas;
                let image = this.$refs.image;
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                this.activityMpCodeLoading = false;
            },
            downloadCode() {
                if (this.activityMpCodeLoading) {
                    this.$message.warning({message: '请等待二维码加载完成', duration: 1000});
                    return;
                }
                let data = this.$refs.canvas.toDataURL('image/png', 1);
                download(data, `${this.activityMpName}.png`, "image/png");
            },
            drawShareCanvas(){
                let canvas = this.$refs.shareCanvas;
                let image = this.$refs.shareImage;
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                this.activityShareCodeLoading = false;
            },
            downloadShareCode(){
                if (this.activityShareCodeLoading) {
                    this.$message.warning({message: '请等待二维码加载完成', duration: 1000});
                    return;
                }
                let data = this.$refs.shareCanvas.toDataURL('image/png', 1);
                download(data, `${this.activityShareName}.png`, "image/png");
            }
        },
        mounted(){
            QRCode.toDataURL(this.activityDetailLink,{
                width: 280,
                height: 280,
            }).then(url=>{
                this.activityShareCode = url;
            })
        },
        watch:{
            activityId(){
                QRCode.toDataURL(this.activityDetailLink,{
                    width: 280,
                    height: 280,
                }).then(url=>{
                    this.activityShareCode = url;
                })
            }
        }
    }
</script>

