<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-aside class="position-relative border-right" width="200px">
      <!-- <system-role-menu ref="roles"  @openEditRole="openEditRole" @deleteRole="deleteRole"/> -->
      <CollegeMenu @select="setChosenRole"></CollegeMenu>
    </el-aside>
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent">
        <el-main class="unset-padding position-relative">
          <el-container class="absolute-fill-parent">
            <el-header class="flex flex-column flex-center">
              <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                  <el-input style="width: 250px;" v-model="searchContent" placeholder="搜索用户名/姓名/手机号" size="small" clearable />
                  <el-date-picker style="margin-left:20px;" v-model="dateRange" size="small" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                </div>
                <div style="line-height: 33px;">
                  <el-button size="small" type="text" class="unset-padding theme-color" icon="el-icon-connection" @click="relevantFormVisible = true">关联用户</el-button>
                  <el-button size="small" :disabled="multipleSelection.length < 1" type="text" class="custom-el-button danger unset-padding" icon="el-icon-delete" @click="cancelLink(null)">批量取消关联</el-button>
                </div>
              </div>
            </el-header>
            <el-main class="unset-vertical-padding position-relative">
              <el-table class="custom-el-table" height="100%" size="small" border :data="list" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" fixed/>
                <el-table-column label="序号" fixed type="index" align="center" width="50" />
                <el-table-column label="用户名" prop="loginName" min-width="150" show-tooltip-when-overflow />
                <el-table-column label="姓名" prop="name" min-width="150" show-tooltip-when-overflow />
                <el-table-column label="性别">
                  <template v-slot="{ row }">{{row.sex|sexFilter}}</template>
                </el-table-column>
                <el-table-column label="手机号" prop="telephone" width="130" show-tooltip-when-overflow />
                <el-table-column label="邮箱" prop="email" min-width="140" show-tooltip-when-overflow />
                <el-table-column label="创建时间" width="140" show-tooltip-when-overflow>
                  <template v-slot="{ row }">
                    {{ row.createTime | yyyyMMddHHmm }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120px">
                  <template v-slot="{ row }">
                    <el-button class="custom-el-button danger unset-padding" type="text" @click="cancelLink(row.id)">解除关联</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer height="auto">
              <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
                <div class="flex-fill-in-the-remaining-space"></div>
                <div>
                  <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50]" @size-change="sizeChange"
                    @current-change="currentChange" />
                </div>
              </div>
            </el-footer>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
    <el-dialog :title="formTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="680px" append-to-body>
      <account-form v-if="formVisible" :id="formId" @close="formVisible = false" @refresh="refresh" />
    </el-dialog>

    <el-dialog title="关联用户" :visible.sync="relevantFormVisible" width="600px" append-to-body :close-on-click-modal="false">
      <system-role-relevant-admin-user-list v-if="relevantFormVisible" :role-id="chosenRole.id" @close="relevantFormVisible = false" @refresh="getList"/>
    </el-dialog>
  </el-container>
</template>

<script>
import AccountForm from "./CollegeForm";
// import DeptManage from "../deptManage/DeptManage";
import CollegeMenu from "./CollegeMenu";
import SystemRoleRelevantAdminUserList from "./SystemRoleRelevantAdminUserList";
export default {
  name: "CollegeManage",
  components: { AccountForm,CollegeMenu,SystemRoleRelevantAdminUserList },
  data() {
    return {
      page: {
        pageSize: 20,
        pageNum: 1,
      },
      searchContent:"",
      dateRange:[],
      multipleSelection:[],
      list: [],
      total: 0,
      formVisible: false,
      formTitle: "",
      formId: null,
      dept: { id: "" },
      relevantFormVisible:false,
      chosenRole: null
    };
  },
  filters:{
    sexFilter(val){
      if(val){
        if(val==1){
          return "男"
        }else{
          return "女"
        }
      }else{
        return ""
      }
    }
  },
  methods: {
    cancelLink(id) {
      this.$msgbox.confirm("取消关联操作是不可逆的，是否继续？", "提示", {
        type: "warning",
        confirmButtonText: "继续"
      }).then(() => {
        let adminIds = [];
        if (id) {
          adminIds = [id];
        } else {
          this.multipleSelection.map(item => {
            adminIds.push(item.id);
          });
        }
        this.$request.put("/api/admin/college/unbindingAdmin", {adminIds,collegeId: this.chosenRole.id}).then(() => {
          this.refresh();
          this.$message.success("已取消关联");
        });
      }).catch(() => {});
    },
    setChosenRole(val){
      this.chosenRole = val;
      this.refresh()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      if(this.chosenRole){
        let params = {
          collegeId: this.chosenRole.id,
          dateRange:this.dateRange,
          searchContent: this.searchContent,
          limit: this.page.pageSize,
          offset: (this.page.pageNum - 1) * this.page.pageSize,
        };
        this.$request.get("/api/admin/college/getAdminUserByCollege", { params }).then((resp) => {
          let { data } = resp;
          this.list = data.list;
          this.total = data.total;
        });
      }
    },
    refresh() {
      this.page.pageNum = 1;
      this.getList();
    },
    sizeChange(size) {
      this.page.pageSize = size;
      this.refresh();
    },
    currentChange(current) {
      this.page.pageNum = current;
      this.getList();
    },
  },
  watch: {
    searchContent() {
      this.refresh();
    },
    dateRange() {
      this.refresh();
    },
  },
};
</script>
