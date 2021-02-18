<template>
  <el-container class="absolute-fill-parent album-homepage">
    <el-header class="header flex">
      <div class="flex-fill-in-the-remaining-space">
        <el-button type="text" class="backBtn">相册主页</el-button>
      </div>
      <div>
        <span style="margin-right: 40px">
          启用
          <el-switch v-model="inUsed" active-color="#13ce66" @change="usingAlbum"></el-switch>
        </span>
        <el-button size="mini" type="warning" @click="deleteAlbum">删除</el-button>
        <el-button size="mini" type="primary" @click="albumFormVisible = true">编辑</el-button>
      </div>
    </el-header>
    <el-main class="unset-padding">
      <vue-scroll @handle-scroll="load">
        <div class="homepageMain">
          <div class="flex albumHeader">
            <!--<div class="albumCover" style="padding: 0 16px 0 0;">
                            <el-image fit="cover" :src="albumInfo.coverUrl" style="width: 100%;height: 100%;"></el-image>
                        </div>-->
            <div class="flex-fill-in-the-remaining-space">
              <p style="font-size: 20px;font-weight: 500;line-height: 40px;">{{albumInfo.title}}</p>
              <p style="line-height: 30px;">
                <span style="margin-right: 16px;"><i class="iconfont icon-chakan coverIcon"></i>{{albumInfo.allPageView}}</span>
                <span style="margin-right: 16px;"><i class="iconfont icon-xiangce-copy coverIcon"></i>{{albumInfo.photoNum}}</span>
              </p>
              <p class="text-overflow" style="line-height: 30px;" :title="albumInfo.descriptions">{{albumInfo.descriptions}}</p>
            </div>
          </div>
          <el-container class="picture-record">
            <el-main class="picture">
              <p class="flex">
                <span class="flex-fill-in-the-remaining-space">相册照片({{albumInfo.photoNum}})</span>
                <el-button size="small" type="warning" :disabled="usingDisabled" @click="pictureTransferVisible = true">转移
                </el-button>
                <el-button size="small" type="danger" :disabled="usingDisabled" @click="deleteItems">
                  删除
                </el-button>
                <el-button size="mini" type="primary" @click="uploadPictureVisible = true">上传图片
                </el-button>
                <el-button size="mini" type="primary" @click="uploadVideoVisible = true">上传视频
                </el-button>
              </p>
              <div class="pictureWrap">
                <div class="pictureInner flex flex-wrap">
                  <div class="imgbox" v-for="item in pictureList" :key="item.id" @click="viewLargeImage(item)">
                    <div class="topbtnbox">
                      <img @click.stop="istop(false,item)" v-if="item.top" class="zhidin canceltop" src="../../../../../assets/img/canceltop.png" alt="">
                      <img @click.stop="istop(true,item)" v-else class="zhidin" src="../../../../../assets/img/topping.png" alt="">
                    </div>
                    <img class="istop" v-if="item.top" src="../../../../../assets/img/zhidin.png" alt="">
                    <picture-item :pictureInfo="item" @addPicture="addPicture" @reducePicture="reducePicture"></picture-item>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>
      </vue-scroll>
    </el-main>
    <el-dialog title="编辑相册" :visible.sync="albumFormVisible" append-to-body :close-on-click-modal="false" width="600px">
      <album-form v-if="albumFormVisible" :albumId="albumId" @close="albumFormVisible = false" @refresh="refresh"></album-form>
    </el-dialog>
    <el-dialog title="上传照片" :visible.sync="uploadPictureVisible" append-to-body :close-on-click-modal="false" width="800px">
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
            <el-button size="small" type="primary" style="margin-right: 10px;" @click="uploadPicture">
              开始上传
            </el-button>
            <el-upload :action="action" multiple :show-file-list="false" :on-success="handleAvatarSuccess">
              <el-button size="small">继续添加</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--上传视频弹窗-->
    <el-dialog title="上传视频" :visible.sync="uploadVideoVisible" append-to-body :close-on-click-modal="false" width="800px">
      <upload-video :id="albumId" v-if="uploadVideoVisible" @close="uploadVideoVisible = false" @refresh="refresh" />
    </el-dialog>
    <!--照片转移-->
    <el-dialog title="照片转移" v-if="pictureTransferVisible" :visible.sync="pictureTransferVisible" append-to-body :close-on-click-modal="false" width="600px">
      <el-form label-width="120px">
        <el-form-item size="small" label="转移到相册：" required>
          <el-select v-model="transferAlbumId" filterable clearable remote placeholder="请输入关键词" :remote-method="getAlbumList" @focus="getAlbumList()">
            <el-option v-for="item in transferAlbumList" :key="item.id" :value="item.id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" icon="el-icon-error" type="danger" @click="pictureTransferVisible = false">取消返回</el-button>
        <el-button size="small" icon="el-icon-success" type="primary" @click="transferItems">确 定</el-button>
      </span>
    </el-dialog>
    <el-backtop target=".el-main .__vuescroll .__panel">
      <div style="width: 100%;height: 100%; background-color: #f2f5f6;box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;">UP
      </div>
    </el-backtop>
    <!--查看大图-->
    <el-dialog title="大图预览" :visible.sync="albumPictureDialog" append-to-body width="800px">
      <div class="cover position-relative" style="height: 450px;">
        <el-image v-if="pictureInfo.fileType==1" fit="contain" :src="pictureInfo.picture?pictureInfo.picture:pictureInfo.photoUrl" style="width: 100%;height: 100%;"></el-image>
        <video v-if="pictureInfo.fileType==2" :src="pictureInfo.photoUrl" controls="controls" preload="preload" style="border:3px solid #222;width:100%;height:430px;boxSizing:border-box;"></video>
      </div>
      <div class="desc">
        <p style="margin-bottom: 14px;font-size: 16px;font-weight: 500;">{{albumInfo.title}}</p>
        <el-tooltip class="descTooltip" effect="dark" :content="pictureInfo.photoDescribe" placement="top-start">
          <div class="preDescribe" v-if="pictureInfo.photoDescribe"><span style="fontWeight:700;">描述: </span>{{pictureInfo.photoDescribe}}</div>
        </el-tooltip>
        <div class="flex" style="line-height: 32px;">
          <p style="font-size: 12px;" class="flex-fill-in-the-remaining-space">
            <span>上传用户</span>
            <el-popover
              placement="top"
              width="220"
              trigger="hover"
            >
              <div>
                <div class="allContact">
                  <div class="left">手机号：</div>
                  <div>{{pictureInfo.telphone}}</div>
                </div>
                <div class="allContact">
                  <div class="left">备用联系方式：</div>
                  <div>{{pictureInfo.phoneOne}}</div>
                </div>
                <div class="allContact">
                  <div class="left">邮箱：</div>
                  <div>{{pictureInfo.email}}</div>
                </div>
                <div class="allContact">
                  <div class="left">qq：</div>
                  <div>{{pictureInfo.qq}}</div>
                </div>
                <div class="allContact">
                  <div class="left">微信：</div>
                  <div>{{pictureInfo.wechat}}</div>
                </div>
              </div>
              <span slot="reference" style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 0">{{pictureInfo.adminUserName}}</span>
              <span slot="reference" style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 1">{{pictureInfo.memberUserName}}</span>
            </el-popover>
            <!-- <span style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 0">{{pictureInfo.adminUserName}}</span>
            <span style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 1">{{pictureInfo.memberUserName}}</span> -->
            <span>上传时间</span>
            <span style="margin-left: 16px;">{{pictureInfo.createTime | yyyyMMddHHmm}}</span>
          </p>
          <div>
            <el-button size="small" type="warning" @click="transferPicture(pictureInfo.id)">转移</el-button>
            <el-button size="small" type="danger" @click="deletePicture(pictureInfo.id)">删除
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import AlbumForm from "../albumManage/albumTable/AlbumForm";
import PictureItem from "./PictureItem";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";
import uploadVideo from '../albumManage/pictureTable/uploadVideo'

export default {
  name: "AlbumHomepage",
  components: { AlbumForm, PictureItem, uploadVideo },
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadImages", //图片上传地址
      albumId: "", //相册id
      albumInfo: {}, //相册详情
      inUsed: false,
      pictureList: [], //照片列表
      checkedlist: [], //选中的照片列表
      pageSize: 60, //获取照片条数
      offset: 1, //偏移量
      listCount: 0, //总量
      uploadPictureVisible: false, //上传照片弹窗
      photoUrls: [], //上传的照片列表
      albumFormVisible: false, //编辑相册弹窗
      pictureTransferVisible: false, //批量转移照片弹窗
      transferAlbumId: "", //转移相册id
      transferAlbumList: [], //相册列表
      transferSingle: false, //单张照片转移
      transferPictureId: "", //要转移的照片
      albumPictureDialog: false, //查看大图
      pictureInfo: {}, //大图信息
      uploadVideoVisible:false,
      pictureDescribe:''
    };
  },
  created() {
    this.albumId = this.$route.params.moduleId;
    if (this.albumId) {
      this.getAlbumInfo();
      this.getPictureList();
    }
  },
  computed: {
    usingDisabled() {
      return this.checkedlist.length <= 0;
    },
  },
  watch: {
    uploadPictureVisible(val) {
      if (!val) {
        this.photoUrls = [];
      }
    },
    pictureTransferVisible(val) {
      if (val) {
        this.getAlbumList();
      }
    },
  },
  methods: {
    istop(bol, item) {
      var str = bol ? "" : "取消";
      this.$msgbox
        .confirm("是否" + str + "置顶？", "提示", {
          type: "warning",
          confirmButtonText: "确认",
        })
        .then(() => {
          var url = bol
            ? "api/admin/photoAlbum/manage/top/" + item.id
            : "api/admin/photoAlbum/manage/cancelTop/" + item.id;
          this.$request.put(url).then((r) => {
            this.$message.success(`${str}置顶成功`);
            //    item.top = bol;
            this.getPictureList();
          });
        })
        .catch(() => {});
    },
    //相册详情
    getAlbumInfo() {
      this.$request
        .get("/api/admin/photoAlbum/manage/getPhotoAlbumDetailById", {
          params: {
            id: this.albumId,
          },
        })
        .then((res) => {
          if (res.success) {
            this.albumInfo = res.data;
            this.inUsed = this.albumInfo.inUsed;
          }
        });
    },
    //照片列表
    getPictureList() {
      this.pictureList = [];
      this.$request
        .post("/api/admin/photoAlbum/manage/viewPhotoApply", {
          albumId: this.albumId,
          limit: this.pageSize,
          offset: (this.offset - 1) * this.pageSize,
          state: 1,
        })
        .then((res) => {
          if (res.success) {
            this.pictureList = res.data.list;
            this.listCount = res.data.total;
            for (let i = 0; i < this.pictureList.length; i++) {
              this.$set(this.pictureList, "checked", false);
            }
          }
        });
    },
    refresh() {
      this.getAlbumInfo();
      this.getPictureList();
    },
    //启用禁用
    usingAlbum() {
      this.$request.put("/api/admin/photoAlbum/manage/updatePhotoAlbumStatus", {
        albumIds: [this.albumId],
        inUsed: this.inUsed,
      });
    },
    //添加成功
    handleAvatarSuccess(res) {
      this.photoUrls.push(res.data);
    },
    //上传照片
    uploadPicture() {
      this.$request
        .post("/api/admin/photoAlbum/manage/uploadPhoto", {
          albumId: this.albumId,
          photoUrls: this.photoUrls,
          pictureDescribe:this.pictureDescribe
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("上传成功");
            this.uploadPictureVisible = false;
            this.getAlbumInfo();
            this.getPictureList();
          }
        });
    },
    //删除相册
    deleteAlbum() {
      this.$confirm("此操作将永久删除该相册, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/deletePhotoAlbum", {
              params: {
                photoAlbumIds: [this.albumId],
              },
            })
            .then((res) => {
              if (res.success) {
                this.$router.push("/console/tools/album/manage");
              }
            });
        })
        .catch(() => {});
    },
    //滚动加载
    load(vertical, horizontal, nativeEvent) {
      let { scrollTop } = vertical;
      let scrollHeight = nativeEvent.target.scrollHeight;
      let clientHeight = nativeEvent.target.clientHeight;
      if (
        this.pageSize < this.listCount &&
        scrollTop === scrollHeight - clientHeight
      ) {
        this.pageSize += 20;
        this.getPictureList();
      }
    },
    //选中照片
    addPicture(pictureId) {
      this.checkedlist.push(pictureId);
    },
    reducePicture(pictureId) {
      for (let i = 0; i < this.checkedlist.length; i++) {
        if (this.checkedlist[i] === pictureId) {
          this.checkedlist.splice(i, 1);
        }
      }
    },
    //删除照片
    deleteItems() {
      this.$confirm("此操作将永久删除图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/batchDeletePhotos", {
              params: {
                photoIds: this.checkedlist,
              },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.checkedlist = [];
                this.getAlbumInfo();
                this.getPictureList();
              }
            });
        })
        .catch(() => {});
    },
    deletePicture(id) {
      this.$confirm("此操作将永久删除图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/batchDeletePhotos", {
              params: {
                photoIds: [id],
              },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.checkedlist = [];
                this.getAlbumInfo();
                this.getPictureList();
                this.albumPictureDialog = false;
              }
            });
        })
        .catch(() => {});
    },
    getAlbumList(query) {
      this.$request
        .get("/api/admin/photoAlbum/manage/getPhotoAlbumsByTitle", {
          searchTitle: query,
        })
        .then((res) => {
          this.transferAlbumList = res.data;
        });
    },
    //批量转移
    transferItems() {
      let photoIds = [];
      if (this.transferSingle) {
        photoIds = [this.transferPictureId];
      } else {
        photoIds = this.checkedlist;
      }
      this.$request
        .put("/api/admin/photoAlbum/manage/transferPhotos", {
          toAlbumId: this.transferAlbumId,
          photoIds: photoIds,
        })
        .then((res) => {
          if (res.success) {
            this.pictureTransferVisible = false;
            if (this.albumPictureDialog) {
              this.albumPictureDialog = false;
            }
            this.transferAlbumId = "";
            this.checkedlist = [];
            this.$message.success("转移成功");
            this.getAlbumInfo();
            this.getPictureList();
            this.transferSingle = false;
          }
        });
    },
    transferPicture(id) {
      this.transferSingle = true;
      this.pictureTransferVisible = true;
      this.transferPictureId = id;
    },
    //查看大图
    viewLargeImage(item) {
      this.albumPictureDialog = true;
      this.pictureInfo = item;
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
<style scoped lang="less">
.imgbox {
  position: relative;
  margin: 0 10px 10px 0;
  .topbtnbox {
    text-align: right;
    height: 18px;
    .zhidin {
      width: 50px;
      cursor: pointer;
    }
  }
  .istop {
    position: absolute;
    width: 40px;
    left: 0;
    top: 18px;
    z-index: 20;
  }
}
.allContact{
  display: flex;
  align-items: center;
  /deep/.left{
    width: 100px;
    text-align: right;
  }
}
.preDescribe{
    padding-top: 5px;
    width: 550px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}
</style>
