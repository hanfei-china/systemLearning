<template>
    <el-card shadow="always">
        <div slot="header" class="flex" style="line-height: 21px;">
                            <span class="flex-fill-in-the-remaining-space"
                                  style="font-size: 16px;color: #666;">{{signLocation.address}}</span>
            <span style="font-size: 14px;color: #999;">{{signLocation.createTime | yyyyMMddHHmmss}}</span>
        </div>
        <div class="text-align-right">
            <el-button-group>
                <el-button size="small" type="primary" @click="$emit('start-sign-in')">开始签到</el-button>
                <el-button size="small" @click="$emit('sign-data')">签到数据</el-button>
                <el-button size="small" @click="updateSignLocation">修改</el-button>
                <el-tooltip effect="dark" content="活动签到二维码" placement="top">
                    <el-button icon="iconfont icon-qr-code" size="small"
                               @click="qrCodeVisible=true"/>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除签到点" placement="top">
                    <el-button size="small" type="danger" @click="deleteSignLocation" icon="el-icon-delete"/>
                </el-tooltip>
            </el-button-group>
        </div>
        <el-dialog title="签到点设置" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body
                   width="600px">
            <sign-location-form v-if="formDialogVisible" :activityId="activityId" :signLocationForm="signLocation"
                                @refresh="refresh" @close="formDialogVisible = false"/>
        </el-dialog>
        <el-dialog title="活动签到二维码" :visible.sync="qrCodeVisible" :close-on-click-modal="false" append-to-body
                   width="600px">
            <div class="text-align-center" style="padding-bottom: 20px;">
                <div class="text-align-center">
                    <div>
                        <canvas v-if="signLocation.qrCode" ref="canvas" style="width: 180px;height: 180px;"/>
                    </div>
                    <img @load="drawCanvas" ref="image" crossorigin="anonymous" :src="signLocation.qrCode"
                         style="width: 180px; height: 180px;display: none;"/>
                    <div style="font-size: 14px;padding-top:0;height: 35px;text-align: center;"><a @click.stop="downloadCode" class="lrd-a"><i class="el-icon-download" style="padding-right: 6px;"/>下载活动签到二维码</a></div>
                </div>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import SignLocationForm from "./SignLocationForm";
    import {download} from "../../../../../../../js/util/download";
    export default {
        name: "SignLocationCard",
        components: {SignLocationForm},
        inject: ['activityInfo'],
        props:{
            signLocation: Object
        },
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
        },
        data(){
            return {
                formDialogVisible: false,
                qrCodeVisible: false
            }
        },
        methods:{
            refresh(){
                this.$emit('refresh');
            },
            updateSignLocation(){
                this.formDialogVisible = true;
            },

            deleteSignLocation() {
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？', '提示', {
                    type: 'warning',
                    confirmButtonText: '确认删除'
                }).then(() => {
                    this.$request.delete('/api/admin/activity/address/deleteAddress', {
                        params: {
                            id: this.signLocation.id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$emit('refresh');
                            this.$message.success('删除成功');
                        }
                    })
                }).catch(() => {})
            },
            drawCanvas() {
                let canvas = this.$refs.canvas;
                let image = this.$refs.image;
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
            },
            downloadCode() {
                let data = this.$refs.canvas.toDataURL('image/png', 1);
                download(data, `${this.activityInfo.theme}-${this.signLocation.address}.png`, "image/png");
            },
        }
    }
</script>
