<template>
  <el-container>
    <el-main class="unset-padding">
      <el-form ref="addManagerForm" :model="addManagerForm" :rules="addManagerRules" label-width="120px" before-close="closeManagerDialog">
        <template v-if="editType!=2">
          <el-form-item label="姓名" size="small" style="width:500px;" prop="name">
            <el-input v-model="addManagerForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" size="small" style="width:500px;">
            <el-select v-model="addManagerForm.sex" placeholder="请选择性别" style="width:380px;">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" size="small" style="width:500px;">
            <el-input v-model="addManagerForm.telephone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" size="small" style="width:500px;">
            <el-input v-model="addManagerForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="登陆用户名" size="small" style="width:500px;" prop="loginName">
            <!-- 清除自动填充 -->
            <el-input v-model="addManagerForm.loginName" placeholder="请输入用户登录名" style="display:none"></el-input>
            <el-input v-model="addManagerForm.loginName" placeholder="请输入用户登录名"></el-input>
          </el-form-item>
        </template>
        <template v-if="editType!=1">
          <el-form-item label="密码" size="small" style="width:500px;" prop="password">
            <!-- 清除自动填充 -->
            <el-input v-model="addManagerForm.password" placeholder="请输入密码" show-password style="display:none"></el-input>
            <el-input v-model="addManagerForm.password" placeholder="请输入密码" auto-complete="new-password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" size="small" style="width:500px;" prop="deptId">
            <!-- 清除自动填充 -->
            <el-input v-model="addManagerForm.deptId" placeholder="请再次输入密码" show-password style="display:none"></el-input>
            <el-input v-model="addManagerForm.deptId" placeholder="请再次输入密码" auto-complete="new-password" show-password></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-main>
    <el-footer class="unset-padding" height="auto">
      <div class="text-align-right" style="padding-top: 16px;">
        <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{id ? '确认修改' :'确认新增'}}</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "AccountForm",
  props: {
    id: {
      type: String,
      default: null,
    },
    editType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      addManagerForm: {
        name: "",
        sex: "",
        telephone: "",
        email: "",
        loginName: "",
        password: "",
        deptId: ""
      },
      addManagerRules: {
        name: [
          { required: true, message: "请输入管理者姓名", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入登录用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        deptId: [{ required: true, message: "请确认密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    getAccountInfo() {
      if (this.id) {
        this.$request.get("/api/admin/account", { params: { id: this.id } }).then((resp) => {
          let { data } = resp;
          for (const key in this.addManagerForm) {
            this.addManagerForm[key] = data[key]
          }
          this.addManagerForm.deptId = this.addManagerForm.password = ""
        });
      }
    },
    submitData() {
      this.$refs["addManagerForm"].validate(valid => {
        if (valid) {
          //判断密码和确认密码是否相同
          if (this.addManagerForm.password !== this.addManagerForm.deptId) {
            this.$message({
              message: "确认密码和密码不相符，请重新输入",
              type: "warning"
            });
            return false;
          }
          var params = JSON.parse(JSON.stringify(this.addManagerForm))
          params.deptId='';
          if(this.id){
            params.id = this.id;
            if(this.editType=="2"){
              var newparams = {adminId:this.id,password:this.addManagerForm.password}
              this.$request.put("/api/admin/account/resetPassword", newparams).then(() => {
                this.emitParent();
                this.$message.success("密码修改成功");
              });
            }else{
              this.$request.put("/api/admin/account", params).then(() => {
                this.emitParent();
                this.$message.success("账号信息修改成功");
              });
            }

          }else{
            this.$request.post("/api/admin/account", params).then((r) => {
              this.emitParent(r.data);
              this.$message.success("账号添加成功");
            });
          }
        } else {
          return false;
        }
      });
    },
    emitParent(id) {
      this.$emit("refresh",id);
      this.$emit("close");
    },
  },
  created() {
    this.getAccountInfo();
  },
};
</script>
