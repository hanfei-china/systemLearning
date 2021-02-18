<template>
  <el-container class="cuscontainer">
    <el-main class="unset-padding position-relative">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="数据权限" name="1">
              <el-checkbox-group v-model="dataLevel" :disabled="disabledFn()">
                <el-checkbox v-for="item in dataMenu" :key="item.id" :label="item.id">{{item.menuTitle}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>

            <el-collapse-item title="校友字段管理权限" name="2">
              <el-checkbox-group v-model="fieldLevel" :disabled="disabledFn()">
                <el-checkbox v-for="item in fieldMenu" :key="item.id" :label="item.id">{{item.menuTitle}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>

            <el-collapse-item title="标签权限" name="3">
              <el-checkbox-group v-model="labelLevel" :disabled="disabledFn()">
                <el-checkbox v-for="item in labelMenu" :key="item.id" :label="item.id">{{item.title}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
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
import { translatorKeys } from "../../../../js/util/utilFunction";
export default {
  name: "SystemRoleDataManage",
  props: {
    roleId: String,
    role: Object,
    privilegeObj: Object
  },
  data() {
    return {
      activeNames: ["1", "2", "3"],
      dataLevel: [],
      dataMenu:[],
      fieldLevel:[],
      fieldMenu:[],
      labelMenu:[],
      labelLevel:[],
      menuKeys:[],
    };
  },
  watch: {
    privilegeObj: {
      immediate: true,
      handler(val) {
        if (val) {
          this.dataMenu = val.roleAuthorizableMenus.filter( item => item.menuType == "DATA" );
          this.fieldMenu = val.roleAuthorizableMenus.filter( item => item.menuType == "FIELD" );
          this.labelMenu = val.roleAuthorizableLabels;
          this.labelLevel = val.roleAuthorizedLabels;
          let keys = val.roleAuthorizedMenus;
          this.dataLevel = [];
          this.fieldLevel = [];
          keys.forEach(key=>{
            let menu = this.dataMenu.find(menu=>{ return menu.id === key })
            if(menu){
              this.dataLevel.push(key);
            }
          })
          keys.forEach(key=>{
            let menu = this.fieldMenu.find(menu=>{ return menu.id === key })
            if(menu){
              this.fieldLevel.push(key);
            }
          })

          this.menuKeys = [];
          let menus = val.roleAuthorizableMenus.filter(item=>item.menuType=="MENU"||item.menuType=="OP");
          keys.forEach(key=>{
            let menu = menus.find(menu=>{ return menu.id === key })
            if(menu){
              this.menuKeys.push(key);
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
      let menus = this.dataLevel.concat(this.fieldLevel).concat(this.menuKeys);
      this.$request.post("/api/admin/privilege/roleMenus", { roleId: this.roleId,menus,labels:this.labelLevel }).then(() => {
        this.$emit("getRoleMenus")
        this.$message.success("权限更新成功");
      });
    }
  }
};
</script>

<style lang="less">
.cuscontainer {
  height: 100%;
}
.cuscontainer .el-collapse-item__header {
  background: #d7e9f7;
  padding-left: 20px;
  height: 40px;
  margin-bottom: 10px;
  border-bottom: 0;
}
.cuscontainer .el-collapse {
  border: none;
}
.cuscontainer .el-collapse-item__content {
  padding-bottom: 10px;
}
.cuscontainer .el-checkbox{
  margin-bottom: 10px;
}
</style>
