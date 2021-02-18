<template>
  <el-container class="absolute-fill-parent border-top cusdia">
    <div class="elheader">
      <div class="headtitle">查看校友</div>
      <div>
        <!-- <el-button size="small" @click="goback">上一个</el-button>
        <el-button size="small" @click="goback">下一个</el-button>
        <el-button size="small" @click="goback">删除</el-button> -->
        <el-button size="small" @click="goback">返回</el-button>
      </div>
    </div>
    <el-header height="50px"></el-header>
    <el-main class="unset-padding position-relative">
      <div class="maincont">
        <el-tabs tab-position="left" v-model="activeName" style="height:100%">
          <el-tab-pane label="校友信息" name="alumnusInfo">
            <MemberDetails :branchId="branchId" v-if="activeName=='alumnusInfo'" :userId="userId" :originalGroups="originalGroups" :educationList="educationList" :collegeList="collegeList" :majorList="majorList"></MemberDetails>
          </el-tab-pane>
          <el-tab-pane label="校友档案" name="alumnusFiles" v-if="!branchId">
            <MemberFiles v-if="activeName=='alumnusFiles'" :userId="userId" :originalGroups="originalGroups" :educationList="educationList" :collegeList="collegeList" :majorList="majorList"></MemberFiles>
          </el-tab-pane>
          <el-tab-pane label="关联校友信息" name="linkAlumnusInfo">
            <link-member-info v-if="activeName=='linkAlumnusInfo'" :userId="userId"></link-member-info>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import MemberDetails from "./MemberDetails";
import MemberFiles from "./MemberFiles";
import linkMemberInfo from './linkMemberInfo'

export default {
  name: "MemberFormNew",
  components: { MemberDetails,MemberFiles,linkMemberInfo },
  props: {
    userId: {
      type: String,
      default: "",
    },
    originalGroups: Array,
    educationList: Array,
    collegeList: Array,
    majorList: Array,
    branchId:String
  },
  data() {
    return {
      activeName: "alumnusInfo",
    };
  },
  methods: {
    goback() {
      this.$emit("refresh-members");
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
.cusdia {
  background: #fff;
  .elheader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    right: 0;
    height: 50px;
    padding: 0 20px;
    background: white;
    margin-bottom: 10px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
    .headtitle {
      font-size: 16px;
      color: #222222;
      padding-left: 6px;
      border-left: 3px solid #28394b;
      height: 16px;
      line-height: 16px;
    }
    button {
      border-color: #3fa1b6;
      color: #3fa1b6;
    }
  }
  .headbox {
    padding: 10px 0 30px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #e6e6e6;
    img {
      width: 76px;
      height: 76px;
      border-radius: 50%;
    }
    .userinfo {
      margin-left: 20px;
      div {
        font-size: 14px;
        color: #222222;
      }
      p {
        font-size: 14px;
        line-height: 40px;
        color: #888888;
        word-spacing: 10px;
      }
    }
  }
  .maincont {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
  }
  /deep/.el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
    }
  }
  /deep/.el-tab-pane{
    overflow-y: auto;
  }
}
</style>
