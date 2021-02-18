<template>
  <el-container class="absolute-fill-parent">
    <el-main>
      <vue-scroll>
        <div class="flex flex-wrap">
          <pass-picture-item v-for="(image,index) of pictureList" :key="image.id" @delete-item="deleteItem(index)" :picture="image" />
        </div>
      </vue-scroll>
    </el-main>
    <div class="position-fixed" style="right: 80px;bottom: 80px;overflow: visible;">
      <div>
        <el-tooltip class="item" effect="dark" content="上传照片" placement="left">
          <el-button style="box-shadow: 4px 4px 8px rgba(0, 0, 0, .4);padding: 16px;" type="primary" circle @click="uploadPictureVisible=true">
            <i class="el-icon-upload" style="font-size: 20px;" />
          </el-button>
        </el-tooltip>
      </div>
      <div style="margin-top: 16px;">
        <el-tooltip class="item" effect="dark" content="批量删除" placement="left">
          <el-button style="box-shadow: 4px 4px 8px rgba(0, 0, 0, .4);padding: 16px;" type="danger" circle @click="batchDelete">
            <i class="el-icon-delete" style="font-size: 20px;" />
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <el-dialog title="上传照片" :visible.sync="uploadPictureVisible" append-to-body :close-on-click-modal="false" width="800px" @close="photoUrls=[]">
      <div>
        <div class="text-align-center" v-if="photoUrls.length === 0">
          <el-upload class="avatar-uploader" :action="action" multiple :show-file-list="false" :on-success="handleAvatarSuccess">
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
        <div v-else>
          <div style="overflow-x: hidden;">
            <div class="flex flex-wrap" style="width: calc(100% + 10px);">
              <div v-for="(item,index) in photoUrls" :key="index" class="imgWrap">
                <el-image fit="cover" :src="item.smallImage" style="width: 100%;height: 100%;" />
              </div>
            </div>
          </div>
          <div>
            <div class="flex">
              <el-button size="small" type="primary" style="margin-right: 10px;" @click="uploadPicture">
                开始上传
              </el-button>
              <el-upload :action="action" multiple :show-file-list="false" :on-success="handleAvatarSuccess">
                <el-button size="small">继续添加</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import PassPictureItem from "./PassPictureItem";
import { requestBaseUrl } from "../../../../../../../../js/config/serviceConfig";
export default {
  name: "PassPictures",
  components: { PassPictureItem },
  data() {
    return {
      pageSize: 500,
      offset: 1,
      pictureList: [],
      listCount: 0,

      uploadPictureVisible: false,
      photoUrls: [], //上传的照片列表
      action: requestBaseUrl + "/api/common/anon/uploadImages", //图片上传地址
    };
  },
  computed: {
    activityId() {
      return this.$route.params.activityId;
    },
  },
  methods: {
    getPictureList() {
      this.$request
        .post("/api/admin/photoAlbum/manage/viewPhotoApply", {
          albumId: this.activityId,
          limit: this.pageSize,
          offset: (this.offset - 1) * this.pageSize,
          state: 1,
        })
        .then((res) => {
          if (res.success) {
            this.pictureList = this.pictureList.concat(res.data.list);
            this.listCount = res.data.total;

            if (this.limit * this.offset < this.listCount) {
              this.offset = this.offset + 1;
              this.getPictureList();
            } else {
              for (let i = 0; i < this.pictureList.length; i++) {
                this.$set(this.pictureList[i], "checked", false);
              }
            }
          }
        });
    },
    deleteItem(index) {
      this.pictureList.splice(index, 1);
    },
    handleAvatarSuccess(res) {
      this.photoUrls.push(res.data);
    },
    //上传照片
    uploadPicture() {
      this.$request
        .post("/api/admin/photoAlbum/manage/uploadPhoto", {
          albumId: this.activityId,
          photoUrls: this.photoUrls,
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("上传成功");
            this.uploadPictureVisible = false;
            this.pictureList = [];
            this.getPictureList();
          }
        });
    },
    batchDelete() {
      let ids = [];
      for (let picture of this.pictureList) {
        if (picture.checked) {
          ids.push(picture.id);
        }
      }

      if (ids.length < 1) {
        this.$message.warning("请选择要删除的照片");
        return;
      }

      this.$confirm("此操作将永久删除图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/batchDeletePhotos", {
              params: {
                photoIds: ids,
              },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("照片已成功删除");
                this.pictureList = this.pictureList.filter((picture) => {
                  return !picture.checked;
                });
              }
            });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getPictureList();
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
