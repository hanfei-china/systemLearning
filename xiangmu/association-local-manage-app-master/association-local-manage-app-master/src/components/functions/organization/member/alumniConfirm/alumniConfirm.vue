<template>
  <div class="alumniConfirm">
    <div class="alumniConfirm-header">
      <div class="alumniConfirm-header__left">疑似校友确认</div>
      <el-button @click="close" size="small" type="danger">返回</el-button>
    </div>
    <div class="alumniConfirm-body">
      <alumni-list class="alumniConfirm-body__list" @clickOneAlumni="clickOneAlumni" @toCreateNew="toCreateNew"></alumni-list>
      <alumni-info class="alumniConfirm-body__info" :clickAlumni="clickAlumni"></alumni-info>
    </div>
  </div>
</template>

<script>
import alumniList from "./alumniList";
import alumniInfo from "./alumniInfo";
export default {
  name: "alumniConfirm",
  components: { alumniInfo, alumniList },
  data(){
    return {
      clickAlumni:{}
    }
  },
  methods:{
    clickOneAlumni(info){
      this.clickAlumni=JSON.parse(JSON.stringify(info));
    },
    toCreateNew(info){
      this.$emit('toCreateNew',info);
    },
    close(){
      this.$emit('close');
      this.$emit('refresh-members');
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