<template>
  <div class="logout-wrapper">
    <div class="logout" :style="logoutStyle">{{title}}</div>
  </div>
</template>

<script>
  export default {
    name: "logout",
    props:{
      module: Object
    },
    computed:{
      attributes() {
        return this.module.attributes;
      },
      title() {
        return this.attributes.title.value;
      },
      color() {
        return this.attributes.color.value;
      },
      backgroundColor() {
        return this.attributes.backgroundColor.value;
      },
      logoutStyle(){
        return {
          color : this.color,
          backgroundColor : this.backgroundColor
        }
      }
    }
  }
</script>

<style scoped>
.logout-wrapper{
  padding: 16px;
}
.logout{
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
