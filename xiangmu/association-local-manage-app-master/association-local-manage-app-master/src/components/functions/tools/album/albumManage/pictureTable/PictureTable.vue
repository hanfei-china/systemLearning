<template>
  <el-container class="absolute-fill-parent" v-loading="loading">
    <el-main v-if="list.length>0" class="unset-padding tableWrap">
      <vue-scroll>
        <div class="picTable">
          <div class="picTable-inner flex flex-wrap" style="padding: 10px 20px">
            <div class="picItem" v-for="item in list" :key="item.id">
              <picture-item :pictureInfo="item" :picturecheckedItemStatus="checkedItemStatus" @addPictureCheckdItem="addCheckdItem" @refresh="getList" @reducePictureCheckdItem="reduceCheckdItem" @deleteItem="deleteItem"
                @transferPicture="transferPictureVisible" />
            </div>
          </div>
        </div>
      </vue-scroll>
    </el-main>
    <el-main v-else class="position-relative">
      <no-data />
    </el-main>
    <el-footer style="padding: 0 20px">
      <div class="flex" style="padding-top: 14px;">
        <div class="flex-fill-in-the-remaining-space">
          <batch-operation title="更多操作">
            <template>
              <li>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAllChange" :disabled="list.length === 0">全选
                </el-checkbox>
              </li>
              <li @click="pictureTransferVisible = true">转移到其他相册</li>
              <li @click="deleteItems">删除</li>
            </template>
          </batch-operation>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </el-footer>
    <!--照片转移-->
    <el-dialog title="照片转移" v-if="pictureTransferVisible" :visible.sync="pictureTransferVisible" append-to-body :close-on-click-modal="false" width="600px">
      <el-form label-width="120px">
        <el-form-item size="small" label="转移到相册：" :rules="{required:true,message:'请选择主题名称',trigger:'blur'}">
          <el-select v-model="albumId" filterable clearable remote placeholder="请输入关键词" :remote-method="getAlbumList" @focus="getAlbumList()">
            <el-option v-for="item in albumList" :key="item.id" :value="item.id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" icon="el-icon-error" type="danger" @click="cancelTransfer">取消返回</el-button>
        <el-button size="small" icon="el-icon-success" type="primary" @click="transferPicture">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import BatchOperation from "../../../../../util/BatchOperation";
import PictureItem from "./PictureItem";
import NoData from "../../../../../util/noData/NoData";

export default {
  name: "PictureTable",
  components: { NoData, BatchOperation, PictureItem },
  props: ["searchTitle", "chosenGroupId", "refresh", "refreshItem"],
  data() {
    return {
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
      },
      list: [],
      idList: [],
      checkedList: [],
      isIndeterminate: false,
      checkedAll: false,
      checkedItemStatus: false, //控制全选
      albumPictureDialog: false, //查看照片的弹窗
      pictureTransferVisible: false, //照片转移弹窗
      albumList: [], //转移相册列表
      albumId: "", //转移相册id
      transferId: "", //转移的照片id

      loading: true,
    };
  },
  created() {
    this.getList();
  },
  watch: {
    searchTitle() {
      this.getList();
    },
    chosenGroupId() {
      this.getList();
    },
    refreshItem() {
      if (this.refreshItem === "pictureTable") {
        this.getList();
      }
    },
    refresh(val) {
      if (val) {
        this.getList();
        this.$emit("changeRefreshStatus");
      }
    },
  },
  methods: {
    getList() {
      this.list = [];
      this.idList = [];
      this.checkedList = [];
      this.loading = true;

      if (this.chosenGroupId !== null && this.chosenGroupId !== undefined) {
        this.$request
          .post("/api/admin/photoAlbum/manage/viewPhotoApply", {
            limit: this.page.pageSize,
            offset: this.page.pageSize * (this.page.currentPage - 1),
            state: 1,
            groupId: this.chosenGroupId === "0" ? "" : this.chosenGroupId,
            searchTitle: this.searchTitle,
          })
          .then((res) => {
            this.list = res.data.list;
            this.page.total = res.data.total;
            this.list.map((item) => {
              this.$set(item, "checked", false);
            });
            for (let i = 0; i < res.data.list.length; i++) {
              this.idList.push(res.data.list[i].id);
            }
            this.$nextTick(()=>{ this.loading = false; })
          });
      }
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
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
    checkAllChange(val) {
      this.checkedList = val ? JSON.parse(JSON.stringify(this.idList)) : [];
      this.isIndeterminate = false;
      this.checkedItemStatus = val;
      this.checkedAllStatus();
    },
    //全选状态
    checkedAllStatus() {
      let checkedCount = this.checkedList.length;
      this.checkedAll = checkedCount === this.idList.length && checkedCount > 0;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.idList.length;
      // this.checkedItemStatus = checkedCount === this.idList.length;
    },
    //选中某一项
    addCheckdItem(val) {
      this.checkedList.push(val);
      this.checkedAllStatus();
    },
    //不选中某一项动态
    reduceCheckdItem(val) {
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i] === val) {
          this.checkedList.splice(i, 1);
        }
      }
      this.checkedAllStatus();
    },
    //删除多项
    deleteItems() {
      if (this.checkedList.length === 0) {
        this.$message.warning("请选择要删除的项");
        return;
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/batchDeletePhotos", {
              params: { photoIds: this.checkedList },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getList();
                this.checkedAllStatus();
              }
            });
        })
        .catch(() => {});
    },
    //删除某一项
    deleteItem(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/photoAlbum/manage/batchDeletePhotos", {
              params: { photoIds: [val] },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                if (this.checkedList.length > 0) {
                  this.reduceCheckdItem(val);
                }
                this.page.total = this.page.total - 1;
                for (let i = 0; i < this.list.length; i++) {
                  if (this.list[i].id === val) {
                    this.list.splice(i, 1);
                  }
                }
                for (let i = 0; i < this.idList.length; i++) {
                  if (this.idList[i] === val) {
                    this.idList.splice(i, 1);
                  }
                }
                this.checkedAllStatus();
              }
            });
        })
        .catch(() => {});
    },
    //单个转移
    transferPictureVisible(id) {
      this.pictureTransferVisible = true;
      this.transferId = id;
    },
    cancelTransfer() {
      if (this.transferId) {
        this.transferId = "";
      }
      this.pictureTransferVisible = false;
    },
    transferPicture() {
      if (this.transferId) {
        this.$request
          .put("/api/admin/photoAlbum/manage/transferPhotos", {
            toAlbumId: this.albumId,
            photoIds: [this.transferId],
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("转移成功");
              this.pictureTransferVisible = false;
              this.getList();
              this.checkedAllStatus();
            }
          });
      } else {
        this.$request
          .put("/api/admin/photoAlbum/manage/transferPhotos", {
            toAlbumId: this.albumId,
            photoIds: this.checkedList,
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("转移成功");
              this.pictureTransferVisible = false;
              this.getList();
              this.checkedAllStatus();
            }
          });
      }
    },
  },
};
</script>

<style lang="less">
.picItem {
  width: 297px;
  height: 252px;
  box-shadow: 0px 2px 8px 0px rgba(145, 150, 164, 0.22);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 17px 16px 0;
  .picture {
    width: 100%;
    height: 170px;

    .checkbox {
      right: 5px;
      top: 5px;
    }

    .pictureModel {
      display: none;
    }

    &:hover .pictureModel {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: block;

      .operate {
        width: 129px;
        height: 26px;
        line-height: 26px;
        border-radius: 13px;
        border: 1px solid rgba(192, 200, 200, 1);
        right: 16px;
        bottom: 16px;
        overflow: hidden;

        .operateBtn {
          width: 64px;
          height: 26px;
          box-sizing: border-box;
          padding: 3px 8px;
          line-height: 20px;
          color: #ffffff;
          font-size: 12px;
        }
      }
    }
  }

  .albumTitle {
    width: 230px;
    height: 50px;
    line-height: 25px;
    box-sizing: border-box;
    padding: 0 16px;
    margin-top: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
