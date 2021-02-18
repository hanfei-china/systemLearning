<template>
  <el-container style="height:100vh;">
    <black-main-layout :ifCancelTest="true" :branchInfo="branchInfo">
      <template v-slot:header>
        <div class="flex flexend">上次登录时间：{{loginUser.lastLoginTime|filterTime}}</div>
      </template>
      <el-container style="height:100%;">
        <el-aside width="200px" style="backgroundColor: #28394B;overflow-y:auto;">
          <branch-aside :id="id"></branch-aside>
        </el-aside>
        <el-main style="padding:0;position:relative;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </black-main-layout>
  </el-container>
</template>

<script>
import BlackMainLayout from "../../../../components/layout/BlackMainLayout";
import { formatDate } from "@/js/util/utilFunction";
import branchAside from "./branchAside";
export default {
  name: "branchEditView",
  components: { BlackMainLayout, branchAside },
  data() {
    return {
      loaded: false,
      id: "",
      branchInfo:{}
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.loginUser;
    }
  },
  filters: {
    filterTime(val) {
      if (val) {
        return formatDate(new Date(val), "yyyy-MM-dd");
      } else {
        return "";
      }
    }
  },
  created() {
    this.id = this.$route.params.mpId;
    this.getBranchInfo();
  },
  methods:{
      getBranchInfo(){
        this.$request.post("/api/admin/branch/getBranchInfo").then(res=>{
          // console.log(res);
          this.branchInfo=JSON.parse(JSON.stringify(res.data));
        })
      }
  }
};
</script>

<style lang="less" scoped>
.flexend {
  font-size: 12px;
  color: white;
  justify-content: flex-end;
  line-height: 50px;
  padding-right: 10px;
}

::-webkit-scrollbar {
  width: 0 !important;
}
</style>
