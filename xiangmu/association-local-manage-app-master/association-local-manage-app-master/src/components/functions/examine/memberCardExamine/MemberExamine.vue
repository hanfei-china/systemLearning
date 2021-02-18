<template>
  <div class="container-memberExamine" v-loading="loading">
    <member-list class="memberList" @selectOneInfo="selectOneInfo" @changeLoading="changeLoading" :rightSelectItem="rightSelectItem"></member-list>
    <member-info ref="memberinfos" class="memberInfo" :showItemInfo="rightShowInfo" @changeItem="changeItem"></member-info>
  </div>
</template>

<script>
import memberList from "./memberList";
import memberInfo from "./memberInfo";
export default {
  name: "memberCardExamine",
  components: { memberList, memberInfo },
  data(){
    return {
      rightShowInfo:null,
      rightSelectItem:0,
      loading:false
    }
  },
  methods:{
    selectOneInfo(data){
      this.rightShowInfo=data;
    },
    changeItem(data){
      this.rightSelectItem=data;
    },
    changeLoading(bol){
      this.loading = bol
    }
  }
};
</script>

<style lang="less" scoped>
.container-memberExamine{
  width: 100%;
  display: flex;
  height: 100%;
  .memberList{
    width: 400px;
    box-sizing: border-box;
    border-right: 1px solid #E6E6E6;
  }
  .memberInfo{
    width:calc(100vw - 600px) ;
  }
}
</style>
