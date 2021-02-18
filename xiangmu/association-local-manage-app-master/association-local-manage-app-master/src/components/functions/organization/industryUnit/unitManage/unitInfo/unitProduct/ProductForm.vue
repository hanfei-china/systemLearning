<template>
    <el-container style="padding: 16px;">
        <el-main class="unset-padding" style="overflow: hidden;height: 500px;">
            <vue-scroll>
                <el-form size="small" label-width="150px">
                    <el-form-item required label="产品名称">
                        <el-input placeholder="请输入产品名称，24字以内" v-model="productInfo.title"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input placeholder="请输入联系人姓名，50字以内" v-model="productInfo.contactPerson"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input placeholder="请输入联系人电话" v-model="productInfo.contactPhone"></el-input>
                    </el-form-item>
                    <el-form-item required label="产品海报">
                        <div class="flex">
                            <div style="width: 240px;height: 180px;background-color: rgb(136, 136, 136);">
                                <el-image v-if="productInfo.posterUrl" :src="productInfo.posterUrl" style="width: 100%;height: 100%;"
                                          fit="cover"></el-image>
                            </div>
                            <div class="flex flex-column flex-end" style="padding-left: 10px;">
                                <div>
                                    <span style="color: red;font-size: 12px;">请上传4：3比例的图片，上传图片质量应小于1M</span>
                                </div>
                                <div>
                                    <el-upload
                                            :action="action" :show-file-list="false"
                                            :before-upload="beforeAvatarUpload"
                                            :on-success="handleAvatarSuccess"
                                            accept="image/png,image/jpeg,image/gif,image/jpg"
                                    >
                                        <el-button size="small" type="primary">上传海报</el-button>
                                    </el-upload>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="产品简介">
                        <el-input type="textarea" :rows="5" resize="none" placeholder="请输入产品简介" v-model="productInfo.brief"></el-input>
                    </el-form-item>
                    <el-form-item required label="产品详情">
                        <editor v-model="productInfo.details"></editor>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" style="padding-top: 16px;">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import Editor from "../../../../../../util/editor/Editor";
    import {requestBaseUrl} from '../../../../../../../js/config/serviceConfig';

    export default {
        name: "ProductForm",
        components: {Editor},
        props: {
            productId: {
                type: String
            },
            unitInfo: {
                type: Object
            }
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
                productInfo: {
                    title: '',//服务名称
                    contactPerson: '',//联系人
                    contactPhone: '',//联系电话
                    posterUrl: '',//海报
                    brief: '',//服务简介
                    details: '',//服务详情
                    organizationId: this.unitInfo.id,//企业id
                },
            }
        },
        created(){
            if(this.productId){
                this.getInfo()
            }
        },
        methods: {
            getInfo(){
                this.$request.get('/api/admin/organization/server/getOrganizationServiceDetails',{params: {
                        serverId: this.productId
                    }}).then(res => {
                        this.productInfo = res.data;
                })
            },
            // 上传本地图片   限制图片大小
            beforeAvatarUpload(file) {
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$message.error('上传文件大小不能超过 1MB!');
                    return false
                }
            },
            handleAvatarSuccess(res, file) {
                this.productInfo.posterUrl = file.response.data;
            },
            submitData(){
                if(!this.productInfo.title){
                    this.$message.warning('请上传产品服务名称');
                    return
                }
                if(!this.productInfo.posterUrl){
                    this.$message.warning('请上传产品服务海报');
                    return
                }
                if(!this.productInfo.details){
                    this.$message.warning('请上传产品服务详情');
                    return
                }

                if(this.productId){
                    this.productInfo.id = this.productId;
                    this.$request.put('/api/admin/organization/server/updateOrganizationServer',this.productInfo).then(res => {
                        if(res.success){
                            this.$message.success('产品服务信息已更新');
                            this.$emit("close");
                            this.$emit("refresh")
                        }
                    })
                }else {
                    this.$request.post('/api/admin/organization/server/addOrganizationServer',this.productInfo).then(res => {
                        if(res.success){
                            this.$message.success('产品服务添加成功');
                            this.$emit("close");
                            this.$emit("refresh")
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>