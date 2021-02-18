<template>
  <div class="branchListManage">
    <branch-list ref="branchList" class="branchList" @selectOneBranch="selectOneBranch"></branch-list>
    <branch-tabel ref="branchTabel" class="branchTabel" @addBranch="addEditBranch" @showBranch="showOneBranch" :selectBranch="selectBranch" @updataList='updataBranchList'></branch-tabel>
    <add-branch :branchForm="branchForm" v-if="ifAddBranch" @close="closeAddBranch" class="addBranch"></add-branch>
    <show-branch v-if="ifShowBranch" :showBranchInfo="showBranchInfo" @close="ifShowBranch=false"></show-branch>
  </div>
</template>

<script>
import showBranch from './showBranch'
import branchList from "./branchList";
import branchTabel from "./branchTabel";
import addBranch from './addBranch'
export default {
  name: "branchListManage",
  components: { branchList, branchTabel, addBranch, showBranch },
  data(){
    return {
      ifAddBranch:false,
      selectBranch:'all',
      branchForm:{},
      ifShowBranch:false,
      showBranchInfo:{}
    }
  },
  methods:{
    selectOneBranch(id){
      this.selectBranch=id;
    },
    updataBranchList(id){
      this.$refs.branchList.getBranchList(id);
    },
    addEditBranch(data,info){
      this.ifAddBranch=true;
      if (data) {
        this.branchForm=JSON.parse(JSON.stringify(info));
      }else{
        this.branchForm=null;
      }
    },
    closeAddBranch(data){
      this.ifAddBranch=false
      if (data) {
        this.$refs.branchTabel.getBranchList();
      }
    },
    showOneBranch(info){
      this.showBranchInfo=JSON.parse(JSON.stringify(info));
      this.ifShowBranch=true;
    }
  }
};
</script>

<style scoped lang="less">
.branchListManage {
  // padding: 15px;
  box-sizing: border-box;
  display: flex;
  position: relative;
  height: 100%;
  .branchList{
      height: 100%;
      width: 260px;
      margin-right: 5px;
  }
  .branchTabel{
      width: calc(100% - 265px);
      height: 100%;
  }
  .addBranch{
    position: absolute;
    z-index: 666;
    top: 0;
    left: 0;
    // right: 0;
    // bottom: 0;
    width: 100%;
    background-color: #fff;
  }
}
</style>