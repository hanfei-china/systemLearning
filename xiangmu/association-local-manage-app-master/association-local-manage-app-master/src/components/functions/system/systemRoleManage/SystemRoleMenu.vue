<template>
  <el-container class="absolute-fill-parent">
    <el-header class="flex flex-column flex-center border-bottom" style="padding-top:10px;">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">
          {{ nowPrivilege ? nowPrivilege.menuTitle : "系统角色" }}
        </div>
        <div class="flex flex-column flex-center">
          <el-button icon="el-icon-plus" size="mini" type="text" @click="createRole" class="unset-padding theme-color">新增角色</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{ scrollPanel: { scrollingX: false } }">
          <el-menu @select="setChosenRole" class="border-right-unset custom-el-menu" :default-active="chosenRole" :default-openeds="defaultOpeneds">
            <el-submenu index="0">
              <template slot="title">
                <span>系统角色</span>
              </template>
              <el-menu-item v-for="role of systemList" :index="role.id" :key="role.id" class="cusmenuItem">
                <div class="text-overflow" style="width: 160px;">{{ role.roleName }}</div>
                <!-- <div class="more">
                  <i class="el-icon-more"></i>
                  <div class="editbox">
                    <p @click="$emit('openEditRole')">编辑</p>
                    <p @click="$emit('deleteRole')">删除</p>
                  </div>
                </div> -->
              </el-menu-item>
            </el-submenu>
            <el-submenu index="1">
              <template slot="title">
                <span>自定义角色</span>
              </template>
              <el-menu-item v-for="role of customList" :index="role.id" :key="role.id" class="cusmenuItem">
                <div class="text-overflow" style="width: 160px;">{{ role.roleName }}</div>
                <div class="more">
                  <i class="el-icon-more"></i>
                  <div class="editbox">
                    <p @click="$emit('openEditRole')">编辑</p>
                    <p @click="$emit('deleteRole')">删除</p>
                  </div>
                </div>
              </el-menu-item>
            </el-submenu>
            <!-- <el-menu-item v-for="role of list" :index="role.id" :key="role.id" class="cusmenuItem">
              <div class="text-overflow" style="width: 160px;">{{ role.roleName }}</div>
              <div class="more">
                <i class="el-icon-more"></i>
                <div class="editbox">
                  <p @click="$emit('openEditRole')">编辑</p>
                  <p @click="$emit('deleteRole')">删除</p>
                </div>
              </div>
            </el-menu-item> -->
          </el-menu>
        </vue-scroll>
      </div>
    </el-main>
    <el-dialog :title="roleFormTitle" :visible.sync="roleFormVisible" width="600px" append-to-body :close-on-click-modal="false">
      <el-form size="small" label-width="120px" style="max-width: 750px;">
        <el-form-item>
          <template v-slot:label>
            <div class="custom-el-form-item-label required">
              角色名称：
            </div>
          </template>
          <el-input v-model="roleName" placeholder="请输入角色名称，20字以内" :maxlength="20"/>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="roleFormVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "SystemRoleMenu",
  data() {
    return {
      list: [],
      chosenRole: "",
      roleType: 1,
      defaultOpeneds:['0','1'],
      roleFormVisible: false,
      roleFormTitle: "",
      roleFormId: "",
      roleName: ""
    };
  },
  computed: {
    privileges() {
      return this.$store.state.privileges;
    },
    nowPrivilege() {
      return this.$store.getters.getPrivilegeByMenuPath(
        this.$route.path,
        this.privileges
      );
    },
    systemList(){
      return this.list.filter(item=>item.system)
    },
    customList(){
      return this.list.filter(item=>!item.system)
    }
  },
  methods: {
    getList() {
      this.$request.get("/api/admin/privilege/roleList", { params: { roleType: this.roleType } }).then(res => {
        this.list = res.data;
        if (res.data.length > 0) {
          this.chosenRole = res.data[0].id;
        }
      });
    },
    setChosenRole(roleId) {
      this.chosenRole = roleId;
    },
    createRole() {
      this.roleFormTitle = "新增角色";
      this.roleFormId = "";
      this.roleName = "";
      this.roleFormVisible = true;
    },
    submitData() {
      if (!this.roleName) {
        this.$message.warning("请输入角色名称");
        return;
      }

      this.$request
        .post("/api/admin/privilege/role", {
          roleName: this.roleName,
          roleType: this.roleType
        })
        .then(() => {
          this.getList();
          this.roleFormVisible = false;
          this.$message.success("角色创建成功");
        });
    }
  },
  created() {
    this.getList();
  },
  watch: {
    chosenRole(val) {
      let role = this.list.find(item => item.id === val);
      this.$emit("select", role);
    }
  }
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
.custom-el-menu /deep/.el-submenu__title{
  height: 40px;
  line-height: 40px;
}
</style>
