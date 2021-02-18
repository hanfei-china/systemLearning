<template>
  <div class="branchTabel">
    <div class="branchTabelSearch">
      <el-input
        v-model="searchForm.searchContent"
        style="width:200px;marginRight:20px;"
        placeholder="搜索分会名称/负责人姓名"
        size="small"
        prefix-icon="el-icon-search"
      ></el-input>
      <el-date-picker
        v-model="searchForm.time"
        style="width:300px;"
        size="small"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <div class="branchTabelHeader">
      <el-button
        size="small"
        style="borderColor:#3FA1B6;color:#fff;backgroundColor: #3FA1B6;"
        @click="$emit('addBranch',false)"
      >新建</el-button>
      <el-button size="small" style="borderColor:#3FA1B6;color:#3FA1B6;" @click="modifyDelet">删除</el-button>
      <el-button
        size="small"
        style="borderColor:#3FA1B6;color:#3FA1B6;"
        @click="branchImportVisible=true"
      >导入</el-button>
      <el-button size="small" style="borderColor:#3FA1B6;color:#3FA1B6;" @click="downLoad">导出</el-button>
    </div>
    <div class="branchTabelList">
      <el-table
        @selection-change="handleSelectionChange"
        :data="brachList"
        border
        height="700"
        style="width: 100%;"
        :header-cell-style="{'background':'#f9f9f9','color':'#626262'}"
      >
        <el-table-column fixed="left" type="selection" width="55" align="center"></el-table-column>
        <!-- <el-table-column label="是否启用" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.isUsed?'启用':'不启用'}}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="name" label="分会名称" width="120" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="成员数量" width="80" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.memberCount">0</span>
            <span v-else>{{scope.row.memberCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="branchActivities"
          label="活动数量"
          width="80"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="e" label="分会地址" width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
<!--            <span-->
<!--                v-if="JSON.parse(scope.row.address)&&JSON.parse(scope.row.address).length===4"-->
<!--            >{{ JSON.parse(scope.row.address)[0] + "-" + JSON.parse(scope.row.address)[1] + "-" + JSON.parse(scope.row.address)[2] + "-" + JSON.parse(scope.row.address)[3] }}</span>-->
<!--            <span-->
<!--                v-if="JSON.parse(scope.row.address)&&JSON.parse(scope.row.address).length===3"-->
<!--            >{{ JSON.parse(scope.row.address)[0] + "-" + JSON.parse(scope.row.address)[1] + "-" + JSON.parse(scope.row.address)[2] }}</span>-->
<!--            <span-->
<!--                v-if="JSON.parse(scope.row.address)&&JSON.parse(scope.row.address).length===2"-->
<!--            >{{ JSON.parse(scope.row.address)[0] + "-" + JSON.parse(scope.row.address)[1] }}</span>-->
<!--            <span-->
<!--                v-if="JSON.parse(scope.row.address)&&JSON.parse(scope.row.address).length===1"-->
<!--            >{{ JSON.parse(scope.row.address)[0] }}</span>-->
            <!-- <span>{{scope.row.address[0]}}-{{scope.row.address[1]}}</span> -->
            {{transArea(scope.row.address)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="分会简介"
          width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="responsibility"
          label="分会负责人"
          width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactPerson"
          label="联系人"
          width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
          width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="分会管理员" width="140" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-for="item in scope.row.managers" :key="item.id">{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建方式" width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.createType===1">管理端创建</span>
            <span v-if="scope.row.createType===2">申请创建</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | yyyyMMddHHmmss}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="color:#3FA1B6;"
              @click="editBranch(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              style="color:red;"
              @click="branchDelete(scope.row.id)"
            >删除</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              style="color:#3FA1B6;"
              @click="$emit('showBranch',scope.row)"
            >查看</el-button>-->
            <el-button
              size="mini"
              type="text"
              style="color:#3FA1B6;"
              @click="toBranchManage(scope.row.id)"
            >管理</el-button>
            <el-button
              size="mini"
              type="text"
              style="color:#3FA1B6;"
              @click="showCode(scope.row.id)"
            >二维码</el-button>
            <!-- <el-button v-if="scope.row.managerIDs.indexOf(loginUserInfo.adminId)>=0" size="mini" type="text" style="color:#3FA1B6;" @click="toBranchManage(scope.row.id)">分会管理</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="branchTabelPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="nowPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 二维码展示框 -->
    <el-dialog title="分会二维码" :visible.sync="codeTableVisible" width="520px" append-to-body>
      <div class="branchCodeVosoble">
        <img :src="codeShowSrc" class="branchCodeVosoble-img" />
        <div style="fontSize:16px;">
          <span style="color:#3FA1B6;cursor:pointer;" @click="downloadCode">点击这里</span>
          <!-- <a :href="codeShowSrc" style="color:#3FA1B6;cursor:pointer;" download="image.jpg">点击这里</a> -->
          <span style="color:#626262;">打开此二维码，可保存此二维码， 微信扫描二维码申请加入该分会</span>
        </div>
      </div>
    </el-dialog>
    <!-- 导入文件 -->
    <import-file
      @queryTable="refreshMembers"
      @refresh-members="refreshMembers"
      :visible.sync="branchImportVisible"
      title="分会导入"
    ></import-file>
  </div>
</template>

<script>
import importFile from "./importFile";
import { requestBaseUrl } from "../../../../js/config/serviceConfig";
import { exportExcel } from "../../../../js/util/exportFile";
import Vue from "vue";
import {objectArraySplit} from '@/js/util/utilFunction'
export default {
  name: "branchTabel",
  props: ["selectBranch"],
  components: { importFile },
  data() {
    return {
      searchForm: {
        time: [],
        searchContent: "",
        limit: 10
      },
      total: 0,
      brachList: [],
      nowPage: 1,
      selection: [],
      codeTableVisible: false,
      codeShowSrc: "",
      branchImportVisible: false
    };
  },
  computed: {
    loginUserInfo() {
      return this.$store.state.loginUser;
    }
  },
  watch: {
    selectBranch(val) {
      this.nowPage = 1;
      this.getBranchList();
    },
    "searchForm.searchContent"(val) {
      this.nowPage = 1;
      this.getBranchList();
    },
    "searchForm.time"(val) {
      if (val) {
        this.searchForm.time[0] = this.$options.filters["yyyyMMdd"](val[0]);
        this.searchForm.time[1] = this.$options.filters["yyyyMMdd"](val[1]);
        this.getBranchList(true);
      } else {
        this.getBranchList();
      }
    }
  },
  created() {
    this.getBranchList();
  },
  methods: {
    transArea(val){
      return objectArraySplit(val)
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleSizeChange(size) {
      // console.log(size);
      this.searchForm.limit = size;
      this.nowPage = 1;
      this.getBranchList();
    },
    handleCurrentChange(page) {
      // console.log(page);
      this.nowPage = page;
      this.getBranchList();
    },
    getBranchList(data) {
      let params = {
        limit: this.searchForm.limit,
        offset: (this.nowPage - 1) * this.searchForm.limit,
        branchClass: this.selectBranch === "all" ? "" : this.selectBranch,
        searchContent: this.searchForm.searchContent,
        needMemberCount: true,
        needMain: true
      };
      if (data) {
        params.startTime = this.searchForm.time[0];
        params.endTime = this.searchForm.time[1];
      }
      this.$request
        .get("/api/common/branch/branchList", { params })
        .then(res => {
          this.total = res.data.total;
          this.brachList = JSON.parse(JSON.stringify(res.data.list));
          this.brachList.forEach(item => {
            var arr = [];
            item.managers.forEach(manager => {
              arr.push(manager.id);
            });
            item.managerIDs = arr;
          });
        });
    },
    //批量删除
    modifyDelet() {
      if (this.selection.length === 0) {
        this.$message({
          message: "请先选择要删除的分会",
          type: "warning"
        });
        return;
      }
      this.$confirm("确定要删除此分会吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var ids = [];
          this.selection.forEach(item => {
            ids.push(item.id);
          });
          this.$request
            .put("/api/admin/branch/batchDeleteBranch", { ids })
            .then(res => {
              if (res.success) {
                this.getBranchList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.updataBranchList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分会删除操作
    branchDelete(id) {
      this.$confirm("确定要删除此分会吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request
            .delete("/api/admin/branch", {
              params: {
                id
              }
            })
            .then(res => {
              // console.log(res);
              if (res.success) {
                this.getBranchList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.updataBranchList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //左边分会列表刷新
    updataBranchList() {
      this.$emit("updataList", this.selectBranch);
    },
    //点击二维码按钮
    showCode(id) {
      this.$request
        .get("/api/admin/branch/invitationCode?branchId=" + id)
        .then(res => {
          // console.log(res);
          this.codeShowSrc = res.data;
          this.codeTableVisible = true;
        });
    },
    //下载二维码
    downloadCode() {
      window.open(this.codeShowSrc);
    },
    //点击分会编辑按钮
    editBranch(info) {
      this.$emit("addBranch", true, info);
    },
    //导出数据
    downLoad() {
      let params = {
        branchClass: this.selectBranch === "all" ? "" : this.selectBranch,
        searchContent: this.searchForm.searchContent,
        needMemberCount: true,
        startTime: this.searchForm.time[0] || "",
        endTime: this.searchForm.time[1] || ""
      };
      params.ids=[];
      this.selection.forEach(item=>{
        params.ids.push(item.id)
      })
      // var url =
      //   requestBaseUrl +
      //   "/api/admin/branch/exportBranchExcelDate?branchClass=" +
      //   params.branchClass +
      //   "&searchContent=" +
      //   params.searchContent +
      //   "&needMemberCount=true&startTime=" +
      //   params.startTime +
      //   "&endTime=" +
      //   params.endTime;
      // window.open(url);
      this.$request
        .post("/api/admin/branch/exportBranchExcelDate", params, {
          responseType: "blob"
        })
        .then(resp => {
          exportExcel(resp);
          // this.$nextTick(()=>{ this.loading = false; })
          // this.$emit("close");
        });
    },
    //刷新页面
    refreshMembers() {
      this.getBranchList();
      this.updataBranchList();
    },
    //跳转至分会管理
    toBranchManage(id) {
      // this.$router.push('/branchEditView');
      this.$request
        .post("/api/admin/branch/importSessionBranchId?branchId=" + id)
        .then(res => {
          let routeUrl = this.$router.resolve({
            path: "/branchEditView/" + id
          });
          window.open(routeUrl.href, "_blank");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.branchTabel {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .branchTabelHeader {
    padding: 0 15px;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid #dcdfe6;
    color: #333333;
  }
  .branchTabelSearch {
    display: flex;
    padding: 10px 15px;
    margin-top: 10px;
  }
  .branchTabelList {
    flex: 1;
    overflow-y: auto;
    padding: 10px 15px;
    // height: 650px;
    // overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
  }
  .branchTabelPage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
  }
}

.branchCodeVosoble {
  height: 237px;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  padding-left: 26px;
  padding-right: 40px;
  .branchCodeVosoble-img {
    width: 150px;
    height: 150px;
    margin-right: 39px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
  }
}
</style>
