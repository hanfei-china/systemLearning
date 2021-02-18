<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent">
        <el-main class="unset-padding position-relative">
          <el-container class="absolute-fill-parent">
            <el-header class="flex flex-column flex-center">
              <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                  <el-input style="width: 250px;" v-model="page.keyword" placeholder="搜索用户名/姓名/手机号" size="small" clearable />
                  <el-date-picker style="margin-left:20px;" v-model="dateRange" size="small" type="daterange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                </div>
                <div><el-button class="primaryBtnClass" size="small" @click="addAdminAccount">添加管理员</el-button></div>
              </div>
            </el-header>
            <el-main class="unset-vertical-padding position-relative">
              <el-table class="custom-el-table header-gray" height="100%" size="small" border :data="list">
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
                <el-table-column label="是否启用">
                  <template v-slot="{ row }">
                    <el-switch @change="val=>changeEnabled(val,row)" active-color="#3FA1B6" v-model="row.enabled"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="190px">
                  <template v-slot="{ row }">
                    <el-button v-if="row.adminType !== 1" class="custom-el-button primary unset-padding theme-color" type="text" @click="editAdminAccount(row.id,'1')">编辑信息</el-button>
                    <el-button v-if="row.adminType !== 1" class="custom-el-button danger unset-padding" type="text" @click="deleteAdminAccount(row)">删除</el-button>
                    <el-button v-if="row.adminType !== 1" class="custom-el-button primary unset-padding theme-color" type="text" @click="editAdminAccount(row.id,'2')">修改密码</el-button>
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
    <el-dialog :title="formTitle" :visible.sync="formVisible" :close-on-click-modal="false" width="600px" append-to-body>
      <account-form :editType="editType" v-if="formVisible" :id="formId" @close="formVisible = false" @refresh="refresh" />
    </el-dialog>
  </el-container>
</template>

<script>
import AccountForm from "./AccountForm";
export default {
  name: "AccountManage",
  components: { AccountForm },
  data() {
    return {
      page: {
        pageSize: 20,
        pageNum: 1,
        keyword: "",
      },
      dateRange:[],
      list: [],
      total: 0,
      formVisible: false,
      formTitle: "",
      formId: null,
      dept: { id: "" },
      editType:""
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
    changeEnabled(val,row){
      if(val){
        this.$request.put("/api/admin/account/enableAdmin",null, { params:{adminId:row.id} }).then((resp) => {
          this.$message.success("启用成功")
          this.getList();
        });
      }else{
        this.$request.put("/api/admin/account/disableAdmin",null, { params:{adminId:row.id} }).then((resp) => {
          this.$message.success("取消启用")
          this.getList();
        });
      }
    },
    getList() {
      let deptId = this.dept.id;
      let params = {
        deptId: deptId,
        keyword: this.page.keyword,
        limit: this.page.pageSize,
        offset: (this.page.pageNum - 1) * this.page.pageSize,
        dateRange:this.dateRange
      };
      this.$request.get("/api/admin/account/list", { params }).then((resp) => {
        let { data } = resp;
        this.list = data.list;
        this.total = data.total;
      });
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
    addAdminAccount() {
      this.editType = ""
      this.formTitle = "添加管理员";
      this.formId = null;
      this.formVisible = true;
    },
    editAdminAccount(id,editType) {
      this.formTitle = "修改账号信息";
      this.formId = id;
      this.editType = editType;
      this.formVisible = true;
    },
    deleteAdminAccount(row) {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/account", {
              params: { id: row.id },
            })
            .then((data) => {
              if (data.success) {
                this.$message.success(`账号${row.name}已删除`);
                this.refresh();
              }
            });
        })
        .catch(() => {});
    },
  },
  created() {
    this.getList();
  },
  watch: {
    "page.keyword"() {
      this.refresh();
    },
    dateRange() {
      this.refresh();
    },
  },
};
</script>
