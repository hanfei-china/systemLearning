<template>
  <div class="alumniConfirm">
    <div class="alumniConfirm-header">
      <div class="alumniConfirm-header__left">校友资讯更新</div>
      <el-button @click="close" size="small" type="danger">返回</el-button>
    </div>
    <div class="alumniConfirm-body">
      <updata-list :selectInfoList="selectInfoList" @clickOneAlumni="clickOneAlumni" class="alumniConfirm-body__list"></updata-list>
      <!-- <div style="width:5px;background-color: #d7d7d7;"></div> -->
      <updata-info @selectInfo="selectInfo" :selectOneAlumni="selectOneAlumni" class="alumniConfirm-body__info"></updata-info>
    </div>
  </div>
</template>

<script>
import updataList from "./updataList";
import updataInfo from "./updataInfo";
export default {
  name: "alumniUpdata",
  components: { updataList, updataInfo },
  data(){
    return {
      selectOneAlumni:{},
      selectInfoList:[]
    }
  },
  methods:{
    close(){
      this.$emit('close');
      this.$emit('refresh-members');
    },
    clickOneAlumni(info){
      this.selectOneAlumni=JSON.parse(JSON.stringify(info));
    },
    selectInfo(info){
      this.selectInfoList=JSON.parse(JSON.stringify(info));
    }
  }
};
</script>

<style lang="less" scoped>
.alumniConfirm {
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: rgb(12, 25, 44);
  overflow: auto;
}

.alumniConfirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: 49px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(228, 228, 228);
}
.alumniConfirm-header__left {
  padding: 0 15px;
  border-left: 3px solid rgb(12, 25, 44);
  font-size: 16px;
  font-weight: 700;
}

.alumniConfirm-body {
  height: calc(100% - 49px);
  display: flex;
  justify-content: space-between;
}
.alumniConfirm-body__list {
  width: 525px;
  height: calc(100%);
  border-right: 1px solid #e6e6e6;
}
.alumniConfirm-body__info {
  width: calc(100% - 530px);
  min-width: 600px;
  overflow: auto;
  height: 100%;
}
</style>