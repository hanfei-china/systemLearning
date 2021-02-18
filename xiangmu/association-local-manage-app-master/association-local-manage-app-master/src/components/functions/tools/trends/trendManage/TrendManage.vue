<template>
  <el-container class="absolute-fill-parent background-color-white trendManage" style="padding: 0 20px;">
    <el-header class="flex header filterHeader unset-padding" style="line-height: 60px;">
      <div class="marginDistance">
        <el-dropdown trigger="click" @command="selectDropDowmItem">
          <span class="el-dropdown-link">{{dropDowmItem}}<i class="el-icon-arrow-down el-icon--right" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in dropDowmItems" :key="item.label" :command="item">
              {{item.value}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="marginDistance">
        <el-input class="input-short" size="small" prefix-icon="el-icon-search" placeholder="搜索用户昵称、姓名、手机号" v-model="searchContent" @blur="getTrendList" />
      </div>
      <div class="marginDistance">
        <span>发布时间：</span>
        <el-date-picker class="date-short" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="timeRange" clearable format="yyyy-MM-dd" @change="getTrendList" />
      </div>

      <div class="switchbox">
        <div>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">开启人工审核，用户动态发布后需通过后台审核才会在前端展示<br />关闭人工审核，用户动态发布后会立即展示在前端</div>
            <i class="el-icon-info"></i>
          </el-tooltip>是否开启审核：
        </div>
        <el-switch @change="changeAudit" v-model="userTrendAudit" active-color="#3FA1B6" inactive-color="#ff4949"></el-switch>
      </div>
    </el-header>

    <el-main v-if="trendList.length>0" class="trendWrap unset-padding">
      <vue-scroll>
        <div class="trendList">
          <div class="trendInner flex flex-wrap">
            <div class="dynamicItem" v-for="item in trendList" :key="item.id">
              <trend-item :trendItem="item" :checkedItemStatus="checkedItemStatus" @addCheckdItem="addCheckdItem" @reduceCheckdItem="reduceCheckdItem" @passComment="passComment" @rejectComment="rejectComment" @deleteItem="deleteItem" />
            </div>
          </div>
        </div>
      </vue-scroll>
    </el-main>
    <el-main v-else class="position-relative">
      <div class="position-absolute nodata_image">
        <img src="../../../../../assets/nodata.png" style="width: 100%;height: 100%;">
      </div>
    </el-main>
    <el-footer class="unset-padding">
      <div class="flex" style="padding-top: 12px;">
        <div class="flex-fill-in-the-remaining-space">
          <batch-operation title="更多操作">
            <template>
              <li>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAllChange" :disabled="trendList.length === 0">全选
                </el-checkbox>
              </li>
              <li @click="deleteItems">删除</li>
              <li @click="rejectSelect">拒绝</li>
              <li @click="passSelect">通过</li>
            </template>
          </batch-operation>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-right">
          <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="trendTotal">
          </el-pagination>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import BatchOperation from "../../../../util/BatchOperation";
import TrendItem from "./TrendItem";

export default {
  name: "TrendManage",
  components: { BatchOperation, TrendItem },
  data() {
    return {
      dropDowmItems: [
        {
          label: "0",
          value: "发布时间倒序",
        },
        {
          label: "1",
          value: "发布时间正序",
        },
        {
          label: "2",
          value: "点赞数从高到低",
        },
        {
          label: "3",
          value: "点赞数从低到高",
        },
        {
          label: "4",
          value: "评论数从高到低",
        },
        {
          label: "5",
          value: "评论数从低到高",
        },
        {
          label: "6",
          value: "待审核优先",
        },
      ],
      dropDowmItem: "待审核优先",
      orderWay: "6", //排序方式
      searchContent: "", //搜索内容
      timeRange: [], //开始时间结束时间
      pageSize: 20, //每页条数
      currentPage: 1, //当前页数
      checkedAll: false, //全选
      isIndeterminate: false, //开启全选
      checkedItemStatus: false, //某一项是否选中
      checkedList: [], //选中id的列表
      trendIdList: [], //动态id列表
      trendList: [], //动态列表
      trendTotal: 0, //列表数量
      userTrendAudit:false
    };
  },
  created() {
    this.getTrendList();
    this.$request.get("/api/common/setting/anon/getCommonSetting", { params:{type:19} }).then((res) => {
      this.userTrendAudit = res.data.userTrendAudit
    });
  },
  methods: {
    changeAudit(val){
      this.$request.post('/api/admin/settings/manage/updateCommentSettings',{userTrendAudit:val}).then(()=>{
        this.$message.success((val?'开启':'关闭')+'审核成功');
      })
    },
    selectDropDowmItem(command) {
      this.dropDowmItem = command.value;
      this.orderWay = command.label;
      this.getTrendList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTrendList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTrendList();
    },
    //全选
    checkAllChange(val) {
      this.checkedList = val ? this.trendIdList : [];
      this.isIndeterminate = false;
      this.checkedItemStatus = val;
    },
    //选择某一项动态
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
    //全选状态
    checkedAllStatus() {
      let checkedCount = this.checkedList.length;
      this.checkedAll =
        checkedCount === this.trendList.length && checkedCount > 0;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.trendList.length;
      // this.checkedItemStatus = checkedCount === this.trendList.length;
    },
    //获取动态列表
    getTrendList() {
      this.checkedList = [];
      this.checkedAll = false;
      this.trendIdList = [];
      let params = {
        timeRange: this.timeRange,
        limit: this.pageSize,
        offset: this.pageSize * (this.currentPage - 1),
        orderWay: this.orderWay,
        searchContent: this.searchContent,
      };

      this.$request
        .post("/api/admin/trend/listTrendByAdminCondition", params)
        .then((res) => {
          if (res.success) {
            this.trendList = res.data.list;
            this.trendTotal = res.data.total;

            this.trendList.map((item) => {
              this.$set(item, "checkedItem", false);
            });

            for (let i = 0; i < this.trendList.length; i++) {
              this.trendIdList.push(this.trendList[i].id);
            }

            this.checkedAllStatus();
          }
        });
    },
    passComment(id) {
      this.batchVerifyComments([id], true, "审核通过");
    },
    rejectComment(id) {
      this.batchVerifyComments([id], false, "审核拒绝");
    },
    rejectSelect() {
      if (this.checkedList && this.checkedList.length === 0) {
        this.$message.warning("请选择要拒绝的项");
        return;
      }
      this.batchVerifyComments(this.checkedList, false, "审核拒绝");
    },
    passSelect() {
      if (this.checkedList && this.checkedList.length === 0) {
        this.$message.warning("请选择要通过的项");
        return;
      }
      this.batchVerifyComments(this.checkedList, true, "审核通过");
    },
    batchVerifyComments(ids, pass, mess) {
      this.$request
        .put("/api/admin/trend/batchVerifyTrends", null, {
          params: { ids, pass },
        })
        .then((res) => {
          if (res.success) {
            this.$message.success(mess);
            this.getTrendList();
            this.checkedList = [];
          }
        });
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
            .delete("/api/admin/trend/batchDeleteTrend", {
              params: { trendIds: this.checkedList },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getTrendList();
                this.checkedList = [];
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
            .delete("/api/admin/trend/batchDeleteTrend", {
              params: { trendIds: [val] },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                if (this.checkedList.length > 0) {
                  this.reduceCheckdItem(val);
                }
                this.trendTotal = this.trendTotal - 1;
                for (let i = 0; i < this.trendList.length; i++) {
                  if (this.trendList[i].id === val) {
                    this.trendList.splice(i, 1);
                  }
                }
                for (let i = 0; i < this.trendIdList.length; i++) {
                  if (this.trendIdList[i] === val) {
                    this.trendIdList.splice(i, 1);
                  }
                }
                this.checkedAllStatus();
              }
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.header{
  .switchbox{
    margin-left: auto;
    display: flex;
    align-items: center;
  }
}
</style>
