<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 20px;">
        <el-main class="unset-padding">
            <el-card>
                <div class="flex flex-center">
                    <el-upload v-loading="uploading" with-credentials multiple
                               element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
                               element-loading-background="rgba(0, 0, 0, 0.8)"
                               class="lrd-file-el-upload" :show-file-list="false"
                               accept="image/png,image/jpg,image/jpeg"
                               style="width: 100%;" :before-upload="beforeUpload"
                               :on-success="uploadSuccess" drag
                               :action="action">
                        <i class="el-icon-upload"/>
                        <div class="el-upload__text">将照片拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </div>
            </el-card>
            <el-card style="margin-top: 16px;">
                <div slot="header">
                    <i class="el-icon-warning" style="font-size: 19px;padding-right: 8px;height: 22px;line-height: 22px;"/>
                    <span>导入说明<span class="danger-tip">(非常重要)</span></span>
                </div>
                <div>
                    <div class="member-import-tip-detail">
                        <div class="member-import-tip-detail-item"><span>1、<span class="danger-tip">导入图像是针对人脸识别功能，请按步骤完成”图片批量上传“，以保证功能的正常使用！</span></span>
                        </div>
                        <div class="member-import-tip-detail-item">
                            <div>2、<span class="danger-tip">现支持PNG、JPG、JPEG、BMP，不支持GIF图片！</span></div>
                        </div>
                        <div class="member-import-tip-detail-item">
                            <div>3、图片的命名规范要保证和其中某项会员字段相同！</div>
                        </div>
                        <div class="member-import-tip-detail-item">
                            <div>4、每次上传不得超过300张！</div>
                        </div>
                        <div class="member-import-tip-detail-item">
                            <div>5、命名和字段信息不匹配的处理说明：上传的图片与后台会员信息字段不能匹配时，则不会导入该记录</div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-dialog title="字段调整" :visible.sync="dialogShow" append-to-body width="600px" :show-close="false"
                       :close-on-click-modal="false">
                <member-face-field-match v-if="dialogShow" @close="close" @getList="getList"/>
            </el-dialog>
            <el-dialog title="未成功上传图片" :visible.sync="faceTableDialogShow" append-to-body width="800px"
                       :close-on-click-modal="false">
                <export-face-table v-if="faceTableDialogShow" :list="errorFaceList"/>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
    import MemberFaceFieldMatch from "./MemberFaceFieldMatch";
    import ExportFaceTable from "./ExportFaceTable";

    export default {
        name: "MemberFaceStore",
        components: {ExportFaceTable, MemberFaceFieldMatch},
        data() {
            return {
                uploading: false,//上传loading,
                action: requestBaseUrl + '/api/admin/baidu/faceIdentification/faceIdentificationUploadFile',
                dialogShow: false,
                faceTableDialogShow: false,//人脸列表弹窗
                errorFaceList: [],//上传失败的人脸列表
            }
        },
        methods: {
            beforeUpload() {
                this.uploading = true;
            },
            uploadSuccess(res) {
                let {success, msg} = res;
                if (!success) {
                    this.$message.error(msg);
                    this.uploading = false;
                    return;
                }

                setTimeout(() => {
                    this.uploading = false;
                    this.dialogShow = true;
                }, 500)
            },
            close(){
                this.dialogShow = false;
            },
            //获取上传失败列表
            getList(list){
                this.faceTableDialogShow = true;
                this.errorFaceList = list;
            }
        }
    }
</script>

<style scoped>

</style>
