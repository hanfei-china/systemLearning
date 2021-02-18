<template>
  <el-container class="absolute-fill-parent border-top cusdia">
    <div class="elheader">
      <div class="headtitle">查看校友</div>
      <div>
        <!-- <el-button size="small" @click="goback">上一个</el-button>
        <el-button size="small" @click="goback">下一个</el-button>
        <el-button size="small" @click="goback">删除</el-button> -->
        <el-button size="small" @click="goback">返回</el-button>
        <el-button v-if="!isFamous" size="small" @click="addFamousVisible=true;">转为知名校友</el-button>
      </div>
    </div>
    <el-header height="50px"></el-header>
    <el-main class="unset-padding position-relative">
      <div class="maincont">
        <el-tabs tab-position="left" v-model="activeName" style="height:100%">
          <el-tab-pane label="校友信息" name="alumnusInfo">
            <member-details :branchId="branchId" v-if="activeName=='alumnusInfo'" :memberId="memberId"
                            :originalGroups="originalGroups" :educationList="educationList"></member-details>
          </el-tab-pane>
          <el-tab-pane label="校友档案" name="alumnusFiles" v-if="!branchId">
            <member-files v-if="activeName=='alumnusFiles'" :memberId="memberId" :originalGroups="originalGroups"
                          :educationList="educationList"></member-files>
          </el-tab-pane>
          <el-tab-pane v-if="isFamous" label="校友资讯" name="linkAlumnusInfo">
            <link-member-info v-if="activeName=='linkAlumnusInfo'" :memberId="memberId"/>
          </el-tab-pane>
          <el-tab-pane v-if="activeFlag" label="已入分会" name="alumnusBranch">
            <branch-joined v-if="activeName=='alumnusBranch'" :memberId="memberId"/>
          </el-tab-pane>
          <el-tab-pane v-if="activeFlag" label="参与活动" name="alumnusActivities">
            <activity-joined v-if="activeName=='alumnusActivities'" :user-id="userId"/>
          </el-tab-pane>
          <el-tab-pane v-if="activeFlag" label="已购商品" name="alumnusGoods">
            <goods-bought v-if="activeName=='alumnusGoods'" :user-id="userId"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
    <!-- 添加至知名校友 -->
    <el-dialog :visible.sync="addFamousVisible" title="添加至知名校友" append-to-body :close-on-click-modal="false"
               width="800px" :show-close="false">
      <add-famous v-if="addFamousVisible" :memberId="memberId" @close="addFamousVisible = false" @refresh="goback"/>
    </el-dialog>
  </el-container>
</template>

<script>
import MemberDetails from "@/components/functions/organization/member/allMember/memberForm/MemberDetails";
import MemberFiles from "@/components/functions/organization/member/allMember/memberForm/MemberFiles";
import linkMemberInfo from '@/components/functions/organization/member/allMember/memberForm/linkMemberInfo'
import addFamous from '@/components/functions/organization/member/allMember/memberForm/AddFamous'
import BranchJoined from "@/components/functions/organization/member/allMember/memberForm/BranchJoined";
import ActivityJoined from "@/components/functions/organization/member/allMember/memberForm/ActivityJoined";
import GoodsBought from "@/components/functions/organization/member/allMember/memberForm/GoodsBought";

export default {
  name: "MemberFormNew",
  components: {MemberDetails, MemberFiles, linkMemberInfo, addFamous, BranchJoined, ActivityJoined, GoodsBought},
  props: {
    memberId: {
      type: String,
      default: "",
    },
    originalGroups: Array,
    educationList: Array,
    collegeList: Array,
    majorList: Array,
    branchId: String,
    isFamous: Boolean,

  },
  data() {
    return {
      activeName: "alumnusInfo",
      addFamousVisible: false,
      activeFlag: false,
      userId:''
    };
  },
  methods: {
    goback() {
      this.$emit("refresh-members");
      this.$emit("close");
    },
    // addToFamous(){
    //   this.addFamousInfo=JSON.parse(JSON.stringify(info));
    //   this.addFamousVisible=true;
    // }

    // 获取账户激活状态
    getActiveData() {
      const loading = this.$loading({lock: true, fullscreen: true})
      this.$request
          .get("/api/admin/member/v2/getUserInfoAndMemberInfo", {
            params: {memberId: this.memberId},
          })
          .then((info) => {
            loading.close()
            if (info.data.userInfo) {
              this.activeFlag = true
              this.userId=info.data.userInfo.id
            } else {
              this.activeFlag = false
            }
          });
    }
  },
  created() {
    this.getActiveData()
  }
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

  /deep/ .el-tabs__content {
    height: 100%;

    .el-tab-pane {
      height: 100%;
    }
  }

  /deep/ .el-tab-pane {
    overflow-y: auto;
  }
}
</style>
