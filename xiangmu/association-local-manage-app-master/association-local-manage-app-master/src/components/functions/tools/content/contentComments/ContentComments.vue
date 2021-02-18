<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="elhead" height="auto" style="padding: 20px 20px 0;align-items:center;">
      <el-tabs v-model="filterObj.status">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="审核通过" name="1"></el-tab-pane>
        <el-tab-pane label="审核拒绝" name="2"></el-tab-pane>
      </el-tabs>
      <div class="btnrow">
        <div class="flex-fill-in-the-remaining-space flex">
          <div class="flex flexwrap">
            <el-input class="w330" v-model="filterObj.searchContent" size="small" placeholder="搜索评论内容/评论对象标题/用户昵称/用户姓名" clearable />
            <el-select v-model="filterObj.contentType" size="small" placeholder="下拉选择对象类型" clearable>
              <el-option label="图文" :value="0"></el-option>
              <el-option label="视频" :value="4"></el-option>
              <el-option label="音频" :value="8"></el-option>
            </el-select>
            <el-date-picker v-model="filterObj.dateRange" size="small" type="daterange" range-separator="至" start-placeholder="发布开始日期" end-placeholder="发布结束日期" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div>
        <div class="switchbox">
          <div>
            <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
              <div slot="content">开启人工审核，用户评论发布后需通过后台审核才会在前端展示<br />关闭人工审核，用户评论发布后会立即展示在前端</div>
              <i class="el-icon-info"></i>
            </el-tooltip>是否开启审核：
          </div>
          <el-switch @change="changeAudit" v-model="commentAudit" active-color="#3FA1B6" inactive-color="#ff4949"></el-switch>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-table :data="list" class="custom-el-table header-gray" size="small" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="评论内容" prop="content" show-overflow-tooltip></el-table-column>
        <el-table-column label="评论对象" show-overflow-tooltip>
          <template v-slot="{row}">
            <span @click="toDetails(row)" class="canClick">《{{row.title}}》</span>
          </template>
        </el-table-column>
        <el-table-column label="对象类型">
          <template v-slot="{row}">
            <span>{{row.contentType|contentType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickName" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户姓名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="评论状态" width="100px">
          <template v-slot="{row}">
            <span>{{row.status | statusText}}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" width="150px">
          <template v-slot="{row}">
            <span>{{row.createTime | yyyyMMddHHmmss}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="190px">
          <template v-slot="{row}">
            <el-button type="text" size="small" class="unset-padding custom-el-button danger" v-if="row.status==0||row.status==1" @click="rejectComment(row.id)">拒绝
            </el-button>
            <el-button type="text" size="small" class="unset-padding custom-el-button" v-if="row.status==0||row.status==2" @click="passComment(row.id)">通过
            </el-button>
            <el-button type="text" size="small" class="unset-padding custom-el-button danger" @click="deleteComment(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="flex flex-column flex-center">
      <div class="flex">
        <div>
          <batch-operation>
            <li @click="deleteSelect">删除所选</li>
            <li @click="rejectSelect">拒绝所选</li>
            <li @click="passSelect">通过所选</li>
          </batch-operation>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-right">
          <el-pagination size="small" :page-sizes="[10,20,50,100]" layout="total, sizes, prev, pager, next, jumper" :page-size="page.pageSize" :current-page="page.currentPage" :total="page.total" background
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
    </el-footer>

    <el-dialog :visible.sync="videoDisplayVisible" title="视频播放" append-to-body width="600px">
        <video-display v-if="videoDisplayVisible" :content="videoContent" videoWidth="560px"
                        videoHeight="300px"></video-display>
    </el-dialog>
    <el-dialog :visible.sync="audioDisplayVisible" title="音频播放" append-to-body width="600px">
        <audio style="width: 100%;" v-if="audioDisplayVisible" :src="audioContent.linkAddress" autoplay controls></audio>
    </el-dialog>
  </el-container>
</template>

<script>
import BatchOperation from "@/components/util/BatchOperation";
import {requestBaseUrl} from "@/js/config/serviceConfig";
import VideoDisplay from "../contentManage/util/VideoDisplay";

export default {
  name: "ContentComments",
  components: { BatchOperation,VideoDisplay },
  data() {
    return {
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
      },
      list: [],
      ids: [],
      filterObj: {
        status: "-1",
        contentType:"",
        searchContent:""
      },
      commentAudit: false,
      download: requestBaseUrl + '/api/common/content/anon/download/',
      videoDisplayVisible: false,
      videoContent: {},
      audioDisplayVisible: false,
      audioContent: {}
    };
  },
  filters: {
    statusText(val) {
      if (val == 0) {
        return "待审核";
      } else if (val == 1) {
        return "已通过";
      } else if (val == 2) {
        return "已拒绝";
      }
    },
    contentType(val){
      if (val == 4) {
        return "视频";
      } else if (val == 8) {
        return "音频";
      } else {
        return "图文";
      }
    }
  },
  watch:{
    filterObj:{
      deep:true,
      handler(){
        this.refreshList();
      }
    },
  },
  created() {
    this.getList();
    this.$request.get("/api/common/setting/anon/getCommonSetting", { params:{type:19} }).then((res) => {
      this.commentAudit = res.data.commentAudit
    });
  },
  methods: {
    toDetails(row){
      console.log(row)
      if(row.contentType==0 || row.contentType === 6 || row.contentType === 7){
        const {href} = this.$router.resolve(`/contentDetail/${row.contentId}`)
        window.open(href, '_blank')
      }else if(row.contentType === 1 || row.contentType === 3){
        window.open(row.linkAddress, '_blank')
      }else if(row.contentType === 2){
        const {href} = this.$router.resolve(`/contentDetail/${row.otherId}`)
        window.open(href, '_blank')
      }else if(row.contentType === 4){
        this.videoDisplayVisible = true;
        this.videoContent = row;
      }else if(row.contentType === 5){
        const {href} = this.$router.resolve(`/contentDetail/${row.otherId}`)
        window.open(this.download+row.id, '_blank')
      }else if(row.contentType === 8){
        this.audioDisplayVisible = true;
        this.audioContent = row;
      }
    },
    changeAudit(val){
      this.$request.post('/api/admin/settings/manage/updateCommentSettings',{commentAudit:val}).then(()=>{
        this.$message.success((val?'开启':'关闭')+'审核成功');
      })
    },
    refreshList(){
      this.page.currentPage = 1;
      this.getList();
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
    getList() {
      var params = {
        limit: this.page.pageSize,
        offset: this.page.pageSize * (this.page.currentPage - 1),
        searchContent:this.filterObj.searchContent,
        contentType: this.filterObj.contentType
      }
      if(this.filterObj.status!="-1"){
        params.status = this.filterObj.status
      }
      if(this.filterObj.dateRange&&this.filterObj.dateRange.length>1){
        params.dateRange = this.filterObj.dateRange
      }
      this.$request.get("/api/admin/comment/content/comments", { params }).then((res) => {
        if (res.success) {
          this.list = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    deleteComment(id) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/comment/deleteComment", {
              params: {
                id: id,
              },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getList();
              }
            });
        })
        .catch(() => {});
    },
    batchVerifyComments(ids, pass, mess) {
      this.$request
        .put("/api/admin/comment/batchVerifyComments", null, {
          params: { ids, pass },
        })
        .then((res) => {
          if (res.success) {
            this.$message.success(mess);
            this.getList();
          }
        });
    },
    passComment(id) {
      this.batchVerifyComments([id], true, "审核通过");
    },
    rejectComment(id) {
      this.batchVerifyComments([id], false, "审核拒绝");
    },
    handleSelectionChange(val) {
      this.ids = [];
      for (let item of val) {
        this.ids.push(item.id);
      }
    },
    rejectSelect() {
      if (this.ids && this.ids.length === 0) {
        this.$message.warning("请选择要拒绝的项");
        return;
      }
      this.batchVerifyComments(this.ids, false, "审核拒绝");
    },
    passSelect() {
      if (this.ids && this.ids.length === 0) {
        this.$message.warning("请选择要通过的项");
        return;
      }
      this.batchVerifyComments(this.ids, true, "审核通过");
    },
    deleteSelect() {
      if (this.ids && this.ids.length === 0) {
        this.$message.warning("请选择要删除的项");
        return;
      }

      this.$confirm("此操作将永久删除所选评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/comment/batchDeleteComments", {
              params: { ids: this.ids },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getList();
              }
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.elhead {
  .w330 {
    width: 330px;
    margin-right: 15px;
  }
  .el-select {
    margin-right: 15px;
  }
  .flex-fill-in-the-remaining-space {
    padding-right: 15px;
  }
  .btnrow {
    display: flex;
    align-items: center;
    .switchbox {
      display: flex;
    }
  }
}
</style>
