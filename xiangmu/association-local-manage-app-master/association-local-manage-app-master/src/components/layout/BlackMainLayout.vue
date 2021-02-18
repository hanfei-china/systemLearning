<template>
<!-- v-loading="loading"
    element-loading-text="权限校验中....."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)" -->
  <el-container
    class="fixed-fill-parent"
  >
    <el-header
      class="unset-padding flex flex-column flex-center console-header box-shadow-bottom"
      height="50px"
    >
      <div class="flex ovhidden">
        <div
          @click="$emit('title-click')"
          class="flex flex-column flex-center"
          :class="{ 'cursor-pointer': titleHover }"
        >
          <div class="flex" style="align-items: center;">
            <div
              style="padding: 0 12px 0 18px;"
              class="flex-column flex-center"
              v-show="systemSetting.systemLogo"
            >
              <img v-if="branchInfo&&branchInfo.logo" style="display: block;" height="32px" :src="branchInfo.logo" />
              <img v-else style="display: block;" height="32px" :src="systemSetting.systemLogo" />
            </div>
            <div class="flex flex-column flex-center systemName">{{ branchInfo?branchInfo.name:systemSetting.systemName }}</div>
            <div class="flex flex-column flex-center" v-show="version">
              <div class="system-version">
                <i style="font-size: inherit;padding-right: 4px;" class="iconfont icon-version" />
                {{ version }}
              </div>
            </div>

            <el-dropdown v-if="myBranchList.length>1||(!branchInfo&&myBranchList.length>0)">
              <span @click.stop="aa" class="mybranch">我管理的分会<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in myBranchList" :key="item.id" @click.native="toMyBranch(item.id)">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown v-if="myCollegeList.length>1">
              <span @click.stop="aa" class="mybranch">{{currentCollegeName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="currentCollege(null)">全部</el-dropdown-item>
                <el-dropdown-item v-for="item in myCollegeList" :key="item.id" @click.native="currentCollege(item)">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
        </div>

        <div class="flex-fill-in-the-remaining-space" style="padding-left: 10px;">
          <slot name="header" />
        </div>

        <div style="padding: 0 25px;" class="flex flex-column flex-center">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="headbox">
              <img class="userpic" v-if="loginUser.headImg" :src="loginUser.headImg" alt />
              <div style="color: #ffffff;font-size: 14px;">{{ loginUser.name }}</div>
              <div>
                <i
                  style="font-weight: 600; color: #ffffff;"
                  class="el-icon-arrow-down el-icon--right"
                />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-key" command="modPwd">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" command="logout">退出登录</el-dropdown-item>
              <!-- <el-popover placement="left-start" width="150" trigger="hover">
                <div class="myBranchList">
                  <ul>
                    <li
                      v-for="item in myBranchList"
                      :key="item.id"
                      @click="toMyBranch(item.id)"
                    >{{item.name}}</li>
                  </ul>
                </div>
                <el-button
                  slot="reference"
                  icon="el-icon-document"
                  type="text"
                  class="myBranch"
                >我的分会</el-button>
              </el-popover> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <slot />
    </el-main>
    <el-dialog
      :visible.sync="pwdDialogVisible"
      title="修改密码"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <modify-password v-if="pwdDialogVisible" @close="pwdDialogVisible = false" />
    </el-dialog>
  </el-container>
</template>

<script>
import { SET_LOGIN_USER_INFO, SET_CURRENT_COLLEGE } from "../../js/store/mutation-types";
import ModifyPassword from "../login/ModifyPassword";

export default {
  name: "BlackMainLayout",
  components: { ModifyPassword },
  props: {
    titleHover: Boolean,
    ifCancelTest: Boolean,
    branchInfo:Object
  },
  data() {
    return {
      pwdDialogVisible: false,
      loading: false,
      myBranchList: [],
      myCollegeList: []
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.loginUser;
    },
    systemSetting() {
      return this.$store.state.systemSetting;
    },
    version() {
      return this.$store.state.systemVersion;
    },
    currentCollegeName() {
      return this.$store.state.currentCollege ? this.$store.state.currentCollege.name : "我管理的学院"
    }
  },
  methods: {
    aa(){return false},
    handleCommand(command) {
      if (command === "logout") {
        this.logout();
      }

      if (command === "modPwd") {
        this.modPwd();
      }
    },
    logout() {
      this.$request.post("/api/admin/account/anon/logout").then(() => {
        this.$message.success("已退出登录");
        this.$router.push("/login");
      });
    },
    getLoginUser() {
      this.$emit("privilege-loading");
      if(!(!!window.MSInputMethodContext && !!document.documentMode)){
        this.loading = true;
      }
      this.$request.get("/api/admin/account/loginInfo").then(data => {
        this.$store.commit(SET_LOGIN_USER_INFO, data.data);
        this.$emit("privilege-loaded");
        this.$nextTick(()=>{ this.loading = false; })
      });
    },
    modPwd() {
      this.pwdDialogVisible = true;
    },
    getMyColleges() {
      this.$request.get("/api/admin/college/myColleges").then(res => {
        this.myCollegeList = JSON.parse(JSON.stringify(res.data));
      });
    },
    getMyBranchList() {
      this.$request.get("/api/admin/branch/getBranchByAdminId").then(res => {
        this.myBranchList = JSON.parse(JSON.stringify(res.data));
      });
    },
    toMyBranch(id) {
      this.$request.post('/api/admin/branch/importSessionBranchId?branchId='+id).then(()=>{
        let routeUrl = this.$router.resolve({ path: "/branchEditView/" + id });
        window.open(routeUrl.href, "_blank");
      })
    },
    currentCollege(college) {
      this.$store.commit(SET_CURRENT_COLLEGE, college);
    }
  },
  created() {
    this.getLoginUser();
    this.getMyBranchList();
    this.getMyColleges();
    window.this = this;
  },
  watch: {
    $route() {
      this.getLoginUser();
    }
  }
};
</script>


<style lang="less" scoped>
.systemName {
  font-size: 18px;
  color: white;
}
.headbox {
  display: flex;
  cursor: pointer;
  height: 50px;
  align-items: center;
  .userpic {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: contain;
    flex-shrink: 0;
    margin-right: 7px;
  }
}
.myBranch {
  width: 100%;
  color: #606266;
  &:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
.myBranchList {
  max-height: 100px;
  overflow-y: auto;
  ul {
    li {
      height: 36px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      &:hover {
        background-color: #ecf5ff;
        color: #66b1ff;
      }
    }
  }
}
::-webkit-scrollbar{
  width: 3px!important;
}

.mybranch{
  color: white;
  margin-left: 15px;
}
</style>
