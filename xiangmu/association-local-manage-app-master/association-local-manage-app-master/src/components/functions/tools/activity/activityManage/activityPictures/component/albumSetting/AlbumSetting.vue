<template>
    <el-container class="absolute-fill-parent">
        <el-main>
            <vue-scroll>
                <el-form size="small" label-width="100px" style="max-width: 600px;">
                    <el-form-item label="相册名称：" required>
                        <el-input v-model="title" disabled readonly placeholder="请输入相册名称"/>
                    </el-form-item>
                    <el-form-item label="相册分组：" required>
                        <group-tree v-model="categoryId" :editable="false" :only-save-activity="true" :is-multiple="false"
                                    group-type="2" placeholder="请选择相册分组"/>
                    </el-form-item>
                    <el-form-item label="相册封面：">
                        <div class="flex">
                            <div class="imageWrap">
                                <el-image v-if="coverUrl" fit="cover" style="width: 100%;height: 100%;"
                                          :src="coverUrl"/>
                            </div>
                            <div class="flex flex-column flex-end">
                                <div style="color: red;font-size: 12px;">
                                    上传封面大小限制在2M以内
                                </div>
                                <el-upload :action="action" :show-file-list="false"
                                           :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                    <el-button type="primary" size="small">点击上传</el-button>
                                </el-upload>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="相册描述：">
                        <el-input type="textarea" :rows="5" resize="none" v-model="descriptions"/>
                    </el-form-item>
                    <el-form-item label="其他设置：">
                        <div style="padding: 8px 16px;background-color: #f2f2f2;border-radius: 4px;">
                            <el-checkbox v-model="inUsed">启用相册</el-checkbox>
                            <el-checkbox v-model="allowUpload">允许会员上传照片到相册</el-checkbox>
                            <el-checkbox :disabled="!allowUpload" v-model="verify">会员上传照片需要审核</el-checkbox>
                        </div>
                    </el-form-item>
                    <div class="flex flex-end">
                        <el-button size="small" icon="el-icon-success" type="primary" @click="saveAlbum">确 定</el-button>
                    </div>
                </el-form>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../../js/config/serviceConfig";
    import GroupTree from "../../../../../../util/group/GroupTree";

    export default {
        name: "AlbumSetting",
        components: {GroupTree},
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
                allowUpload: true,//允许会员上传照片到相册
                categoryId: [],//分类id
                coverUrl: '',//封面url
                descriptions: '',//描述
                inUsed: true,//是否启用
                title: '',//相册名称
                verify: false,//会员上传的照片是否需要审核
                urlLoading: true,//加载状态
            }
        },
        methods:{
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传封面图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleAvatarSuccess(res, file) {
                this.coverUrl = file.response.data;
            },
            getAlbumInfo() {
                this.$request.get('/api/admin/photoAlbum/manage/getPhotoAlbumDetailById', {
                    params: {
                        id: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.title = res.data.title;
                        this.descriptions = res.data.descriptions;
                        this.inUsed = res.data.inUsed;
                        this.coverUrl = res.data.coverUrl;
                        this.categoryId = [res.data.categoryId];
                        this.verify = JSON.parse(res.data.setting).verify;
                        this.allowUpload = JSON.parse(res.data.setting).allowUpload;
                    }
                })
            },
            saveAlbum(){
                this.$request.put('/api/admin/photoAlbum/manage/updatePhotoAlbum', {
                    allowUpload: this.allowUpload,
                    categoryId: this.categoryId[0],
                    coverUrl: this.coverUrl,
                    descriptions: this.descriptions,
                    inUsed: true,
                    photoAlbumId: this.activityId,
                    title: this.title,
                    verify: this.verify,
                }).then(res => {
                    if (res.success) {
                        this.$message.success('相册设置已更新');
                    }
                })
            }
        },
        created() {
            this.getAlbumInfo();
        }
    }
</script>
<style scoped lang="less">
    .imageWrap {
        width: 259px;
        height: 148px;
        border-radius: 2px;
        background-color: #888888;
        margin-right: 10px;
    }
</style>
