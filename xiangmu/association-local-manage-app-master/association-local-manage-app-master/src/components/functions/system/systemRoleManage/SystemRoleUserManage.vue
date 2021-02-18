<template>
  <el-container v-if="role" class="absolute-fill-parent">
    <!-- <el-button size="medium" icon="el-icon-s-check" @click="menuSettingVisible=true" type="text">授权</el-button> -->
    <el-main class="unset-vertical-padding position-relative" v-loading="loading">
      <el-tabs v-model="activeName" class="custabs">
        <el-tab-pane label="功能权限" name="first" style="height:100%;">
          <system-role-menu-manage ref="menuManage" :role-id="role.id" :role="role" :privilegeObj="privilegeObj" @getRoleMenus="getRoleMenus"/>
        </el-tab-pane>
        <el-tab-pane label="数据权限" name="second" style="height:100%;">
          <system-role-data-manage ref="dataManage" :role-id="role.id" :role="role" :privilegeObj="privilegeObj" @getRoleMenus="getRoleMenus"/>
        </el-tab-pane>
        <el-tab-pane label="角色成员" name="third">
          <el-table ref="userTable" size="small" border :data="userList" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%;margin-top:0;" class="custom-el-table header-gray">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" width="50" fixed>
              <template v-slot="{ $index }">
                <div class="text-align-center">
                  {{ $index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="账号名称" prop="name" />
            <el-table-column label="登录账号" prop="loginName" />
            <el-table-column label="账号类型">
              <template v-slot="{ row }">
                {{ row.adminType | adminType }}
              </template>
            </el-table-column>
            <el-table-column label="关联时间" width="180">
              <template v-slot="{ row }">
                {{ row.createTime | yyyyMMddHHmm }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template v-slot="{ row }">
                <el-button class="custom-el-button danger unset-padding" type="text" @click="cancelLink(row.id)">取消关联</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <div class="rightposition" v-show="activeName == 'third'">
      <el-input placeholder="请输入账号名称进行搜索" size="mini" prefix-icon="el-icon-search" :clearable="true" style="width:300px" v-model="keyword"></el-input>
      <el-button size="small" type="text" class="unset-padding theme-color" icon="el-icon-connection" @click="relevantFormVisible = true" style="margin-left:10px;">关联用户</el-button>
      <el-button size="small" :disabled="selections.length < 1" type="text" class="custom-el-button danger unset-padding" icon="el-icon-delete" @click="cancelLink(null)">批量取消关联</el-button>
    </div>

    <el-dialog
      title="编辑角色"
      :visible.sync="roleFormVisible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form size="small" label-width="120px" style="max-width: 750px;">
        <el-form-item>
          <template v-slot:label>
            <div class="custom-el-form-item-label required">
              角色名称：
            </div>
          </template>
          <el-input
            v-model="roleName"
            placeholder="请输入角色名称，20字以内"
            :maxlength="20"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button
          icon="el-icon-error"
          type="danger"
          size="small"
          @click="roleFormVisible = false"
          >取消返回
        </el-button>
        <el-button
          icon="el-icon-success"
          type="primary"
          size="small"
          @click="updateRole"
          >确定</el-button
        >
      </template>
    </el-dialog>
    <el-dialog
      title="关联用户"
      :visible.sync="relevantFormVisible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <system-role-relevant-admin-user-list
        v-if="relevantFormVisible"
        :role-id="role.id"
        @close="relevantFormVisible = false"
        @refresh="getUsers"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import SystemRoleMenuManage from "./SystemRoleMenuManage";
import SystemRoleDataManage from "./SystemRoleDataManage"
import SystemRoleRelevantAdminUserList from "./SystemRoleRelevantAdminUserList";
export default {
  name: "SystemRoleUserManage",
  components: { SystemRoleMenuManage,SystemRoleDataManage, SystemRoleRelevantAdminUserList },
  props: {
    role: Object
  },
  data() {
    return {
      roleFormVisible: false,
      roleName: "",
      keyword: "",
      relevantFormVisible: false,
      userList: [],
      selections: [],
      activeName: "first",
      loading:false,
      privilegeObj:null
    };
  },
  methods: {
    openEditRole() {
      this.roleName = this.role.roleName;
      this.roleFormVisible = true;
    },
    deleteRole() {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除"
        })
        .then(() => {
          this.$request
            .delete("/api/admin/privilege/role", {
              params: { id: this.role.id }
            })
            .then(() => {
              this.$message.success(`角色【${this.role.roleName}】已成功删除`);
              this.$emit("refresh-roles");
            });
        })
        .catch(() => {});
    },
    updateRole() {
      if (!this.roleName) {
        this.$message.warning("请输入角色名称");
        return;
      }

      this.$request
        .put("/api/admin/privilege/role", {
          roleName: this.roleName,
          id: this.role.id
        })
        .then(() => {
          this.role.roleName = this.roleName;
          this.roleFormVisible = false;
          this.$message.success("角色修改成功");
        });
    },
    getUsers() {
      if (this.role) {
        this.$request.get("/api/admin/privilege/associatedAdminUserList", {
          params: {
            keyword: this.keyword,
            roleId: this.role.id
          }
        })
        .then(res => {
          this.userList = res.data;
        });
      }
    },
    handleSelectionChange(selections) {
      this.selections = selections;
    },
    cancelLink(id) {
      this.$msgbox
        .confirm("取消关联操作是不可逆的，是否继续？", "提示", {
          type: "warning",
          confirmButtonText: "继续"
        })
        .then(() => {
          let adminBranchKeys = [];
          if (id) {
            adminBranchKeys = [
              {
                adminId: id
              }
            ];
          } else {
            this.selections.map(item => {
              adminBranchKeys.push({
                adminId: item.id
              });
            });
          }
          this.$request
            .put("/api/admin/privilege/adminLinkRole", {
              adminBranchKeys,
              roleId: this.role.id
            })
            .then(() => {
              this.getUsers();
              this.$message.success("已取消关联");
            });
        })
        .catch(() => {});
    },
    getRoleMenus() {
      this.loading = true;
      this.$request.get("/api/admin/privilege/roleMenus", { params: { roleId: this.role.id } }).then(res => {
        this.privilegeObj = res.data
        this.$nextTick(()=>{ this.loading = false; })
      });
    },
  },
  watch: {
    role:{
      immediate:true,
      handler(val){
        if(val){
          this.getRoleMenus();
          this.getUsers();
        }
      }
    },
    keyword() {
      this.getUsers();
    }
  }
};
</script>
<style lang="less" scoped>
.custabs {
  padding-top: 10px;
  height: 100%;
  box-sizing: border-box;
  /deep/.el-tabs__content {
    height: calc(100% - 80px);
  }
  /deep/.el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
  /deep/.el-tabs__item.is-active {
    color: #3FA1B6;
  }
  /deep/.el-tabs__active-bar{
    background-color: #3FA1B6;
  }
}
.rightposition {
  position: absolute;
  right: 20px;
  top: 14px;
}
</style>
