<template>
  <el-container class="absolute-fill-parent" v-loading="loading">
    <el-main v-if="list.length>0" class="unset-padding tableWrap">
      <vue-scroll>
        <div class="albumTable">
          <div class="albumTable-inner flex flex-wrap" style="padding: 10px 20px;">
            <div class="albumItem position-relative" v-for="item in list" :key="item.id">
              <album-item :menuList="menuList" :albumInfo="item" :albumCheckedItemStatus="checkedItemStatus" @refresh="getList" @addCheckdItem="addCheckdItem" :chosen-group="chosenGroup" @reduceCheckdItem="reduceCheckdItem"
                @deleteItem="deleteItem" />
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
                <el-checkbox :indeterminate="isIndeterminate" :disabled="list.length === 0" v-model="checkedAll" @change="checkAllChange">全选
                </el-checkbox>
              </li>
              <li @click="updateAlbumStatus(true)">启用</li>
              <li @click="updateAlbumStatus(false)">禁用</li>
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
  </el-container>
</template>

<script>
import BatchOperation from "../../../../../util/BatchOperation";
import AlbumItem from "./AlbumItem";
import NoData from "../../../../../util/noData/NoData";

export default {
  name: "AlbumTable",
  components: { NoData, BatchOperation, AlbumItem },
  props: {
    searchTitle: String,
    dateRange: Array,
    chosenGroupId: String,
    refresh: Boolean,
    refreshItem: String,
    chosenGroup: {
      type: Object,
      default() {
        return {};
      },
    },
    menuList:Array
  },
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
      checkedItemStatus: false,

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
    dateRange(){
      this.getList();
    },
    chosenGroupId() {
      this.getList();
    },
    refreshItem() {
      if (this.refreshItem === "albumTable") {
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
      var params = {
        searchTitle: this.searchTitle,
        limit: this.page.pageSize,
        offset: this.page.pageSize * (this.page.currentPage - 1),
        categoryId: this.chosenGroupId === "0" ? "" : this.chosenGroupId
      }
      if(this.dateRange&&this.dateRange.length){
        params.startTime = this.dateRange[0]
        params.endTime = this.dateRange[1]
      }
      if (this.chosenGroupId||this.chosenGroupId == "0") {
        this.$request.get("/api/admin/photoAlbum/manage/getPhotoAlbums", { params }).then((res) => {
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
      this.pageSize = val;
      this.page.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    checkAllChange(val) {
      this.checkedList = val ? JSON.parse(JSON.stringify(this.idList)) : [];
      this.isIndeterminate = false;
      this.checkedItemStatus = val;
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
            .delete("/api/admin/photoAlbum/manage/deletePhotoAlbum", {
              params: { photoAlbumIds: this.checkedList },
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
            .delete("/api/admin/photoAlbum/manage/deletePhotoAlbum", {
              params: { photoAlbumIds: [val] },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
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
                if (this.checkedList && this.checkedList.length > 0) {
                  this.reduceCheckdItem(val);
                }
              }
            });
        })
        .catch(() => {});
    },
    //批量启用禁用
    updateAlbumStatus(status) {
      if (this.checkedList.length === 0) {
        this.$message.warning(`请选择要${status ? "启用" : "禁用"}的项`);
        return;
      }
      this.$request.put("/api/admin/photoAlbum/manage/updatePhotoAlbumStatus", {
          albumIds: this.checkedList,
          inUsed: status,
        })
        .then((res) => {
          if (res.success) {
            this.$message.success(`${status ? "启用" : "禁用"}成功`);
            this.getList();
            this.checkedAllStatus();
          }
        });
    },
  },
};
</script>

<style lang="less">
.albumItem {
  width: 297px;
  height: 298px;
  margin: 0 17px 16px 0;
  box-shadow: 0px 2px 8px 0px rgba(145, 150, 164, 0.22);
  border-radius: 2px;
  overflow: hidden;
  .albumCover {
    width: 100%;
    height: 170px;
    .backModel {
      width: 100%;
      left: 0;
      bottom: 0;
      height: 42px;
      background-color: rgba(0, 0, 0, .3);
      display: block;
      line-height: 42px;
      .themetitle{
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .albumTheme {
        width: 100%;
        height: 42px;
        line-height: 42px;
        box-sizing: border-box;
        padding: 0 16px;
        left: 0;
        bottom: 0;
        color: #FFFFFF;
      }
    }

  }

  .albumTitle {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    color: #4A4A4A;
    border-bottom: 1px solid #E0E3E6;
  }

  .albumOperate {
    width: 100%;
    box-sizing: border-box;
    line-height: 48px;
    padding: 0 15px 0 18px;
  }
}
</style>
