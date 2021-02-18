<template>
  <div class="joinApplication">
    <branch-approve-list
      ref="branchApproveList"
      @selectOneInfo="selectOneInfo"
      class="joinApplication"
    ></branch-approve-list>
    <branch-approve-info
      @refreshMembers="refreshMembers"
      :selectInfo="selectInfo"
      class="joinApplicationInfo"
    ></branch-approve-info>
  </div>
</template>

<script>
import branchApproveList from "./branchApproveList";
import branchApproveInfo from "./branchApproveInfo";
export default {
  name: "branchApprove",
  components: { branchApproveList, branchApproveInfo },
  data() {
    return {
      branchId: "",
      selectInfo: {}
    };
  },
  created() {
    this.branchId = this.$route.params.id;
  },
  methods: {
    selectOneInfo(obj) {
      this.selectInfo = JSON.parse(JSON.stringify(obj));
    },
    refreshMembers() {
      this.$refs.branchApproveList.searchForm = {
        limit: 6,
        offset: 0,
        searchContent: "",
        isSubBranch:false
      };
      this.$refs.branchApproveList.getList()
    }
  }
};
</script>

<style lang="less" scoped>
.joinApplication {
  display: flex;
  height: 100%;
  width: 100%;
  background: #fff;
  .joinApplication {
    width: 360px;
    box-sizing: border-box;
    border-right: 1px solid #e6e6e6;
  }
  .joinApplicationInfo {
    flex: 1;
  }
}
</style>