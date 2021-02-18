<template>
  <div class="branchList">
    <header class="brachListHeader">分会类型</header>
    <div class="branchListContainer">
      <ul>
        <li
          :class="{'selectBranch':selectBranch==='all'}"
          @click="selectOneBranch('all')"
        >全部（{{total}}）</li>
        <li
          v-for="item in branchList"
          :key="item.id"
          :class="{'selectBranch':selectBranch===item.id}"
          @click="selectOneBranch(item.id)"
        >{{item.name+'('+item.branchList.length+')'}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "branchList",
  data() {
    return {
      selectBranch: "all",
      total: 0,
      branchList: []
    };
  },
  created() {
    this.getBranchList();
  },
  methods: {
    getBranchList(data) {
      this.$request
        .get("/api/common/branch/branchListAndBranchType")
        .then(res => {
          //   console.log(res);
          this.total = 0;
          this.branchList = JSON.parse(JSON.stringify(res.data));
          res.data.forEach(item => {
            this.total += item.branchList.length;
          });
          if (data) {
            this.selectBranch = data;
          }
        });
    },
    selectOneBranch(id) {
      this.selectBranch = id;
      this.$emit("selectOneBranch", this.selectBranch);
    }
  }
};
</script>

<style lang="less" scoped>
.branchList {
  color: rgb(51, 51, 51);
  font-size: 14px;
  line-height: 45px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .brachListHeader {
    padding-left: 20px;
    color: #626262;
    font-weight: 700;
  }
  .branchListContainer {
    flex: 1;
    color: #626262;
    ul {
      li {
        list-style-type: disc;
        list-style-position: inside;
        padding-left: 25px;
        cursor: pointer;
        margin-bottom: 3px;
        transition: all 0.3s;
        &:hover {
          background-color: #f4f6f8;
          color: #3fa1b6;
        }
      }
      .selectBranch {
        background-color: #f4f6f8;
        color: #3fa1b6;
      }
    }
  }
}
</style>