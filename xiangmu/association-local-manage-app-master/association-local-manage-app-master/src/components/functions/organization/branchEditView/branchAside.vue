<template>
  <div>
    <el-menu
      :default-active="defaultActive"
      background-color="#28394B"
      text-color="#fff"
      active-text-color="#6DC9CD"
      :unique-opened="true"
      router
      @select="handleSelect"
      style="border:0;overflow-y:auto;z-index:0;"
      class="console-menu ybcusmenu"
    >
      <el-menu-item index="/branchEditView/branchInfoEdit">
        <img src="./icon/index.png" class="menu-item-icon" />
        <span slot="title">基本信息</span>
      </el-menu-item>
      <el-menu-item index="/branchEditView/BranchContentManage">
        <img src="./icon/sms.png" class="menu-item-icon" />
        <span slot="title">通知管理</span>
      </el-menu-item>
      <el-menu-item index="/branchEditView/memberManage">
        <img src="./icon/members.png" class="menu-item-icon" />
        <span slot="title">成员管理</span>
      </el-menu-item>
      <el-menu-item :index="'/branchEditView/joinApplication/'+id">
        <!-- <img src="./icon/index.png" class="menu-item-icon" /> -->
        <i class="el-icon-folder-checked" style="color:#fff;fontSize:16px;"></i>
        <span slot="title">入会申请</span>
      </el-menu-item>
      <el-menu-item :index="'/branchEditView/informationExchange'">
        <i class="el-icon-help" style="color:#fff;fontSize:16px;"></i>
        <span slot="title">校友互助</span>
      </el-menu-item>
      <el-submenu index="action">
        <template slot="title">
          <img src="./icon/actions.png" class="menu-item-icon" />
          <span>活动</span>
        </template>
        <el-menu-item index="/branchEditView/activityExamine">活动审核</el-menu-item>
        <el-menu-item :index="'/branchEditView/activityList/'+id">所有活动</el-menu-item>
        <!-- <el-menu-item :index="'/branchEditView/activityType/'+id">类型管理</el-menu-item> -->
        <el-menu-item :index="'/branchEditView/guestManage/'+id">活动嘉宾库</el-menu-item>
      </el-submenu>
      <!-- <el-menu-item index="3">
        <img src="./icon/notice.png" class="menu-item-icon" />
        <span slot="title">通知公告</span>
      </el-menu-item>
      <el-menu-item index="4">
        <img src="./icon/tabel.png" class="menu-item-icon" />
        <span slot="title">表单管理</span>
      </el-menu-item>
      <el-menu-item index="5">
        <img src="./icon/photo.png" class="menu-item-icon" />
        <span slot="title">校友相册</span>
      </el-menu-item>
      <el-menu-item index="6">
        <img src="./icon/manage.png" class="menu-item-icon" />
        <span slot="title">动态管理</span>
      </el-menu-item>
      <el-menu-item index="7">
        <img src="./icon/sms.png" class="menu-item-icon" />
        <span slot="title">短信</span>
      </el-menu-item>
      <el-menu-item index="8">
        <i class="el-icon-message" style="color:#fff;fontSize:16px;"></i>
        <span slot="title">邮件</span>
      </el-menu-item>
      <el-submenu index="index">
        <template slot="title">
          <img src="./icon/edit.png" class="menu-item-icon" />
          <span>设置</span>
        </template>
        <el-menu-item index="9-1">分会信息设置</el-menu-item>
        <el-menu-item index="9-2">账号管理</el-menu-item>
        <el-menu-item index="9-3">角色管理</el-menu-item>
        <el-menu-item index="9-4">操作日志</el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "branchAside",
  props: ["id"],
  data() {
    return {
      defaultActive:'',
    };
  },
  created() {
    if (this.$route.path==='/branchEditView/'+this.id) {
      this.defaultActive='/branchEditView/branchInfoEdit';
      this.$router.push(this.defaultActive);
    }else{
      this.defaultActive=this.$route.path;
    }
  },
  methods: {
    handleSelect(path) {
      this.defaultActive=path;
    }
  }
};
</script>

<style lang="less" scoped>
.ybcusmenu .el-menu-item {
  border-left: 3px solid transparent;
}
.ybcusmenu .el-menu-item.is-active {
  border-left: 3px solid #4fb6cc;
  background: #1f323f !important;
}
.ybcusmenu .el-submenu {
  border-left: 0 !important;
}
.ybcusmenu > .el-menu-item {
  padding-left: 15px !important;
}
.ybcusmenu > .el-submenu > .el-submenu__title {
  padding-left: 15px !important;
}
.ybcusmenu > li:first-child {
  border-bottom: 1px solid #1f323f;
}
.ybcusmenu > li:first-child.is-active {
  border-left: 3px solid transparent;
  box-sizing: border-box;
}
.ybcusmenu .el-menu-item,
.ybcusmenu .el-submenu__title {
  height: 46px;
  line-height: 46px;
}

.ybcusmenu {
  /deep/ .el-submenu__title {
    height: 46px;
    line-height: 46px;
  }
}

.menu-item-icon {
  margin-right: 8px;
  width: 18px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>
