<template>
  <el-container class="unset-padding">
    <el-main class="unset-padding" style="padding-bottom: 60px">
      <p style="text-align: center;padding: 10px 0">尚未配置{{noConfigureType==='website'?'站群':'微信公众号'}}信息</p>
      <p style="text-align: center;padding: 10px 0">
        请
        <span style="text-decoration: underline #3FA1B6;color: #3FA1B6;cursor: pointer" @click="toUrl">点击这里</span>
        去配置{{noConfigureType==='website'?'站群':'微信公众号'}}信息</p>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "dialogNoConfigure",
  props:['noConfigureType'],
  methods:{
    toUrl(){
      if(this.noConfigureType==='website'){
        this.$router.push({path:'/console/system/setting/systemSetting',query:{toSetting:'websiteSetting'}})
      }else if(this.noConfigureType==='wechat'){
        this.$router.push({path:'/console/system/setting/systemSetting',query:{toSetting:'wxSetting'}})
      }
    }
  }
}
</script>

<style scoped>
.flex-align-end {
  align-items: flex-end;
}

</style>
