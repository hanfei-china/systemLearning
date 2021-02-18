<template>
    <div class="cursor-pointer picture-item position-relative" @click.stop="pictureDialog=true">
        <div class="position-absolute flex flex-end" @click.stop style="top: 8px;left:8px;right:8px;">
            <el-checkbox v-model="picture.checked"/>
        </div>
        <img :src="picture.photoUrl" style="height: 117px;width: 208px;object-position: center;object-fit: cover;"/>
        <div class="position-absolute flex flex-end" style="bottom: 8px;left:8px;right:8px;">
            <el-button size="mini" circle type="danger" icon="el-icon-delete" @click.native.stop="deletePicture"/>
        </div>
        <el-dialog title="大图预览" :visible.sync="pictureDialog" append-to-body width="800px">
            <div class="text-align-center">
                <el-image style="max-height: 400px;max-width: 400px;" class="custom-el-image" :src="picture.photoUrl" :preview-src-list="[picture.photoUrl]"/>
            </div>
            <div class="flex" style="margin-top: 10px;">
                <div style="font-size: 12px;" class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                    <div>
                        <span v-show="picture.adminUserName || picture.memberUserName">上传用户：</span>
                        <span >{{ picture.createType === 0 ? picture.adminUserName : picture.memberUserName}}</span>
                        <span style="padding-left: 10px;">上传时间：</span>
                        <span>{{picture.createTime | yyyyMMddHHmm}}</span>
                    </div>
                </div>
                <div>
                    <el-button size="small" type="danger" @click="deletePicture">删除</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PassPictureItem",
        props:{
            picture: Object
        },
        data(){
            return {
                pictureDialog: false
            }
        },
        methods:{
            deletePicture() {
                this.$confirm('此操作将永久删除图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/photoAlbum/manage/batchDeletePhotos', {
                        params: {
                            photoIds: [this.picture.id]
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('照片已成功删除');
                            this.$emit('delete-item');
                            this.pictureDialog = false;
                        }
                    })
                }).catch(()=>{})
            },
        }
    }
</script>
<style lang="less">
    .picture-item{
        margin: 0 10px 10px 0;
        transition: all .3s;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 2px 4px 4px rgba(0, 0, 0, .4), 0 0 6px rgba(0, 0, 0, .04);
    }
</style>

