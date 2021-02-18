<template>
  <div class="joinApplication">
    <join-application-list
      ref="joinApplicationList"
      @selectOneInfo="selectOneInfo"
      class="joinApplication"
    ></join-application-list>
    <join-application-info
      @refreshMembers="refreshMembers"
      :selectInfo="selectInfo"
      :branchId="branchId"
      class="joinApplicationInfo"
    ></join-application-info>
  </div>
</template>

<script>
import joinApplicationList from "./joinApplicationList";
import joinApplicationInfo from "./joinApplicationInfo";
export default {
  name: "joinApplication",
  components: { joinApplicationList, joinApplicationInfo },
  data() {
    return {
      branchId: "",
      selectInfo: {}
    };
  },
  created() {
    this.branchId = this.$route.params.branchId;
  },
  methods: {
    selectOneInfo(obj) {
      this.selectInfo = JSON.parse(JSON.stringify(obj));
    },
    refreshMembers() {
      this.$refs.joinApplicationList.searchForm = {
        limit: 6,
        offset: 0,
        searchContent: ""
      };
      this.$refs.joinApplicationList.getList()
    }
  }
};
</script>

<style lang="less" scoped>
.joinApplication {
  display: flex;
  height: 100%;
  width: 100%;
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