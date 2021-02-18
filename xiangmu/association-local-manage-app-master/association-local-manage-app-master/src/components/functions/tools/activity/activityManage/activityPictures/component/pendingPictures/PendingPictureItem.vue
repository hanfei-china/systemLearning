<template>
    <div class="cursor-pointer picture-item position-relative" @click.stop="pictureDialog=true">
        <img :src="picture.photoUrl" style="height: 117px;width: 208px;object-position: center;object-fit: cover;" />
        <div class="position-absolute flex flex-end" style="bottom: 8px;left:8px;right:8px;">
            <el-button size="mini" circle type="success" icon="el-icon-check" @click.native.stop="examinePictures(1)"/>
            <el-button size="mini" circle type="danger" icon="el-icon-close" @click.native.stop="examinePictures(2)"/>
        </div>
        <el-dialog title="大图预览" :visible.sync="pictureDialog" append-to-body width="800px">
            <div class="text-align-center">
                <el-image fit="cover" style="max-height: 400px;max-width: 400px;" class="custom-el-image" :src="picture.photoUrl" :preview-src-list="[picture.photoUrl]"/>
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
                    <el-button size="small" type="success"  @click="examinePictures(1)">通过</el-button>
                    <el-button size="small" type="danger" @click="examinePictures(2)">拒绝</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PendingPictureItem",
        props:{
            picture: Object
        },
        data(){
            return {
                pictureDialog: false
            }
        },
        methods:{
            examinePictures(state) {
                this.$request.put('/api/admin/photoAlbum/manage/dealPhotoApply', {
                    state: state,
                    photoIds: [this.picture.id]
                }).then(res => {
                    if (res.success) {
                        this.$message.success('照片审核完成');
                        this.$emit('delete-item');
                        this.pictureDialog = false;
                    }
                })
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

