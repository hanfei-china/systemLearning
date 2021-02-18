<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            审批标题：
                        </div>
                    </template>
                    <el-input placeholder="请输入审批标题" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            审批文件：
                        </div>
                    </template>


                    <!--                    <el-upload :action="action" :show-file-list="false" :on-success="uploadSuccess">-->
                    <!--                        <el-button size="small" type="primary">点击上传</el-button>-->
                    <!--                    </el-upload>-->
                    <p class="cursor-pointer" style="color: #409eff;" v-if="form.fileUrl">{{form.fileUrl}}</p>

                    <el-upload v-else v-loading="uploading" with-credentials
                               element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
                               element-loading-background="rgba(0, 0, 0, 0.8)"
                               class="lrd-file-el-upload" :show-file-list="false"
                               style="width: 70%;" drag :on-success="uploadSuccess"
                               :action="requestBaseUrl+'/api/admin/member/poi/analyticalTemplate'">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>


                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from '../../../../../js/config/serviceConfig';

    export default {
        name: "ApproveForm",
        data() {
            return {
                requestBaseUrl,
                uploading: false,
                form: {
                    title: '',
                    fileUrl: ''
                }
            }
        },
        methods: {
            submitData() {
                this.$emit("pushData", this.form);
                this.$emit('close');
            },
            uploadSuccess(res, file) {
                this.$message.success("上传成功");
                this.form.fileUrl = file.name;
            }
        }
    }
</script>

<style scoped>
</style>
