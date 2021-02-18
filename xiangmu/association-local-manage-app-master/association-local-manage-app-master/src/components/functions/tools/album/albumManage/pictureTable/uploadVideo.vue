<template>
  <el-container>
    <el-main class="unset-padding">
      <el-form label-width="120px" v-if="!id">
        <el-form-item size="small" label="上传到相册：" required>
          <el-select
            v-model="albumId"
            filterable
            clearable
            remote
            placeholder="请输入关键词"
            :remote-method="getAlbumList"
            @focus="getAlbumList()"
          >
            <el-option
              v-for="item in albumList"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="text-align-center" v-if="!videoUrl">
        <el-upload
          class="avatar-uploader"
          :action="action"
          :on-success="handleAvatarSuccess"
          :on-progress="uploadingVideo"
          :disabled="uploadDisable"
          accept="video/webm, video/mp4, video/ogg"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div v-else>
        <div style="display:flex;justifyContent:center;alignItems:center;flexDirection:column;">
          <video
            :src="videoUrl"
            controls="controls"
            preload="preload"
            width="600px"
            height="450px"
            style="border:3px solid #222;"
          ></video>
          <el-input
            style="marginTop:15px;width:600px;"
            resize="none"
            type="textarea"
            :rows="3"
            placeholder="请输入视频描述内容"
            :maxlength="100"
            show-word-limit
            v-model="describe">
          </el-input>
        </div>
        <div
          style="height:50px;display:flex;alignItems:center;justifyContent:flex-end;marginTop:15px;"
        >
          <el-button
            size="small"
            type="primary"
            style="margin-right: 10px;"
            @click="uploadPicture"
          >开始上传</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { requestBaseUrl } from "../../../../../../js/config/serviceConfig";

export default {
  name: "uploadVideo",
  props:['id'],
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadVideo", //视频上传地址
      albumList: [], //相册列表
      albumId: "", //相册id
      videoUrl: '', //照片url
      describe:'',
      uploadDisable:false
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
          searchTitle: query
        })
        .then(res => {
          this.albumList = res.data;
        });
    },
    //添加成功
    handleAvatarSuccess(res) {
      if (res.success) {
        // this.photoUrls.push(res.data);
        this.videoUrl=res.data;
      } else {
        this.$message.warning("上传失败,请重新上传");
      }
    },
    uploadingVideo(){
      this.uploadDisable=true;
    },
    //上传视频
    uploadPicture() {
      var that=this;
      if ((!this.id)&&(!this.albumId)) {
        this.$message.warning("请选择要上传的相册");
        return;
      }

      var params = {
        albumId: that.id?that.id:this.albumId,
        photoUrls: [
          {
            image: "",
            smallImage: this.videoUrl
          }
        ],
        describe:this.describe,
        fileType:2
      };

      this.$request
        .post("/api/admin/photoAlbum/manage/uploadPhoto", params)
        .then(res => {
          if (res.success) {
            this.$message.success("上传成功");
            this.$emit("refresh");
            this.$emit("close");
          }
        });
    }
  }
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
