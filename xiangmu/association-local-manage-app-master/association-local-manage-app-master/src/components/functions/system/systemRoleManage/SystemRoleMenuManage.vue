<template>
  <el-container class="ybpermission">
    <el-main class="unset-padding position-relative">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
          <el-tree ref="tree" :data="menus" highlight-current :expand-on-click-node="false" :props="props" node-key="id" default-expand-all show-checkbox>
            <span slot-scope="{ node, data }" :class="data.children?'disblock':'disinline'">
              {{ node.label }}
            </span>
          </el-tree>
        </vue-scroll>
      </div>
    </el-main>
    <el-footer class="unset-padding flex flex-column flex-center" height="auto">
      <div class="text-align-center" style="padding-top: 16px;">
        <el-button icon="el-icon-success" :disabled="disabledFn()" type="primary" size="small" @click="submitData">保存</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { translatorMenus,translatorKeys } from "../../../../js/util/utilFunction";

export default {
  name: "SystemRoleMenuManage",
  props: {
    roleId: String,
    role: Object,
    privilegeObj:Object
  },
  data() {
    return {
      menus: [],
      props: {
        label: "menuTitle",
        disabled: this.disabledFn
      },
      otherLevel:[]
    };
  },
  watch:{
    privilegeObj:{
      immediate:true,
      handler(val){
        if(val){
          let menus = val.roleAuthorizableMenus.filter(item=>item.menuType=="MENU"||item.menuType=="OP");
          if (menus && menus.length > 0) {
            let parents = menus.filter(privilege => {
              return !privilege.parentId;
            });
            let children = menus.filter(privilege => {
              return privilege.parentId;
            });
            translatorMenus(parents, children);
            this.menus = parents;
          }
          let keys = val.roleAuthorizedMenus;
          let resultKeys = [];
          translatorKeys(menus, keys, resultKeys);
          this.$refs.tree.setCheckedKeys(resultKeys);

          var otherMenu = val.roleAuthorizableMenus.filter( item => item.menuType == "DATA"||item.menuType == "FIELD" );
          this.otherLevel = [];
          keys.forEach(key=>{
            let menu = otherMenu.find(menu=>{ return menu.id === key })
            if(menu){
              this.otherLevel.push(key);
            }
          })
        }
      }
    }
  },
  methods: {
    disabledFn() {
      if(this.roleId=='0'){
        return true
      }else{return false}
    },
    submitData() {
      let menus = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).concat(this.otherLevel);
      this.$request.post("/api/admin/privilege/roleMenus", { roleId: this.roleId,menus,labels:this.privilegeObj.roleAuthorizedLabels }).then(() => {
        this.$emit("getRoleMenus")
        this.$message.success("权限更新成功");
      });
    }
  },
};
</script>

<style lang="less">
.ybpermission {
  height: 100%;
}
.ybpermission .el-tree-node__content{
  background: #f5f8fd;
  margin-bottom: 10px;
}
.ybpermission .el-tree-node.is-current > .el-tree-node__content {
  /* background-color: #f5f8fd; */
  color: #606266;
  overflow: hidden;
}
.ybpermission .el-tree-node__children{
  display: flex;
  flex-wrap: wrap;
}
.ybpermission .el-tree-node.is-expanded>.el-tree-node__children{
  display: flex!important;
  flex-wrap: wrap;
}
.ybpermission .el-tree-node.is-expanded>.el-tree-node__children>.el-tree-node{
  max-width: 100%;
  overflow: hidden;
}
.ybpermission .el-tree-node__children .el-tree-node__content{
  background: white;
}
.ybpermission .el-tree-node__children .disblock{
  width: 2000px;
}

</style>
