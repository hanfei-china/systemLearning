<template>
  <div class="container-memberExamine">
    <member-list class="memberList" @getSameIds="getSameIds" @selectOneInfo="selectOneInfo" :rightSelectItem="rightSelectItem"></member-list>
    <!-- <div class="middleSpace"></div> -->
    <member-info ref="memberinfos" class="memberInfo" :showItemInfo="rightShowInfo" @changeItem="changeItem"></member-info>
  </div>
</template>

<script>
import memberList from "./memberList";
import memberInfo from "./memberInfo";
export default {
  name: "MemberExamine",
  components: { memberList, memberInfo },
  data(){
    return {
      rightShowInfo:{},
      rightSelectItem:0
    }
  },
  methods:{
    selectOneInfo(data){
      this.rightShowInfo=JSON.parse(JSON.stringify(data));
    },
    changeItem(data){
      this.rightSelectItem=data;
    },
    getSameIds(callback){
      var similerList = this.$refs.memberinfos.similerList
      var idList = similerList.filter((item)=>item.checked)
      var str=""
      if(idList.length>0){
        for (const option of idList) {
          str += option.id + ",";
        }
        str = str.slice(0, -1);
      }
      callback(str)
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
    // min-width: 360px;
    // width: 25%;
    width: 400px;
    box-sizing: border-box;
    border-right: 1px solid #E6E6E6;
  }
  .memberInfo{
    // width: 65%;
    // flex: 1;
    width:calc(100vw - 600px) ;
  }
  // .middleSpace{
  //   width: 5px;
  //   height: 100%;
  //   background-color: rgb(215, 215, 215);
  // }
}
</style>
