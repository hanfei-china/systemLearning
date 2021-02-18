<template>
    <div class="absolute-fill-parent account-container flex flex-column flex-center">
        <div class="flex flex-center">
            <div style="border: 1px solid #ebeef5;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);padding: 32px;width: 800px;border-radius: 4px;background-color: rgba(255,255,255,.75);">
                <div class="text-align-center" style="font-size: 18px;padding-bottom: 10px;">活动分享二维码</div>
                <qr-code :activity-id="activityId" :activity-name="activityName" :activity-mp-code="activityMpCode"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {mobileH5} from "../../../../../js/config/serviceConfig";
    import QrCode from "./QrCode";

    export default {
        name: "QrCodeManage",
        components: {QrCode},
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
            activityDetailLink(){
                return mobileH5.activeDetail+this.activityId;
            },
            logo(){
                return this.$store.state.systemSetting.systemLogo;
            }
        },
        data(){
            return {
                activityName: '',
                activityMpCode: '',
                loaded: false
            }
        },
        methods:{
            getInfo(){
                if(!this.activityId){
                    return;
                }
                this.loaded = false;
                let params = {
                    activityId: this.activityId
                };
                Promise.all([this.$request.get('/api/admin/activityInfo/shareCode', {params}),
                    this.$request.get('/api/common/activityCommonInfo/getActivityInfoById',{params})]).then(([qrCodeInfo,activityInfo])=>{

                    this.activityMpCode = qrCodeInfo.data + '?time=' + new Date().valueOf();
                    this.activityName = activityInfo.data.theme ;

                    this.loaded = true;
                })
            },
        },
        created(){
            this.getInfo();
        },
        watch:{
            activityId(){
                this.getInfo();
            }
        }
    }
</script>

