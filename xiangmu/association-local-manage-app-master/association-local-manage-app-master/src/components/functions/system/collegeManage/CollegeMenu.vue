<template>
  <el-container class="absolute-fill-parent">
    <el-header class="flex flex-column flex-center border-bottom" style="padding-top:10px;">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">学院管理</div>
        <div class="flex flex-column flex-center">
          <el-button icon="el-icon-plus" size="mini" type="text" @click="createRole" class="unset-padding theme-color">新增学院</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{ scrollPanel: { scrollingX: false } }">
          <el-menu @select="setChosenRole" class="border-right-unset custom-el-menu" :default-active="chosenRole">
            <el-menu-item v-for="role of list" :index="role.id" :key="role.id" class="cusmenuItem">
              <div class="text-overflow" style="width: 160px;">{{ role.name }}</div>
              <div class="more">
                <i class="el-icon-more"></i>
                <div class="editbox">
                  <p @click="openEditRole(role.id)">编辑</p>
                  <p @click="deleteRole(role.id)">删除</p>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
        </vue-scroll>
      </div>
    </el-main>
    <el-dialog :title="roleFormTitle" :visible.sync="roleFormVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <el-form ref="collegeForm" :model="collegeForm" :rules="collegeRules" label-width="100px">
        <el-form-item label="学院代码" size="small" prop="code">
          <el-input v-model="collegeForm.code" placeholder="请输入学院代码"></el-input>
        </el-form-item>
        <el-form-item label="学院名称" size="small" prop="name">
          <el-input v-model="collegeForm.name" placeholder="请输入学院名称"></el-input>
        </el-form-item>
        <el-form-item label="学院管理员" size="small" prop="adminIds" class="posirela">
          <el-select placeholder="请选择学院管理员" style="width:100%;" v-model="collegeForm.adminIds" multiple filterable remote :remote-method="getRelevantAdminUserList">
            <el-option v-for="admin of adminList" :key="admin.id" :label="admin.name" :value="admin.id"></el-option>
          </el-select>
          <span class="el-icon-circle-plus-outline addmanage" @click="formVisible=true"></span>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="roleFormVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="添加管理员" :visible.sync="formVisible" :close-on-click-modal="false" width="600px" append-to-body>
      <account-form v-if="formVisible" :id="formId" @close="formVisible = false" @refresh="refreshManage" />
    </el-dialog>
  </el-container>
</template>

<script>
import AccountForm from "../accountManage/AccountForm";
export default {
  name: "CollegeMenu",
  components: { AccountForm },
  data() {
    return {
      list: [],
      chosenRole: "",
      roleFormVisible: false,
      roleFormTitle: "",
      roleFormId: "",
      adminList:[],
      collegeForm: {
        code:"",
        name: "",
        adminIds:[]
      },
      collegeRules: {
        name: [ { required: true, message: "请输入学院名称", trigger: "blur" } ]
      },
      formVisible:false,
      formId:""
    };
  },
  methods: {
    refreshManage(id){
      this.collegeForm.adminIds.push(id)
      this.getRelevantAdminUserList()
    },
    openEditRole(id){
      this.roleFormTitle = "编辑学院";
      this.roleFormId = id
      this.$request.get("/api/admin/college/"+id).then((res) => {
        this.collegeForm = res.data
      });
      this.roleFormVisible = true;
    },
    deleteRole(id){
      this.$msgbox.confirm("删除操作是不可逆的，是否继续删除？", "提示", {
        type: "warning",
        confirmButtonText: "确认删除"
      }).then(() => {
        this.$request.delete("/api/admin/college/"+id).then(() => {
          this.$message.success(`删除成功`);
          this.getList();
        });
      }).catch(() => {});
    },
    getRelevantAdminUserList(keyword) {
      this.$request.get("/api/admin/account/list", { params: { keyword } }).then(res => {
        this.adminList = res.data.list;
      });
    },
    getList() {
      this.$request.get("/api/admin/college/getCollegeList").then((res) => {
        this.list = res.data;
        if (res.data.length > 0) {
          if(this.roleFormId){
            this.chosenRole = this.roleFormId;
            let role = this.list.find((item) => item.id === this.roleFormId);
            this.$emit("select", role);
          }else{
            this.chosenRole = res.data[0].id;
          }
        }
      });
    },
    setChosenRole(roleId) {
      this.chosenRole = roleId;
    },
    createRole() {
      this.roleFormTitle = "新增学院";
      this.roleFormId = "";
      this.collegeForm.code = "";
      this.collegeForm.name = "";
      this.collegeForm.adminIds = [];
      this.roleFormVisible = true;
    },
    submitData() {
      this.$refs["collegeForm"].validate(valid=>{
        if(valid){
          if(this.roleFormId){
            this.$request.put("/api/admin/college", this.collegeForm).then(() => {
              this.getList();
              this.roleFormVisible = false;
              this.$message.success("学院修改成功");
            });
          }else{
            this.$request.post("/api/admin/college/addCollege", this.collegeForm).then(() => {
              this.getList();
              this.roleFormVisible = false;
              this.$message.success("学院创建成功");
            });
          }
        }
      })
    },
  },
  created() {
    this.getList();
    this.getRelevantAdminUserList()
  },
  watch: {
    chosenRole(val) {
      let role = this.list.find((item) => item.id === val);
      this.$emit("select", role);
    },
  },
};
</script>
<style lang="less" scoped>
.cusmenuItem {
  line-height: 40px;
  height: 40px;
  color: #8f9399;
  .more {
    z-index: 99;
    position: absolute;
    right: 0;
    top: 0;
    display: none;
    text-align: center;
    width: 25px;
    i {
      transform: rotate(90deg);
    }
    .editbox {
      position: absolute;
      border: 1px solid #e4e4e4;
      background: white;
      right: 0;
      top: 34px;
      z-index: 100;
      padding: 0 3px;
      display: none;
      p {
        color: #999999;
        line-height: 20px;
        margin: 0;
        font-size: 12px;
      }
      p:hover {
        color: #409eff;
      }
    }
  }
  .more:hover .editbox {
    display: block;
  }
}

.custom-el-menu .cusmenuItem.is-active .more {
  display: block;
}
.custom-el-menu /deep/.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.collegedia /deep/.el-dialog__body{
  padding: 30px 40px 30px 20px;
}
.posirela{
  position: relative;
  .addmanage{
    position: absolute;
    top: 9px;
    right: -20px;
    cursor: pointer;
  }
}
</style>
