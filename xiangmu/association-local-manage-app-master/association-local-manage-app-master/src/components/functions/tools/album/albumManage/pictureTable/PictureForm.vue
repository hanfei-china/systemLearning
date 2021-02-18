<template>
  <el-container>
    <el-main class="unset-padding">
      <el-form label-width="120px">
        <el-form-item size="small" label="上传到相册：" required>
          <el-select v-model="albumId" filterable clearable remote placeholder="请输入关键词" :remote-method="getAlbumList" @focus="getAlbumList()">
            <el-option v-for="item in albumList" :key="item.id" :value="item.id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="text-align-center" v-if="photoUrls.length === 0">
        <el-upload class="avatar-uploader" :action="action" multiple :show-file-list="false" :on-success="handleAvatarSuccess">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div v-else>
        <div style="overflow-x: hidden;">
          <div class="flex flex-wrap" style="width: calc(100% + 10px);">
            <div v-for="(item,index) in photoUrls" :key="index" class="imgWrap">
              <el-image fit="cover" :src="item.smallImage" style="width: 100%;height: 100%;"></el-image>
            </div>
          </div>
        </div>
        <div>
          <el-input
            style="margin:15px 0;width:600px;"
            resize="none"
            type="textarea"
            :rows="3"
            placeholder="请输入视频描述内容"
            :maxlength="100"
            show-word-limit
            v-model="pictureDescribe">
          </el-input>
        </div>
        <div>
          <div class="flex">
            <el-button size="small" type="primary" style="margin-right: 10px;" @click="uploadPicture">开始上传
            </el-button>
            <el-upload :action="action" multiple :show-file-list="false" :on-success="handleAvatarSuccess">
              <el-button size="small">继续添加</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { requestBaseUrl } from "../../../../../../js/config/serviceConfig";

export default {
  name: "PictureForm",
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadImages", //图片上传地址
      albumList: [], //相册列表
      albumId: "", //相册id
      photoUrls: [], //照片url
      pictureDescribe:''
    };
  },
  created() {
    this.getAlbumList();
  },
  methods: {
    //搜索框筛选
    getAlbumList(query) {
      this.$request
        .get("/api/admin/photoAlbum/manage/getPhotoAlbumsByTitle", {
          searchTitle: query,
        })
        .then((res) => {
          this.albumList = res.data;
        });
    },
    //添加成功
    handleAvatarSuccess(res) {
      this.photoUrls.push(res.data);
    },
    //上传照片
    uploadPicture() {
      if (!this.albumId) {
        this.$message.warning("请选择要上传的相册");
        return;
      }

      this.$request
        .post("/api/admin/photoAlbum/manage/uploadPhoto", {
          albumId: this.albumId,
          photoUrls: this.photoUrls,
          pictureDescribe:this.pictureDescribe
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("上传成功");
            this.$emit("close");
            this.$emit("refresh");
          }
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.imgWrap {
  width: 144px;
  height: 144px;
  margin: 0 10px 10px 0;
}
</style>
